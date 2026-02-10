import axios from 'axios';

// Use environment variable strictly
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

const api = axios.create({
    baseURL: BACKEND_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
    },
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
    (config) => {
        // Ensure this only runs on the client side
        if (typeof window !== 'undefined') {
            // access_token = CRUD token (from /auth/api-key or N8N webhook)
            // jwt_token = login-only token (fallback)
            const token = localStorage.getItem('access_token') || localStorage.getItem('jwt_token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

import { logError } from '@/lib/errorLogger';

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const url = error.config?.url || 'unknown';
        const method = error.config?.method?.toUpperCase() || 'UNKNOWN';
        const detail = error.response?.data?.detail || error.response?.data?.error || error.message;

        logError('lib/api', 'api_error', `${method} ${url} → ${status || 'NETWORK'}: ${detail}`, {
            status_code: status,
            request_url: url,
            method,
        });

        // Disabled auto-redirect to prevent loops on dashboard load
        /*
        if (error.response && error.response.status === 401) {
            if (typeof window !== 'undefined') {
                if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                    localStorage.removeItem('jwt_token');
                    window.location.href = '/login';
                }
            }
        }
        */
        return Promise.reject(error);
    }
);

export default api;
