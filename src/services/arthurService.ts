
import axios from 'axios';

interface ArthurChatResponse {
    output: string;
    agentData?: any; // The payload for creating an agent if interview is complete
}

export const arthurService = {
    sendMessage: async (sessionId: string, message: string): Promise<ArthurChatResponse> => {
        try {
            const response = await axios.post('/api/arthur/chat', {
                sessionId,
                chatInput: message
            });
            return response.data;
        } catch (error) {
            console.error("Arthur Service Error:", error);
            throw error;
        }
    }
};
