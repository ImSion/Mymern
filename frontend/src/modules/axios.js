import axios from 'axios';

const API_URL = 'https://mymern-k1d7.onrender.com/api' || 'http://localhost:5001/api';

const axiosApi = axios.create({
    baseURL: API_URL
})
  
axiosApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosApi