
import './App.css';
import React, { Component } from "react";
import {
  Route,
  NavLink,
  BrowserRouter as Router
} from "react-router-dom";
import {Container} from 'reactstrap';
import Home from "./Component/Home";
import Contact from "./Component/Contact";
import DisplayInfo from "./Component/DisplayInfo";
import 'bootstrap/dist/css/bootstrap.css';
import {PublicClientApplication} from "@azure/msal-browser";



export default class App extends Component {
  constructor(props) {
    super(props);

    /* AUTH OBJECT */
    this.msalInstance = new PublicClientApplication( {
      auth: {
          clientId: 'a3fc7bff-3330-4bac-b4b5-24a46cbefd84',
          authority: 'https://login.microsoftonline.com/cd7dc162-dec0-4933-9cdc-17a6f076e1f0',
          redirectUri: 'http://localhost:3000'
      }
    });
    
    /* LOGIN REQUEST */
    this.loginRequest = {
      scopes: ["User.Read","sites.read.all"]
     };
    
     /* STATE */
    this.state = {
      authVar:false,
      username: {},
      documents:[]
    };

  }

  componentDidMount(){
        this.msalInstance.handleRedirectPromise()
        .then(async (s) => {
          console.log(s);
          if (s !== null)
          {
            console.log('success');
            await this.getUserInfo();
          }
        })
        .catch((a) => {
          console.log('err');
          console.log(a);
        });
      }
    
  
  render(){
    return (
      <Router>
      <div>
        <ul className="header">
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/displayinfo">Information</NavLink></li>
          <li><NavLink to="/contact">Contact</NavLink></li>
        </ul>
        <Container>
        <Route exact path="/" render = {(props) =>
              <Home {...props}
              authVar={this.state.authVar}
              username={this.state.username}
              authButton={this.state.authVar ? this.signOut : this.signIn}
              documents={this.state.documents}/>
            }/>
          <Route path="/displayinfo" component={DisplayInfo}/>
          <Route path="/contact" component={Contact}/>
        </Container>
      </div>
    </Router>
    );
  } 

  /* SIGN IN */
  signIn = async () => {
    /*await this.msalInstance.loginPopup({
      scopes: ["user.read"]
    });
    await this.getUserInfo();*/
    var popUp = await this.msalInstance.loginPopup({
              scopes: ["user.read","sites.read.all"]
            }).catch((error) => {
          console.log(error);
      });

      //popUp = null;

      if (popUp == null || typeof(popUp)=='undefined') {  
        alert('Pop Up Blocker is activated. Pop Up Login cancelled. Redirect mode.'); 
        
        await this.msalInstance.loginRedirect({
                          scopes: ["user.read","sites.read.all"]
          }); 
       } 

      else{
        await this.getUserInfo();
        await this.getUserDocs();

      }
  
  }

  /* SIGN OUT */
  signOut = () => {
    this.msalInstance.logout();
  }

  /* GET USER INFORMATION */
  async getUserInfo(){
    this.getTokenPopup(this.loginRequest).then(response => {
        var token = response.accessToken;
        console.log(token);
        return this.getUserDetails(token); 
      });
  }

  /* GET DOCUMENTS */
  async getUserDocs(){
      this.getTokenPopup(this.loginRequest).then(response => {
      var token = response.accessToken;
      console.log(token);
      return this.getUserDetailsDocuments(token); 
      });
  }
    
  
  /* GET TOKEN for the graph access*/
  async getTokenPopup(request) {
    const currentAccounts = this.msalInstance.getAllAccounts();
    this.username = currentAccounts[0].username;
    console.log(this.username);

    request.account = this.msalInstance.getAccountByUsername(this.username);

    return this.msalInstance.acquireTokenSilent(request);  
  }

  /* ACCESS GRAPH to get user details */
  async getUserDetails(token) {
    const endpoint = "https://graph.microsoft.com/v1.0/me";
    const options = {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
      }
    };

    fetch(endpoint, options).then(async (response) => {
            var res = await response.json();
            console.log(res);        
            this.setState({
                authVar: true,
                  username: {
                  displayName: res.displayName
                  }
            });
            return res;
    });
  }

  /* ACCESS GRAPH to get user documents */
    async getUserDetailsDocuments(token) {
      //PART 1
      const endpoint = "https://graph.microsoft.com/v1.0/me/insights/used?$filter=ResourceVisualization/containerType eq 'OneDriveBusiness'&$top=3";
      const options = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
      };

      //PART 2
      fetch(endpoint, options).then(async (response) => {
            var res = await response.json();
            console.log(res);
            var docs = [];
            res.value.forEach((v) => {
              docs.push({ url: v.resourceReference.webUrl, name: v.resourceVisualization.title });
            });
            this.setState({
              documents: docs
            });
            return res;
      });
        
    
    }
    
}

