import axios from 'axios';
import authHeader from '../auth/auth-header';

const API_URL = 'http://localhost:8080/api/users';

class UsersService {

    getUserByNameWithPagination(userName, pageNumber, pageSize) {
        return axios.get(API_URL + "/search-by-name-pagination" +
            "?userName=" + userName + "&pageNumber=" + pageNumber +
            "&pageSize=" + pageSize, {headers: authHeader()});
    }

    addBookToFavorites(userId, bookId) {
        return axios.put(API_URL + "/" + userId + "/add-book-to-favorites?userId=" + userId + "&bookId=" + bookId, {}, {headers: authHeader()})
    }

    addBookToReadList(userId, bookId) {
        return axios.put(API_URL + "/" + userId + "/add-book-to-read?userId=" + userId + "&bookId=" + bookId, {}, {headers: authHeader()})
    }

    updateUser(id, username, password, role) {
        return axios.put(API_URL + "/edit/" + id,
            {
                "username": username,
                "password": password,
                "role": role
            }, {headers: authHeader()})
            .then((response) => {
                return response.data;
            })
    }

    removeUser(userId) {
        return axios.delete(API_URL + "/delete/" + userId, {headers: authHeader()});
    }

    createUser(username, password, role){
        return axios.post(API_URL, {
            "username": username,
            "password": password,
            "role": role
        }, {headers: authHeader()})
            .then(response => {
                return response.data;
            })
    }

}


export default new UsersService();



