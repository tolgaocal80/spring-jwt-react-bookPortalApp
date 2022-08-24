import React, {Component} from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import * as Validate from "../book.management.components/common.validations";
import UsersService from "../../../services/users.service";
import Select from "react-select";
import AuthService from "../../../auth/auth.service";


export default class EditUserPage extends Component {
    constructor(props) {
        super(props);

        this.handleUserEditProcess = this.handleUserEditProcess.bind(this);
        this.onChangeUserName = this.onChangeUserName.bind(this);
        this.onChangeUserRole = this.onChangeUserRole.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);

        const selectedUser = this.getSelectedUser();

        this.state = {
            username: selectedUser.username,
            password: "",
            roles: "",
            loading: false,
            message: "",
            successful: false,
        };

    }

    onChangeUserName(e) {
        this.setState({
            username: e.target.value
        })
    }

    onChangePassword(e) {
        if (e.target.value) {
            this.setState({
                password: e.target.value
            })
        }
    }


    onChangeUserRole = (value) => {
        this.setState({
            roles: value
        });
    }

    updateRedirectCounter() {
        let upTo = 5;
        let counts = setInterval(updated, 1000);

        function updated() {
            let count = document.getElementById("redirectCounter");
            if (count != null) {
                count.innerHTML = "You will be redirected to user list after " + (--upTo).toString() + " seconds...";

                if (upTo === 0) {
                    clearInterval(counts);
                }
            }
        }
    }

    handleUserEditProcess(e) {
        e.preventDefault();

        this.setState({
            message: "",
            loading: true,
            successful: false
        });

        this.form.validateAll();

        const selectedUser = this.getSelectedUser();

        if (this.checkBtn.context._errors.length === 0) {
            UsersService.updateUser(
                selectedUser.id,
                this.state.username,
                this.state.password,
                this.state.roles.value
            ).then(
                response => {
                    this.setState({
                        successful: true,
                        message: response.message
                    });

                    this.updateRedirectCounter();

                    setTimeout(() => {
                        this.props.history.push("/manageUsers");
                    }, 5000)

                }, error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    this.setState({
                        loading: false,
                        message: resMessage,
                        successful: false
                    });
                }
            );
        } else {
            this.setState({
                loading: false
            })
        }
    }

    getSelectedUser() {
        return JSON.parse(localStorage.getItem("selectedUser"));
    }

    render() {

        const selectedUser = this.getSelectedUser();
        const currentUser = AuthService.getCurrentUser();

        const options = [
            {value: 'ROLE_ADMIN', label: 'Admin'},
            {value: 'ROLE_USER', label: 'User'},
        ];

        return (
            <div className="col-md-12">
                <div className="card card-container">

                    <img
                        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                        alt="edit-user-img"
                        className="profile-img-card"
                    />

                    <Form
                        onSubmit={this.handleUserEditProcess}
                        ref={c => {
                            this.form = c;
                        }}
                    >
                        {!this.state.successful && (
                            <div>

                                <div className="form-group">
                                    <label htmlFor="username">User Name:</label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="username"
                                        defaultValue={selectedUser.username}
                                        value={this.state.username}
                                        onChange={this.onChangeUserName}
                                        validations={[Validate.email]}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password">Password:</label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="password"
                                        value={this.state.password}
                                        onChange={this.onChangePassword}
                                        validations={[Validate.vPassword]}
                                    />
                                </div>

                                {selectedUser.id === currentUser.id ? (<div/>) : (
                                    <div className='form-group'>
                                        <label>User Role:</label>
                                        <Select
                                            value={this.state.roles}
                                            onChange={this.onChangeUserRole}
                                            options={options}
                                        />
                                    </div>
                                )
                                }


                                <div className="form-group">
                                    <button
                                        className="btn btn-primary btn-block"
                                        disabled={this.state.loading}
                                    >
                                        {this.state.loading && (
                                            <span className="spinner-border spinner-border-sm"></span>
                                        )}
                                        <span>Update User</span>
                                    </button>
                                </div>


                            </div>
                        )}


                        {this.state.message && (
                            <div className="form-group">

                                <div className={
                                    this.state.successful
                                        ? "alert alert-success"
                                        : "alert alert-danger"} id="redirectCounter"
                                     role="alert"
                                >
                                    You will be redirected to user list after 5 seconds...
                                </div>

                                &emsp;&emsp;

                                <div
                                    className={
                                        this.state.successful
                                            ? "alert alert-success"
                                            : "alert alert-danger"
                                    }
                                    role="alert"
                                >
                                    {this.state.message}
                                </div>
                            </div>
                        )}

                        <CheckButton
                            style={{display: "none"}}
                            ref={c => {
                                this.checkBtn = c;
                            }}
                        />
                    </Form>

                </div>
            </div>

        );
    }

}

