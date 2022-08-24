import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./style.css";
import AuthService from "./auth/auth.service";
import Login from "./components/login-components/login.component";
import Register from "./components/login-components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardAdmin from "./components/admin-components/board-admin.component";
import EventBus from "./common/EventBus";
import EditBookPage from "./components/admin-components/book.management.components/edit.book.component";
import AddBookPage from "./components/admin-components/book.management.components/add.book.component";
import ManageUsers from "./components/admin-components/user.management.components/user-list.component";
import EditUserPage from "./components/admin-components/user.management.components/edit.user.component";
import AddUserPage from "./components/admin-components/user.management.components/add.user.component";
import AddAuthorPage from "./components/admin-components/author.management.components/add.author.component";
import EditAuthorPage from "./components/admin-components/author.management.components/edit.author.component";
import ManageAuthors from "./components/admin-components/author.management.components/author-list.component";
// import AuthVerify from "./common/auth-verify";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }

    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showAdminBoard: false,
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser, showAdminBoard } = this.state;

    return (
        <div>

          <nav className="navbar navbar-expand navbar-dark bg-dark">

            <Link to={"/"} className="navbar-brand">
              Book Rental
            </Link>


            <div className="navbar-nav mr-auto">

              <li className="nav-item">
                <Link to={"/home"} className="nav-link">
                  Home
                </Link>
              </li>

              {showAdminBoard && (
                  <li className="navigation">
                    <a href="/admin">Admin Board</a>
                    <div className="navigation-content">
                      <a href="/manageUsers">Manage Users</a>
                      <a href="/manageBooks">Manage Books</a>
                      <a href="/manageAuthors">Manage Authors</a>
                    </div>
                  </li>
              )}

              {!showAdminBoard && currentUser && (
                  <li className="nav-item">
                    <Link to={"/user"} className="nav-link">
                      User Board
                    </Link>
                  </li>
              )}


            </div>

            {currentUser ? (
                <div className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link to={"/profile"} className="nav-link">
                      {currentUser.username}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <a href="/login" className="nav-link" onClick={this.logOut}>
                      LogOut
                    </a>
                  </li>
                </div>
            ) : (
                <div className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link to={"/login"} className="nav-link">
                      Login
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link to={"/register"} className="nav-link">
                      Sign Up
                    </Link>
                  </li>


                </div>
            )}
          </nav>


          <div className="container mt-3">

            <Switch>

              <Route exact path={["/", "/home", ""]} component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/profile" component={Profile} />
              <Route exact path={["/user", "/manageBooks"]} component={BoardUser} />
              <Route exact path="/admin" component={BoardAdmin} />

              <Route exact path="/addBook" component={AddBookPage}/>
              <Route exact path="/editBook" component={EditBookPage} />

              <Route exact path="/manageUsers" component={ManageUsers} />
              <Route exact path="/editUser" component={EditUserPage} />
              <Route exact path="/createUser" component={AddUserPage} />

              <Route exact path="/createAuthor" component={AddAuthorPage} />
              <Route exact path="/editAuthor" component={EditAuthorPage} />
              <Route exact path="/manageAuthors" component={ManageAuthors} />


            </Switch>

          </div>

          { /*<AuthVerify logOut={this.logOut}/> */ }
        </div>
    );
  }
}

export default App;

