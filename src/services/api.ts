import axios from 'axios';

// Create Axios Instance
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage (only on client side)
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('jwt_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle Errors (e.g., 401 Logout)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Optional: Auto-logout on token expiration
            // localStorage.removeItem('jwt_token');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
