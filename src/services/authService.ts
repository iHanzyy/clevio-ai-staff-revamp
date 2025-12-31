import api from '@/lib/api';

export const authService = {
    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
    getGoogleLoginUrl: async () => {
        const response = await api.get('/auth/google/login');
        return response.data;
    },
};
