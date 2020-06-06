import axios from 'axios';

const api = axios.create({
    //AXIOS NOS PERMITE CRIAR A BASEURL QUE SERÁ UTILIZADA EM TODAS REQUISOÇÕES
    baseURL: 'http://localhost:3333'
});

export default api;