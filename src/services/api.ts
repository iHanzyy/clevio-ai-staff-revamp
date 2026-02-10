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
            // IMPORTANT: access_token = CRUD token (from /auth/api-key or N8N webhook)
            // jwt_token = login-only token (fallback for backward compat)
            const token = localStorage.getItem('access_token') || localStorage.getItem('jwt_token');
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

import { logError } from '@/lib/errorLogger';

// Response Interceptor: Handle Errors (e.g., 401 Logout)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const url = error.config?.url || 'unknown';
        const method = error.config?.method?.toUpperCase() || 'UNKNOWN';
        const detail = error.response?.data?.detail || error.response?.data?.error || error.message;

        logError('services/api', 'api_error', `${method} ${url} → ${status || 'NETWORK'}: ${detail}`, {
            status_code: status,
            request_url: url,
            method,
        });

        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Optional: Auto-logout on token expiration
            // localStorage.removeItem('jwt_token');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
