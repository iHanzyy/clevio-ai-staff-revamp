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
            const jwtToken = localStorage.getItem('jwt_token');
            const accessToken = localStorage.getItem('access_token');
            
            // TENTUKAN TOKEN BERDASARKAN ENDPOINT
            let tokenToUse = accessToken || jwtToken; // default: access_token untuk CRUD/agents/google
            
            // HANYA /auth/me yang butuh User JWT Token untuk validasi profil
            const isProfileEndpoint = config.url?.includes('/auth/me');
            
            if (isProfileEndpoint && jwtToken) {
                tokenToUse = jwtToken; // Paksa gunakan JWT untuk validasi login/profil
            }

            if (tokenToUse) {
                config.headers.Authorization = `Bearer ${tokenToUse}`;
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
