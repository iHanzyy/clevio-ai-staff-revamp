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
    // mcp_tools, etc.
}

export const agentService = {
    // List all agents
    getAgents: async (): Promise<Agent[]> => {
        const response = await api.get<Agent[]>('/agents/');
        return response.data;
    },

    // Create new agent
    // Create new agent
    createAgent: async (payload: any): Promise<Agent> => {
        const response = await api.post<Agent>('/agents/', payload);
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
    }
};
