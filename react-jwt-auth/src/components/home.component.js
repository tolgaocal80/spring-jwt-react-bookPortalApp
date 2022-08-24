import React, {Component} from "react";

import TestService from "../services/test.service";
import SearchField from "react-search-field";
import axios from "axios";
import {useRadioGroup} from "@material-ui/core";

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
        this.getBooksFromRemoteDB = this.getBooksFromRemoteDB.bind(this);

        this.state = {
            message: "",
            maxReadUser: "",
            maxReadBook: "",
            maxFavoritedBook: "",

            searchText: "",
            returnedBookList: [],
            apiMessage: "",
            numFound: undefined
        };
    }

    onChangeSearchTitle(e) {
        const searchText = e.target.value;
        this.setState({
            searchText: searchText,
        });
    }

    getBooksFromRemoteDB() {
        const text = this.state.searchText;

        let searchText = text.replaceAll(" ", "+").replaceAll("İ", "i")
            .toLowerCase()
            .replaceAll("ş", "s").replaceAll("ü", "u")
            .replaceAll("ı", "i").replaceAll("ğ", "g")
            .replaceAll("ç", "c").replaceAll("ö", "o");

        const options = {
            method: 'GET',
            url: 'https://openlibrary.org/search.json?q=' + searchText + '&limit=5',
            headers: {
                'content-type': 'application/json',
            }
        };

        axios.request(options).then((response) => {

                const result = response.data;

                this.setState({
                    returnedBookList: result.docs,
                    numFound: result.num_found,
                    apiMessage: ""
                });

            }, error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                this.setState({
                    apiMessage: resMessage
                });
            }
        )

    }

    componentDidMount() {
        TestService.getPublicContent().then(
            (response) => {

                this.setState({
                    message: response.data.message,
                    maxReadUser: response.data.maxReadUser,
                    maxReadBook: response.data.maxReadBook,
                    maxFavoritedBook: response.data.maxFavoritedBook
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
        );
    }



    render() {

        const {
            message,
            maxReadUser,
            maxReadBook,
            maxFavoritedBook,
            returnedBookList,
            apiMessage,
            numFound
        } = this.state;

        let maxReadBookIsbn = maxReadBook.isbn;
        let maxFavoritedBookIsbn = maxFavoritedBook.isbn;

        let maxReadImageUrl = 'https://covers.openlibrary.org/b/isbn/' +maxReadBookIsbn+'-M.jpg';
        let maxFavoritedImageUrl = 'https://covers.openlibrary.org/b/isbn/' +maxFavoritedBookIsbn+'-M.jpg';

        return (

            <div className="list row">


                <div className="col-md-12">
                    <div className="container">
                        <header className="jumbotron">
                            <h3>{message}</h3>
                        </header>
                    </div>

                </div>


                <div className="col-md-5">
                    <div className="container">
                        <header className="jumbotron">
                                    <div>
                                        <div className="list row" >
                                            <div className="right30">
                                                <strong >The Most Read Book:</strong><br/><br/>
                                                {maxReadBook.name}<br/>
                                                <strong>{maxReadBook.readNumber}</strong> times read.<br/>
                                                <strong>Author:</strong> {maxReadBook.authorName}
                                            </div>
                                            <div>
                                                <img src={maxReadImageUrl} className="bookImage"/>
                                            </div>
                                        </div>

                                        <hr/>

                                        <div className="list row">
                                            <div className="right5">
                                                <strong>The Most Favorited Book:</strong> <br/><br/>
                                                {maxFavoritedBook.name}
                                                <td/>
                                                <strong>{maxReadBook.favoriteNumber}</strong> times favorited.<br/>
                                                <strong>Author:</strong> {maxFavoritedBook.authorName}
                                            </div>
                                            <br/>
                                            <div>
                                                <img src={maxFavoritedImageUrl} className="bookImage"/>
                                            </div>
                                        </div>

                                        <hr/>

                                        <div className="list row">
                                            <div className="right40">
                                                <strong>The Most Read User:</strong><br/><br/>
                                                {maxReadUser.username}
                                                <td/>
                                                <strong>{maxReadUser.readBooksNumber}</strong> times read.<br/>
                                            </div>

                                        </div>
                                    </div>
                        </header>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="container">

                        <header className="jumbotron">
                            <div>
                                <h4>Search Book in the OpenLibrary.com</h4>
                            </div>
                            <br/>
                            <div className="input-group mb-3">

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search book in the Open Library DB"
                                    value={this.state.searchText}
                                    onChange={this.onChangeSearchTitle}
                                />
                                <div className="input-group-append">
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={this.getBooksFromRemoteDB}
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>

                            {apiMessage && (
                                <div className="list-row">
                                    <div className="col-md-6">
                                        Couldn't find book with given name...
                                    </div>
                                </div>
                            )}

                            <div>
                                <ul>
                                    {returnedBookList && (returnedBookList.length > 0) ?
                                        returnedBookList.map((book) => {
                                                let cover = book.cover_edition_key;
                                                let imgUrl = 'https://covers.openlibrary.org/b/olid/' + cover + '-M.jpg';
                                                return (<li>
                                                        <div className="list row">
                                                            <br/>

                                                            <div className="col-md-6">
                                                                <img src={imgUrl}/>
                                                            </div>

                                                            <div className="col-md-6">
                                                                Name: {book.title}<br/>
                                                                Author: {book.author_name[0]}<br/>
                                                                Puslibhed: {book.first_publish_year}<br/>
                                                            </div>

                                                        </div>
                                                        <hr/>
                                                        <br/>
                                                    </li>

                                                )
                                            }
                                        )
                                        : (numFound === 0 && returnedBookList && returnedBookList.length === 0 ? (
                                                <div className="col-md-6">
                                                    Book couldn't found...
                                                </div>
                                            ) : (<div/>)
                                        )
                                    }
                                </ul>
                            </div>

                        </header>
                    </div>
                </div>

            </div>

        );
    }
}
