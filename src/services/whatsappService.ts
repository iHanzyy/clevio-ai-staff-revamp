import axios from 'axios';

const WA_BASE_URL = process.env.NEXT_PUBLIC_WHATSAPP_BACKEND_URL;

export interface CreateSessionPayload {
    agentId: string;
    agentName: string;
}

export interface SessionStatusResponse {
    status: 'CONNECTED' | 'DISCONNECTED' | 'QR_READY' | 'UNKNOWN';
    qr?: string;
    message?: string;
}

export const whatsappService = {
    // Create Session (Get QR)
    createSession: async (payload: CreateSessionPayload) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('jwt_token') || "" : "";
        const url = `${WA_BASE_URL}/sessions/create`;
        const body = {
            agentId: payload.agentId,
            agentName: payload.agentName,
            apiKey: token,
            langchainUrl: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/agents/${payload.agentId}/execute`
        };

        const response = await axios.post(url, body);
        return response.data;
    },

    // Get Session Status
    getSessionStatus: async (agentId: string) => {
        const url = `${WA_BASE_URL}/sessions/status?agentId=${agentId}`;
        const response = await axios.get(url);
        return response.data;
    },

    // Get Detail (Optional)
    getSessionDetail: async (agentId: string) => {
        const url = `${WA_BASE_URL}/sessions/detail?agentId=${agentId}`;
        const response = await axios.get(url);
        return response.data;
    },

    // Delete Session
    deleteSession: async (agentId: string) => {
        const url = `${WA_BASE_URL}/sessions/delete`;
        const response = await axios.delete(url, {
            data: { agentId }
        });
        return response.data;
    },

    // Reconnect Session
    reconnectSession: async (agentId: string) => {
        const url = `${WA_BASE_URL}/sessions/reconnect`;
        const response = await axios.post(url, { agentId });
        return response.data;
    }
};
