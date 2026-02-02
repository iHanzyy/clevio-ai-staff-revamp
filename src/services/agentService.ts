import api from './api';

export interface AgentConfig {
    llm_model: string;
    max_tokens: number;
    system_prompt?: string;
    // Add other relevant config fields
}

export interface Agent {
    id: string;
    user_id: string;
    name: string;
    status: string;
    config: AgentConfig;
    created_at: string;
    mcp_tools?: string[];
    google_tools?: string[];
    // Google Workspace OAuth
    auth_required: boolean;
    auth_url: string | null;
    auth_state: string | null;
    // Token/Messages quota
    messages_remaining: number;
}

export const agentService = {
    // List all agents
    getAgents: async (): Promise<Agent[]> => {
        const response = await api.get<Agent[]>('/agents/');
        return response.data;
    },

    // Get single agent details
    getAgent: async (agentId: string): Promise<Agent> => {
        const response = await api.get<Agent>(`/agents/${agentId}`);
        return response.data;
    },

    // Create new agent
    createAgent: async (payload: any): Promise<Agent> => {
        const response = await api.post<Agent>('/agents/', payload);
        return response.data;
    },

    // Update agent
    updateAgent: async (agentId: string, payload: any): Promise<Agent> => {
        const response = await api.put<Agent>(`/agents/${agentId}`, payload);
        return response.data;
    },

    // Initiate Google OAuth
    initiateGoogleAuth: async (agentId: string, scopes: string[]): Promise<{ auth_url: string; auth_state: string }> => {
        const response = await api.post<{ auth_url: string; auth_state: string }>('/auth/google', {
            agent_id: agentId,
            scopes
        });
        return response.data;
    },

    // Execute Agent (Chat)
    executeAgent: async (agentId: string, message: string, sessionId?: string) => {
        const payload = {
            input: message,
            session_id: sessionId
        };
        const response = await api.post(`/agents/${agentId}/execute`, payload);
        return response.data;
    },

    // Delete Agent
    deleteAgent: async (agentId: string): Promise<void> => {
        await api.delete(`/agents/${agentId}`);
    }
};
