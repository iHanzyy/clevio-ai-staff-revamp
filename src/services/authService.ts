import api from './api';

export interface User {
    id: string;
    email: string;
    is_active: boolean;
    plan_code: string;
    api_expires_at: string; // ISO timestamp for subscription expiry
    created_at: string;
    access_token?: string; // Backend returns new access_token after payment activation
}

export const authService = {
    // Get Current User Profile
    getMe: async (): Promise<User> => {
        const response = await api.get<User>('/auth/me');
        return response.data;
    },

    // Get Google Login URL
    getGoogleLoginUrl: async (): Promise<{ auth_url: string } | string> => {
        const response = await api.get<{ auth_url: string } | string>('/auth/google/login');
        return response.data;
    },

    // Email/Password Login
    login: async (email: string, password: string) => {
        // API requires Query params
        const response = await api.post<{ jwt_token: string, token_type: string }>(
            `/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
        );
        return response.data;
    },

    // Email/Password Register
    register: async (email: string, password: string) => {
        // API requires Query params
        const response = await api.post<{ message: string, user_id: string, email: string }>(
            `/auth/register?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
        );
        return response.data;
    },

    // Helper to store token
    setSession: (token: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('jwt_token', token);
        }
    },

    // Logout Helper
    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('jwt_token');
            document.cookie = 'session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            window.location.href = '/login';
        }
    }
};
