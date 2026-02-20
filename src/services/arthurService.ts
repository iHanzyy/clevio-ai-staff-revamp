
import axios from 'axios';

interface ArthurChatResponse {
    output: string;
    agentData?: any; // The payload for creating an agent if interview is complete
    success?: boolean;
}

interface ArthurContext {
    userId: string;
    agentId: string;
    konteks: string;
    name: string;
    system_prompt: string;
    mcp_tools: string[];
    google_tools: string[];
    is_edit?: boolean;
}

export const arthurService = {
    // Original method for backward compatibility
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
    },

    // New method with context for Edit Mode
    sendMessageWithContext: async (
        sessionId: string,
        message: string,
        context?: ArthurContext
    ): Promise<ArthurChatResponse> => {
        try {
            const payload: any = {
                sessionId,
                chatInput: message
            };

            // Add all context fields if provided (Edit/Create Mode Dashboard)
            if (context) {
                payload.userId = context.userId;
                payload.agentId = context.agentId;
                payload.konteks = context.konteks;
                payload.name = context.name;
                payload.system_prompt = context.system_prompt;
                payload.mcp_tools = context.mcp_tools;
                payload.google_tools = context.google_tools;
                
                // New required fields
                payload.jwt_token = localStorage.getItem('jwt_token') || "";
                payload.access_token = localStorage.getItem('access_token') || "";
                payload.is_edit = context.is_edit || false;
            }

            const response = await axios.post('/api/arthur/chat', payload);
            return response.data;
        } catch (error) {
            console.error("Arthur Service Error:", error);
            throw error;
        }
    }
};
