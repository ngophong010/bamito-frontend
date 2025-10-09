import axios from 'axios';

// Get the base URL from environment variables
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This is crucial for sending cookies (like your auth tokens) automatically
});

// You can add interceptors here for handling auth errors globally, etc.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally if needed
    console.error('API Error:', error.response);
    return Promise.reject(error);
  }
);

export default apiClient;
