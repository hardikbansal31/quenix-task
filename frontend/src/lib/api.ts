import axios from "axios";

// Create a custom Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // We check for 'window' to ensure this code only runs on the client-side,
    // as Next.js also renders components on the server where localStorage doesn't exist.
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      // If we have a token, attach it to the Authorization header
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
