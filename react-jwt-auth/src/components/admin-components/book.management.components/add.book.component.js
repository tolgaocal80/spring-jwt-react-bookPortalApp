import React, {Component} from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import BooksService from "../../../services/books.service";
import * as Validate from "./common.validations";

export default class AddBookPage extends Component {
    constructor(props) {
        super(props);
        this.handleSaveProcess = this.handleSaveProcess.bind(this);
        this.onChangeIsbn = this.onChangeIsbn.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.onChangeYear = this.onChangeYear.bind(this);
        this.onChangePageNumber = this.onChangePageNumber.bind(this);
        this.onChangeAuthorName = this.onChangeAuthorName.bind(this);

        const selectedAuthor = this.getSelectedAuthor();
        let selectedAuthorName = "";
        if (selectedAuthor && selectedAuthor.name){
            selectedAuthorName = selectedAuthor.name;
        }

        this.state = {
            isbn: "",
            name: "",
            type: "",
            year: 0,
            pageNumber: 0,
            authorName: selectedAuthorName,
            loading: false,
            message: "",
            successful: false
        };
    }

    getSelectedAuthor() {
        return JSON.parse(localStorage.getItem("selectedAuthor"));
    }

    onChangeIsbn(e) {
        this.setState({
            isbn: e.target.value
        });
    }

    onChangeName(e) {
        this.setState({
            name: e.target.value
        })
    }

    onChangeType(e) {
        this.setState({
            type: e.target.value
        })
    }

    onChangeYear(e) {
        this.setState({
            year: e.target.value
        })
    }

    onChangePageNumber(e) {
        this.setState({
            pageNumber: e.target.value
        })
    }

    onChangeAuthorName(e) {
        this.setState({
            authorName: e.target.value
        })
    }

    updateRedirectCounter() {
        let upTo = 6;
        let counts = setInterval(updated, 1000);

        function updated(){
            let count = document.getElementById("redirectCounter");
            if(count != null){
                count.innerHTML = "You will be redirected to book list after " + (--upTo).toString() + " seconds...";
                if(upTo===0){
                    clearInterval(counts);
                }
            }
        }
    }

    handleSaveProcess(e) {
        e.preventDefault();

        this.setState({
            message: "",
            loading: true,
            successful: false
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            BooksService.createBook(
                this.state.isbn,
                this.state.name,
                this.state.type,
                this.state.year,
                this.state.pageNumber,
                this.state.authorName,
            ).then(
                response => {
                    this.setState({
                        successful: true,
                        message: response.message
                    });
                    this.updateRedirectCounter();

                    setTimeout(() => {
                        this.props.history.push("/manageBooks");
                    //    window.location.reload();
                    }, 5000)
                },

                error => {
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
                        src="https://img.icons8.com/external-flaticons-flat-flat-icons/64/000000/external-books-lifestyles-flaticons-flat-flat-icons-2.png"
                        alt="add-book-img"
                        className="photo"
                    />

                    <Form
                        onSubmit={this.handleSaveProcess}
                        ref={c => {
                            this.form = c;
                        }}
                    >
                        {!this.state.successful && (
                            <div>

                                <div className="form-group">
                                    <label htmlFor="name">Book Name:</label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={this.state.name}
                                        onChange={this.onChangeName}
                                        validations={[Validate.required, Validate.vName]}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="type">Book Type:</label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="type"
                                        value={this.state.type}
                                        onChange={this.onChangeType}
                                        validations={[Validate.required, Validate.vType]}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="year">Book Year:</label>
                                    <Input
                                        type="number"
                                        className="form-control"
                                        name="year"
                                        value={this.state.year}
                                        onChange={this.onChangeYear}
                                        validations={[Validate.required, Validate.vYear]}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="isbn">Book ISBN:</label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="isbn"
                                        value={this.state.isbn}
                                        onChange={this.onChangeIsbn}
                                        validations={[Validate.required, Validate.vIsbn]}
                                    />
                                </div>


                                <div className="form-group">
                                    <label htmlFor="authorName">Author Name:</label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="authorName"
                                        value={this.state.authorName}
                                        onChange={this.onChangeAuthorName}
                                        validations={[Validate.required, Validate.vAuthorName]}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="pageNumber">Page Number:</label>
                                    <Input
                                        type="number"
                                        className="form-control"
                                        name="pageNumber"
                                        value={this.state.pageNumber}
                                        onChange={this.onChangePageNumber}
                                        validations={[Validate.required, Validate.vPageNumber]}
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
                                        <span>Add Book</span>
                                    </button>
                                </div>

                            </div>
                        )}

                        {this.state.message && (

                            <div className="form-group">

                                <div className={
                                    this.state.successful &&
                                         "alert alert-success"
                                        } id="redirectCounter"
                                     role="alert"
                                >
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