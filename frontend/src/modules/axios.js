import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const axiosApi = axios.create({
    baseURL: API_URL
})
  
// Aggiungi un interceptor per includere il token in tutte le richieste
axiosApi.interceptors.request.use(
  (config) => {
    
    const token = localStorage.getItem("token");
    
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      
    } else {
      console.log("Nessun token trovato nel localStorage");
    }
    return config;
  },
  (error) => {
    console.error("Errore nell'interceptor:", error);
    return Promise.reject(error);
  }
);

export default axiosApi