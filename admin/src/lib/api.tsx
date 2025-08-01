import axios from 'axios';

const API_BASE_URL = 'https://farmhouse-monolith.onrender.com/api/v1';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include adminToken with every request
apiClient.interceptors.request.use(
  (config) => {
    // console.log("Making request to:", config.url);
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      // console.log("Including adminToken in request");
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // console.log("Received 401 unauthorized, clearing adminToken");
      localStorage.removeItem('adminToken');
    }
    return Promise.reject(error);
  }
);

export default apiClient;