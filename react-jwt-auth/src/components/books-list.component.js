import React, {Component} from "react";
import Pagination from "@material-ui/lab/Pagination"
import BooksService from "../services/books.service"
import AuthService from "../auth/auth.service";
import UsersService from "../services/users.service";
import {IoIosHeartEmpty, IoIosHeart, BsBookFill, BsBook} from "react-icons/all";
import {Button} from "@material-ui/core";
import {AddBox, Delete, Edit} from "@material-ui/icons";


export default class BooksList extends Component {

    constructor(props) {
        super(props);

        this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
        this.retrieveBooks = this.retrieveBooks.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.setActiveBook = this.setActiveBook.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
        this.checkIfBookFavorite = this.checkIfBookFavorite.bind(this);
        this.checkIfBookRead = this.checkIfBookRead.bind(this);

        this.state = {
            books: [],
            currentBook: null,
            currentIndex: -1,
            searchTitle: "",
            page: 1,
            count: 0,
            pageSize: 3,
            currentUser: undefined,
            isFavorite: null,
            isRead: null,
            message: "",
            isAdmin: null
        };

        this.pageSizes = [3, 6, 9];
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();
        const isAdmin = currentUser && currentUser.roles.includes("ROLE_ADMIN")

        if (!currentUser) this.setState({redirect: "/login"});

        this.setState({
            currentUser: currentUser,
            isAdmin: isAdmin
        })

        this.retrieveBooks();
    }

    onChangeSearchTitle(e) {
        const searchTitle = e.target.value;
        this.setState({
            searchTitle: searchTitle,
        });
    }

    checkIfBookFavorite(userId, bookId) {
        BooksService.checkIfUserBookFavoriteMatch(userId, bookId)
            .then(response => {
                const {isFavorite} = response.data;
                this.setState({
                    isFavorite: isFavorite
                })
            })
    }

    checkIfBookRead(userId, bookId) {
        BooksService.checkIfUserBookReadMatch(userId, bookId)
            .then(response => {
                const {isRead} = response.data;
                this.setState({
                    isRead: isRead
                })
            })
    }

    retrieveBooks() {
        const {searchTitle, page, pageSize} = this.state;

        BooksService.getBooksByNameWithPagination(searchTitle, page - 1, pageSize)
            .then((response) => {

                    const {books, totalPages} = response.data;

                    this.setState({
                        books: books,
                        count: totalPages,
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
            )
            .catch((e) => {
                console.log(e);
            });
    }

    refreshList() {
        this.retrieveBooks();
        this.setState({
            currentBook: null,
            currentIndex: -1,
        });
    }

    setActiveBook(book, index) {
        localStorage.setItem("currentBook", JSON.stringify(book));
        localStorage.removeItem("selectedAuthor")

        this.setState({
            currentBook: book,
            currentIndex: index,
        });
    }

    handlePageChange(event, value) {
        this.setState(
            {
                page: value,
            }, () => {
                this.retrieveBooks();
            }
        );
    }

    handlePageSizeChange(event) {
        this.setState(
            {
                pageSize: event.target.value,
                page: 1
            },
            () => {
                this.retrieveBooks();
            }
        );
    }

    addToFavorites(userId, bookId) {
        UsersService.addBookToFavorites(userId, bookId)
            .then((response) => {
                const {favorite, book} = response.data;
                this.setState({
                    isFavorite: favorite
                })
            })
    }

    addToReads(userId, bookId) {
        UsersService.addBookToReadList(userId, bookId)
            .then((response) => {
                const {read} = response.data;
                this.setState({
                    isRead: read
                })
            })
    }

    deleteBook(bookId) {
        BooksService.removeBook(bookId)
            .then(this.refreshList);
    }

    render() {
        const {
            searchTitle,
            books,
            currentBook,
            currentIndex,
            page,
            count,
            pageSize,
            isFavorite,
            isRead,
            currentUser,
            message,
            isAdmin
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
                                placeholder="Search by book name"
                                value={searchTitle}
                                onChange={this.onChangeSearchTitle}
                            />
                            <div className="input-group-append">
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={this.retrieveBooks}
                                >
                                    Search
                                </button>
                            </div>
                        </div>

                    </div>

                    <div className="col-md-6">
                        <h4>Book List</h4>

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
                            {books &&
                                books.map((book, index) => (
                                    <li
                                        className={
                                            "list-group-item " +
                                            (index === currentIndex ? "active" : "")
                                        }
                                        onClick={() => {
                                            this.setActiveBook(book, index);
                                            this.checkIfBookFavorite(currentUser.id, book.id);
                                            this.checkIfBookRead(currentUser.id, book.id)
                                        }}
                                        key={index}
                                    >
                                        {book.name}
                                    </li>
                                ))}
                        </ul>

                    </div>

                    <div className="col-md-6">
                        {currentBook ? (
                            <div className="bottom-margin">
                                <h4>Book</h4>
                                <div>
                                    <label>
                                        <strong>Title:</strong>
                                    </label>{" "}
                                    {currentBook.name}
                                </div>
                                <div>
                                    <label>
                                        <strong>Author:</strong>
                                    </label>{" "}
                                    {currentBook.authorName}
                                </div>

                                <div>
                                    <label>
                                        <strong>Year:</strong>
                                    </label>{" "}
                                    {currentBook.year}
                                </div>

                                <div>
                                    <label>
                                        <strong>Page number:</strong>
                                    </label>{" "}
                                    {currentBook.pageNumber}
                                </div>

                                <div>
                                    <label>
                                        <strong>Book id:</strong>
                                    </label>{" "}
                                    {currentBook.id}
                                </div>

                                <div>
                                    <label>
                                        <strong>Type:</strong>
                                    </label>{" "}
                                    {currentBook.type}
                                </div>


                                <div>
                                    <label>
                                        <strong>ISBN:</strong>
                                    </label>{" "}
                                    {currentBook.isbn}
                                </div>

                                <div>
                                    <strong>Read:</strong>
                                    {" "}
                                    <label id={"readNumberLabel"}>
                                        {currentBook.readNumber + " times read."}
                                    </label>
                                </div>

                                <div>
                                    <strong>Favorite:</strong>
                                    {" "}
                                    <label id={"favoriteNumberLabel"} >
                                        <p>{currentBook.favoriteNumber + " user loves this book."}</p>
                                    </label>
                                </div>

                            </div>
                        ) : (
                            <div>
                                <br/>
                                Please click on a Tutorial...
                            </div>
                        )}

                        <div >

                            {currentBook ? isFavorite ? (
                                <IoIosHeart size={50} className="right-margin"
                                            onClick={() => {
                                                currentBook.favoriteNumber--;
                                                this.addToFavorites(this.state.currentUser.id, this.state.currentBook.id);
                                            }}
                                            style={{color: 'red'}}
                                />
                            ) : (
                                <IoIosHeartEmpty size={50} className="right-margin"
                                                 onClick={() => {
                                                     currentBook.favoriteNumber++;
                                                     this.addToFavorites(this.state.currentUser.id, this.state.currentBook.id);
                                                 }}
                                                 style={{color: 'red'}}
                                />
                            ) : <br/>}

                            {currentBook ? isRead ? (
                                <BsBookFill size={50}
                                            onClick={() => {
                                                currentBook.readNumber--;
                                                this.addToReads(this.state.currentUser.id, this.state.currentBook.id);
                                            }}
                                />
                            ) : (
                                <BsBook size={50}
                                        onClick={() => {
                                            currentBook.readNumber++;
                                            this.addToReads(this.state.currentUser.id, this.state.currentBook.id);
                                        }}
                                />
                            ) : <br/>}
                        </div>

                        <div >
                            {currentBook && isAdmin && (
                                <Button variant="contained" startIcon={<Edit/>} href='/editBook'>
                                    Edit Book
                                </Button>
                            )}
                            &emsp;
                            {currentBook && isAdmin && (
                                <Button variant="contained" className="deleteButton" startIcon={<Delete/>}
                                        onClick={() => {
                                            this.deleteBook(currentBook.id);
                                        }}>
                                    Delete
                                </Button>
                            )}
                            &emsp;
                            {currentBook && isAdmin && (
                                <Button variant="contained" startIcon={<AddBox/>} href="/addBook">
                                    Add Book
                                </Button>
                            )}
                        </div>

                    </div>

                </div>
            )
        );
    }

}