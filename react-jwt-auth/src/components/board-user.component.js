import React, { Component } from "react";
import AuthService from "../auth/auth.service";
import BooksList from "./books-list.component";

export default class BoardUser extends Component {

  constructor(props) {
    super(props);

    if (AuthService.getCurrentUser()){
      this.state = {
        content: "",
        currentUser: AuthService.getCurrentUser()
      };
    }else{
      this.state = {
        content: "",
        currentUser: undefined
      };
    }
  }

  /*
  componentDidMount() {

    TestService.getUserBoard().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );

  }
   */

  render() {
    return (

      <div className="container">
        <div>
          <BooksList/>
        </div>

      </div>

    );
  }
}
