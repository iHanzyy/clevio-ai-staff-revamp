
import axios from 'axios';

interface ArthurChatResponse {
    output: string;
    agentData?: any; // The payload for creating an agent if interview is complete
    success?: boolean;
}

interface ArthurContext {
    userId: string;
    agentId: string;
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

            // Safely get tokens from storage
            const jwt = typeof window !== 'undefined' ? localStorage.getItem('jwt_token') || "" : "";
            const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') || "" : "";
            
            payload.jwt_token = jwt;
            payload.access_token = accessToken;

            let extractedUserId = "";
            try {
                if (jwt) {
                    const parsedData = JSON.parse(atob(jwt.split('.')[1]));
                    extractedUserId = parsedData.sub || parsedData.userId || parsedData.id || "";
                }
            } catch (e) {
                console.warn("[arthurService] Failed to parse jwt for userId extraction", e);
            }

            // Always provide a userId if possible
            payload.userId = extractedUserId;

            // Add all context fields if provided (Edit Mode Dashboard)
            if (context) {
                payload.userId = context.userId || extractedUserId;
                payload.agentId = context.agentId;
                payload.name = context.name;
                payload.system_prompt = context.system_prompt;
                payload.mcp_tools = context.mcp_tools;
                payload.google_tools = context.google_tools;
                
                payload.is_edit = context.is_edit || false;
            } else {
                payload.is_edit = false;
            }

            const response = await axios.post('/api/arthur/chat', payload);
            return response.data;
        } catch (error) {
            console.error("Arthur Service Error:", error);
            throw error;
        }
    }
};
