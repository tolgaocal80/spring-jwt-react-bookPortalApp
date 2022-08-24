import React, {Component} from "react";
import Pagination from "@material-ui/lab/Pagination"
import AuthService from "../../../auth/auth.service";
import {Button} from "@material-ui/core";
import {AddBox, Delete, Edit} from "@material-ui/icons";
import AuthorsService from "../../../services/authors.service";

export default class ManageAuthors extends Component {
    constructor(props) {
        super(props);

        this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
        this.retrieveAuthors = this.retrieveAuthors.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.setActiveAuthor = this.setActiveAuthor.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handlePageSizeChange = this.handlePageSizeChange.bind(this);

        this.state = {
            authors: [],
            selectedAuthor: null,
            currentIndex: -1,
            page: 1,
            count: 0,
            pageSize: 3,
            currentAuthor: undefined,
            searchAuthor: "",
            message: ""
        };
        this.pageSizes = [3, 6, 9];

    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser.roles.includes("ROLE_ADMIN")) this.setState({redirect: "/login"});
        this.retrieveAuthors();
    }

    onChangeSearchTitle(e) {
        const searchAuthor = e.target.value;
        this.setState({
            searchAuthor: searchAuthor,
        });
    }

    retrieveAuthors() {
        const {searchAuthor, page, pageSize} = this.state;
        AuthorsService.getAuthorsByNameWithPagination(searchAuthor, page - 1, pageSize)
            .then((response) => {
                    const {authors, totalPages} = response.data;
                    this.setState({
                        authors: authors,
                        count: totalPages
                    });
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    this.setState({
                        message: resMessage
                    });
                }
            ).catch((e) => {
            console.log(e);
        })
    }

    refreshList() {
        this.retrieveAuthors();
        this.setState({
            selectedAuthor: null,
            currentIndex: -1
        })
    }

    setActiveAuthor(author, index) {
        localStorage.setItem("selectedAuthor", JSON.stringify(author));
        this.setState({
            selectedAuthor: author,
            currentIndex: index
        });
    }

    handlePageChange(event, value) {
        this.setState({
                page: value
            }, () => {
                this.retrieveAuthors();
            }
        )
    }

    handlePageSizeChange(event) {
        this.setState({
            pageSize: event.target.value,
            page: 1
        }, () => {
            this.retrieveAuthors();
        })
    }

    deleteAuthor(authorId) {
        AuthorsService.removeAuthor(authorId)
            .then(this.refreshList);
    }

    render() {
        const {
            searchAuthor,
            authors,
            selectedAuthor,
            currentIndex,
            page,
            count,
            pageSize,
            message
        } = this.state;

        return (

            message ? (
                <div className="col-md-8">
                    <div className="alert alert-danger" role="alert">
                        {this.state.message}
                    </div>
                </div>
            ) : (
                <div className="list row">

                    <div className="col-md-8">
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search authors by name"
                                value={searchAuthor}
                                onChange={this.onChangeSearchTitle}
                            />
                            <div className="input-group-append">
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={this.retrieveAuthors}
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <h4>Author List</h4>

                        <div className="mt-3">
                            {"Items per Page: "}
                            <select onChange={this.handlePageSizeChange} value={pageSize}>
                                {this.pageSizes.map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>


                            <Pagination
                                className="my-3"
                                count={count}
                                page={page}
                                siblingCount={1}
                                boundaryCount={1}
                                variant="outlined"
                                shape="rounded"
                                onChange={this.handlePageChange}
                            />
                        </div>

                        <ul className="list-group">
                            {authors &&
                                authors.map((author, index) => (
                                    <li
                                        className={
                                            "list-group-item " +
                                            (index === currentIndex ? "active" : "")
                                        }
                                        onClick={() => {
                                            this.setActiveAuthor(author, index)
                                        }}
                                        key={index}
                                    >
                                        {author.name}
                                    </li>
                                ))}
                        </ul>

                    </div>

                    <div className="col-md-6">
                        {selectedAuthor ? (
                            <div className="bottom-margin">
                                <h4>Author</h4>

                                <div>
                                    <label>
                                        <strong>Author name:</strong>
                                    </label>{" "}
                                    {selectedAuthor.name}
                                </div>

                                <div>
                                    <label>
                                        <strong>Books Number:</strong>
                                    </label>{" "}
                                    {selectedAuthor.numberOfBooks}
                                </div>

                                <div>
                                    <label>
                                        <strong>Author id:</strong>
                                    </label>{" "}
                                    {selectedAuthor.id}
                                </div>


                                <div>
                                    <label>
                                        <strong>Create Date:</strong>
                                    </label>{" "}
                                    {selectedAuthor.createDate}
                                </div>


                                <div>
                                    <label>
                                        <strong>Books:</strong>
                                    </label>

                                    {" "}

                                    <ul>
                                        {selectedAuthor.books &&
                                            Array.from(selectedAuthor.books).map(
                                                (book, index) =>

                                                    <li key={index}>

                                                        <div className="list row">

                                                            <div className="col-md-6">
                                                                <strong>{book.name}</strong><br/>
                                                                <strong>Year</strong>: {book.year}<br/>
                                                                <strong>ISBN</strong>: {book.isbn}<br/>
                                                                <strong>{book.favoriteNumber}</strong> times favorited.<br/>
                                                                <strong>{book.readNumber}</strong> times read.<br/>
                                                            </div>

                                                            <div className="col-md-6">
                                                                <Button variant="outlined" startIcon={<Edit/>} onClick={() => {localStorage.setItem("currentBook", JSON.stringify(book))}} href="/editBook">
                                                                    Edit Book
                                                                </Button>
                                                            </div>

                                                        </div>
                                                    </li>

                                            )}
                                    </ul>

                                </div>




                                <div>
                                    <label>
                                        <strong>Is active:</strong>
                                    </label>{" "}
                                    {selectedAuthor.active ? "Active" : "Not active"}
                                </div>

                                <br/>

                            </div>
                        ) : (
                            <div>
                                <br/>
                                <p>Please click on a author...</p>
                            </div>
                        )}

                        <div >
                            {selectedAuthor && (
                                <Button variant="contained" startIcon={<Edit/>} href='/editAuthor'>
                                    Edit Author
                                </Button>
                            )}
                            &emsp;
                            {selectedAuthor && (
                                <Button variant="contained" className="deleteButton" startIcon={<Delete/>}
                                        onClick={() => {
                                            this.deleteAuthor(selectedAuthor.id);
                                        }}>
                                    Delete Author
                                </Button>
                            )}
                            &emsp;
                            {selectedAuthor && (
                                <Button variant="contained" startIcon={<AddBox/>} href="/createAuthor">
                                    Add Author
                                </Button>
                            )}
                        </div>
                        &emsp;
                        <div>
                            {selectedAuthor && (
                                <Button variant="contained" startIcon={<AddBox/>} href="/addBook">
                                    Add Book to Author
                                </Button>
                            )}
                        </div>



                    </div>

                </div>
            )

        )


    }

}
