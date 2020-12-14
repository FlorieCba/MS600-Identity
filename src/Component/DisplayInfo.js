import React, { Component } from "react";
import {
  Jumbotron
} from 'reactstrap';

class DisplayInfo extends Component {
  render() {
    return (
      <Jumbotron>
        <h2>Display useful information, </h2>
        <p>from AAD, from login or logout, from Authentication, from connection with Graph. Here some ideas to display:</p>
        <ol>
          <li>Role-based access control</li>
          <li>Steps</li>
          <li>Email addresses</li>
          <li>Names</li>
          <li>Groups</li>
          <li>Job position</li>
        </ol>
        </Jumbotron>
    );
  }
}
 
export default DisplayInfo;