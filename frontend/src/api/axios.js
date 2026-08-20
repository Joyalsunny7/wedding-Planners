import axios from "axios";

const API = axios.create({
  baseURL: 'http://localhost:5000/api/user', 
});

// Interceptor to attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const session = localStorage.getItem('user_session');
  if (session) {
    const { token } = JSON.parse(session);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;