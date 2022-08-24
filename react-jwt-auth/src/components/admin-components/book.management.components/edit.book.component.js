import React, {Component} from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import BooksService from "../../../services/books.service";
import * as Validate from "./common.validations";

export default class EditBookPage extends Component {
    constructor(props) {
        super(props);

        this.handleSaveProcess = this.handleSaveProcess.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.onChangeYear = this.onChangeYear.bind(this);
        this.onChangePageNumber = this.onChangePageNumber.bind(this);
        this.onChangeAuthorName = this.onChangeAuthorName.bind(this);
        this.onChangeIsbn = this.onChangeIsbn.bind(this);

        const currentBook = this.getCurrentBook();

        this.state = {
            name: currentBook.name,
            type: currentBook.type,
            year: currentBook.year,
            pageNumber: currentBook.pageNumber,
            authorName: currentBook.authorName,
            loading: false,
            message: "",
            successful: false,
            isbn: currentBook.isbn
        };
    }

    onChangeName(e) {
        this.setState({
            name: e.target.value
        })
    }

    onChangeIsbn(e) {
        this.setState({
            isbn: e.target.value
        });
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
        let upTo = 5;
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

        const currentBook = this.getCurrentBook();

        if (this.checkBtn.context._errors.length === 0) {
            BooksService.updateBook(
                currentBook.id,
                this.state.name,
                this.state.authorName,
                this.state.type,
                this.state.pageNumber,
                this.state.year,
                this.state.isbn
            ).then(
                response => {
                    this.setState({
                        successful: true,
                        message: response.message
                    });

                    this.updateRedirectCounter();

                    setTimeout(() => {
                        this.props.history.push("/manageBooks");
                  //      window.location.reload();
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

    getCurrentBook(){
        return JSON.parse(localStorage.getItem("currentBook"));
    }

    render() {

        const currentBook = this.getCurrentBook();

        return (
            <div className="col-md-12">
                <div className="card card-container">

                    <img
                        src="https://img.icons8.com/ios/100/000000/edit-property.png"
                        alt="edit-book-img"
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
                                        defaultValue={currentBook.name}
                                        value={this.state.name}
                                        onChange={this.onChangeName}
                                        validations={[Validate.vName]}
                                    />

                                </div>

                                <div className="form-group">
                                    <label htmlFor="type">Book Type:</label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="type"
                                        defaultValue={currentBook.type}
                                        value={this.state.type}
                                        onChange={this.onChangeType}
                                        validations={[Validate.vType]}
                                    />
                                </div>


                                <div className="form-group">
                                    <label htmlFor="isbn">Book ISBN:</label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="isbn"
                                        defaultValue={currentBook.isbn}
                                        value={this.state.isbn}
                                        onChange={this.onChangeIsbn}
                                        validations={[Validate.vIsbn]}
                                    />
                                </div>


                                <div className="form-group">
                                    <label htmlFor="year">Book Year:</label>
                                    <Input
                                        type="number"
                                        className="form-control"
                                        name="year"
                                        defaultValue={currentBook.year}
                                        value={this.state.year}
                                        onChange={this.onChangeYear}
                                        validations={[Validate.vYear]}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="authorName">Author Name:</label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="authorName"
                                        defaultValue={currentBook.authorName}
                                        value={this.state.authorName}
                                        onChange={this.onChangeAuthorName}
                                        validations={[Validate.vAuthorName]}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="pageNumber">Page Number:</label>
                                    <Input
                                        type="number"
                                        className="form-control"
                                        name="pageNumber"
                                        value={this.state.pageNumber}
                                        defaultValue={currentBook.pageNumber}
                                        onChange={this.onChangePageNumber}
                                        validations={[Validate.vPageNumber]}
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
                                        <span>Edit Book</span>
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
                                    You will be redirected to book list after 5 seconds...
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