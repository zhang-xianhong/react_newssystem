import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:7000';

axios.interceptors.request.use(config => {
    return config;
})

axios.interceptors.response.use(response => {
    return response.data;
})