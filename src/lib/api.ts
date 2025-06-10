import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important to send cookies
});

// Optional: Add interceptors for request/response if needed later
// apiClient.interceptors.response.use(response => response, error => {
//   if (error.response?.status === 401) {
//     // Handle unauthorized errors, e.g., redirect to login
//     // store.dispatch(logout()); // Assuming you can dispatch from here or use an event bus
//   }
//   return Promise.reject(error);
// });

export default apiClient;
