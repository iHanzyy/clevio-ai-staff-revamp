import api from './api';
import axios from 'axios';

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

    // Get Access Token for CRUD operations (separate from jwt_token which is login-only)
    // This calls /auth/api-key which returns the access_token needed for all agent operations
    getAccessToken: async (email: string, password: string, planCode: string = 'TRIAL'): Promise<string | null> => {
        try {
            const response = await api.post<{ access_token: string, token_type: string, expires_at?: string }>(
                '/auth/api-key',
                {
                    username: email,
                    password: password,
                    plan_code: planCode
                }
            );
            const accessToken = response.data?.access_token;
            if (accessToken) {
                localStorage.setItem('access_token', accessToken);
                console.log('[AuthService] access_token obtained and stored');
                return accessToken;
            }
            return null;
        } catch (error) {
            console.error('[AuthService] Failed to get access_token:', error);
            return null;
        }
    },

    // Email/Password Register (via N8N Proxy)
    register: async (email: string, password: string) => {
        // Now using internal proxy to N8N with JSON body
        const response = await axios.post<{ message: string, redirect?: string, data: any }>(
            '/api/auth/n8n-register',
            { email, password }
        );
        return response.data;
    },

    // Helper to store jwt_token (login token)
    setSession: (token: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('jwt_token', token);
            // Set cookie for middleware/server-side checks (matches auth/callback logic)
            document.cookie = `session_token=${token}; path=/; max-age=604800; SameSite=Lax`;
        }
    },

    // Helper to store access_token (CRUD token from N8N or /auth/api-key)
    setAccessToken: (token: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', token);
            console.log('[AuthService] access_token stored');
        }
    },

    // Logout Helper
    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('access_token');
            document.cookie = 'session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            window.location.href = '/login';
        }
    }
};
