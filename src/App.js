
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
          clientId: '',
          authority: '',
          redirectUri: 'http://localhost:3000'
      }
    });
    
    /* LOGIN REQUEST */
    this.loginRequest = {
      scopes: ["User.Read"]
     };
    
     /* STATE */
    this.state = {
      authVar:false,
      username: {}
    };

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
              authButton={this.state.authVar ? this.signOut : this.signIn} />
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
    //TO DO
  }

  /* SIGN OUT */
  signOut = () => {
    //TO DO
  }

  /* GET USER INFORMATION */
  async getUserInfo(){
    //TO DO
  }
  
  /* GET TOKEN for the graph access*/
  async getTokenPopup(request) {
    //TO DO
  }

  /* ACCESS GRAPH to get user details */
  async getUserDetails(token) {
    //TO DO
  }
}

