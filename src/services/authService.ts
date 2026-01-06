import api from './api';

export interface User {
    id: string;
    email: string;
    is_active: boolean;
    plan_code: string;
    created_at: string;
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

    // Logout Helper
    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('jwt_token');
            document.cookie = 'session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            window.location.href = '/login';
        }
    }
};
