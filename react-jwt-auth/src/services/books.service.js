import axios from 'axios';
import authHeader from '../auth/auth-header';

const API_URL = 'http://localhost:8080/api/books';

class BooksService{

    getAllBooks(){
        return axios.get(API_URL, { headers: authHeader() })
    }

    getBookByName(bookName){
        return axios.get(API_URL+'/by-book-name?bookName=' +bookName, {headers: authHeader()})
    }

    getAllByBookName(bookName){
        return axios.get(API_URL+"/all-by-bookname?bookName=" + bookName, { headers: authHeader() })
    }
    getAllBooksOrderByViewsNumber(){
        return axios.get(API_URL + "/order-by-views-number", { headers: authHeader() })
    }

    getAllBooksByType(type){
        return axios.get(API_URL + "/all-by-type?type=" + type, { headers: authHeader() })
    }

    checkIfUserBookFavoriteMatch(userId, bookId){
        return axios.get(API_URL + "/check-if-favorite?userId=" + userId +"&bookId="+bookId, {headers: authHeader()})
    }
    checkIfUserBookReadMatch(userId, bookId) {
        return axios.get(API_URL + "/check-if-read?userId=" + userId + "&bookId=" + bookId, {headers: authHeader()})
    }

    getAllBooksByAuthorName(authorName){
        return axios.get(API_URL + "/all-by-author-name?authorName=" + authorName, { headers: authHeader() })
    }

    getAllBooksWithPagination(pageNumber, pageSize){
        return axios.get(API_URL + "/all-with-pagination?pageNumber=" + pageNumber + "&pageSize="+pageSize, { headers: authHeader() })
    }

    getBooksByNameWithPagination(bookName, pageNumber, pageSize){
        return axios.get(API_URL+"/search-by-name-pagination?bookName="+bookName+"&pageNumber="+pageNumber+"&pageSize="+pageSize,{headers: authHeader()})

    }

    getAllBooksOrderByFavorite(){
        return axios.get(API_URL + "/all-order-by-favorite", { headers: authHeader() })
    }

    findBookById(id){
        return axios.get(API_URL + "/by-id?id=" + id, { headers: authHeader() })
    }

    updateBook(id, name, authorName, type, pageNumber, year, isbn){
        return axios.put(API_URL+"/edit/"+id,
            {
                "isbn" : isbn,
                "name" : name,
                "type" : type,
                "year" :  parseInt(year),
                "pageNumber" : parseInt(pageNumber),
                "authorName" : authorName
        }, {headers: authHeader()})
            .then(response => {
                return response.data;
            })
    }

    removeBook(bookId){
        return axios.delete(API_URL + "/delete/" + bookId, {headers: authHeader()});
    }

    createBook(isbn, name, type, year, pageNumber, authorName){
       return axios.post(API_URL, {
           "isbn" : isbn,
           "name" : name,
           "type" : type,
           "year" :  parseInt(year),
           "pageNumber" : parseInt(pageNumber),
           "authorName" : authorName
       }, {headers: authHeader()})
           .then(response =>{
            return response.data;
        })
    }

}
export default new BooksService();
