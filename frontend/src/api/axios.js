import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Make sure this matches your backend URL
});

// Add a request interceptor to include the auth token automatically
API.interceptors.request.use(
  (config) => {
    // Check localStorage for the token (adjust 'token' or 'userInfo' based on what your login saves)
    const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('userInfo'))?.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;