import React, {Component} from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import * as Validate from "../book.management.components/common.validations";
import AuthorsService from "../../../services/authors.service";

export default class AddAuthorPage extends Component {
    constructor(props) {
        super(props);

        this.handleAuthorCreateProcess = this.handleAuthorCreateProcess.bind(this);
        this.onChangeAuthorName = this.onChangeAuthorName.bind(this);

        this.state = {
            authorName: "",
            loading: false,
            message: "",
            successful: false,
        };

    }

    onChangeAuthorName(e) {
        this.setState({
            authorName: e.target.value
        })
    }

    updateRedirectCounter() {
        let upTo = 5;
        let counts = setInterval(updated, 1000);

        function updated() {
            let count = document.getElementById("redirectCounter");
            if (count != null) {
                count.innerHTML = "You will be redirected to author list after " + (--upTo).toString() + " seconds...";
                if (upTo === 0) {
                    clearInterval(counts);
                }
            }
        }
    }

    handleAuthorCreateProcess(e) {
        e.preventDefault();

        this.setState({
            message: "",
            loading: true,
            successful: false
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            AuthorsService.createAuthor(
                this.state.authorName
            ).then(
                response => {
                    this.setState({
                        successful: true,
                        message: response.message
                    });

                    this.updateRedirectCounter();

                    setTimeout(() => {
                        this.props.history.push("/manageAuthors");
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

    render() {

        return (
            <div className="col-md-12">
                <div className="card card-container">

                    <img
                        src="https://img.icons8.com/material-rounded/96/000000/writer-male.png"
                        alt="add-author-img"
                        className="profile-img-card"
                    />

                    <Form
                        onSubmit={this.handleAuthorCreateProcess}
                        ref={c => {
                            this.form = c;
                        }}
                    >
                        {!this.state.successful && (
                            <div>

                                <div className="form-group">
                                    <label htmlFor="authorName">Author Name:</label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="authorName"
                                        value={this.state.authorName}
                                        onChange={this.onChangeAuthorName}
                                        validations={[Validate.vName, Validate.required]}
                                    />
                                </div>

                                <div className="form-group">
                                    <button
                                        className="btn btn-primary btn-block"
                                        disabled={this.state.loading}
                                    >
                                        {this.state.loading && (
                                            <span className="spinner-border spinner-border-sm"></span>
                                        )}
                                        <span>Create Author</span>
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
                                    You will be redirected to author list after 5 seconds...
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

