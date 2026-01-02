import api from '@/lib/api';

export interface UserInfo {
    id: string;
    email: string;
    is_active: boolean;
    created_at: string;
    access_token?: string;
    plan_code?: string;
}

export const authService = {
    getMe: async (): Promise<UserInfo> => {
        const response = await api.get<UserInfo>('/auth/me');
        return response.data;
    },
    getGoogleLoginUrl: async () => {
        const response = await api.get('/auth/google/login');
        return response.data;
    },
};
