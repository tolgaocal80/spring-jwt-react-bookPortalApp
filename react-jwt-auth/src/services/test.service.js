import axios from 'axios';
import authHeader from '../auth/auth-header';

const API_URL = 'http://localhost:8080/api/test/';

class TestService {

  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }

}

export default new TestService();
