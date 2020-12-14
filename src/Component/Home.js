import React from "react";
import {
    Button, Jumbotron
  } from 'reactstrap';
  
function HomeContent(props) {
  if(props.authVar){
    return(
      <div>
        <h2>Hello {props.username.displayName}</h2>
        <p>If you see this text, you are logging!</p>
        <Button color="primary" onClick={props.authButton}>Sign-out</Button>
      </div>
    );
  }
  return <Button color="primary" onClick={props.authButton}>Sign-in</Button>
}  

export default class Home extends React.Component {
  render() {
    return (
      <Jumbotron>
        <h1>Microsoft Identity Demo</h1>
        <HomeContent
          authVar={this.props.authVar}
          username={this.props.username}
          authButton={this.props.authButton}
        />
      </Jumbotron>
    );
  }
}
 