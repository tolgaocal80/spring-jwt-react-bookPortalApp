import axios from 'axios';
import authHeader from '../auth/auth-header';

const API_URL = 'http://localhost:8080/api/authors';

class AuthorsService{


    getAllAuthors(){
        return axios.get(API_URL, {headers: authHeader()})
    }

    getAuthorsByNameWithPagination(authorName, pageNumber, pageSize){
        return axios.get(API_URL + "/search-by-authorname-pagination" + "?authorName=" + authorName + "&pageNumber=" + pageNumber + "&pageSize=" + pageSize, {headers: authHeader()});
    }

    findAuthorByName(name){
        return axios.get(API_URL + "/by-name?name="+name, {headers: authHeader()})
    }

    findAllByBooksNameContains(bookName){
        return axios.get(API_URL + "/all-by-book-name?bookName=" +bookName, {headers: authHeader()})
    }

    getAllAuthorsWithPagination(pageNumber, pageSize){
        return axios.get(API_URL + "/all-with-pagination?pageNumber=" + pageNumber+"&pageSize="+pageSize, {headers: authHeader()})
    }

    findById(id){
        return axios.get(API_URL+"/by-id?id="+id, {headers: authHeader()})
    }

    createAuthor(authorName){
        return axios.post(API_URL,  {
            "name": authorName
        }, {headers: authHeader()})
            .then(response => {
                return response.data;
            })
    }

    addBookToAuthor(id, bookDTO){
        return axios.post(API_URL+"/"+id+"/add-book", bookDTO, {headers: authHeader()})
            .then(response => {
                return response.data;
            })
    }

    updateAuthor(id, authorName){
        return axios.put(API_URL+"/edit/"+id, {
            "name": authorName
        }, {headers: authHeader()})
            .then(response => {
                return response.data;
            })
    }

    removeAuthor(id){
        return axios.delete(API_URL+"/"+id, {headers: authHeader()})
    }
}

export default new AuthorsService();