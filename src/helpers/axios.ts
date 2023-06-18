import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://mern-blog-api-q3ex.onrender.com',
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = localStorage.getItem('token');
  return config;
});

export default instance;
