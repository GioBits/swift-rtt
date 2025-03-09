import axios from 'axios';

// Axios instance with default configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:8000', // Base URL for API requests
  timeout: 60000,  // Timeout of 60 seconds
});

// Interceptor to handle requests before they are sent
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage or sessionStorage
    const token = localStorage.getItem('authToken');

    if (token) {
      // If a token exists, add it to the Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Interceptor to handle API responses
apiClient.interceptors.response.use(
  (response) => response.data,  // Extract the data directly from the response
  (error) => {
    if (error.response) {
      // Handle API response errors here
      console.error('Response error:', error.response);
      return Promise.reject(error.response);
    } else if (error.request) {
      // Handle cases where no response was received from the API
      console.error('Network error:', error.message);
      return Promise.reject({ message: 'Could not connect to the server' });
    } else {
      // Handle unknown errors
      return Promise.reject({ message: 'An unexpected error occurred' });
    }
  }
);

export default apiClient;

// API service that uses Axios to make requests
const apiService = {
  get: (url, params = {}) => apiClient.get(url, { params }), // GET request with optional parameters

  post: (url, data, config = {}) => apiClient.post(url, data, config), // POST request with data and optional configuration

  put: (url, data, config = {}) => apiClient.put(url, data, config), // PUT request with data and optional configuration

  delete: (url, config = {}) => apiClient.delete(url, config), // DELETE request with optional configuration

  ping: () => apiClient.get('/ping'), // Health check endpoint
};

export { apiService };