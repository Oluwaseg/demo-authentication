// axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Replace with your API URL
  withCredentials: true, // Send cookies with requests (important for JWT)
});

// Interceptor to automatically add Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Assuming you store token in localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
