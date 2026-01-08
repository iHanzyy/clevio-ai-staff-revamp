
import api from './api';

export interface KnowledgeDocument {
    id: string; // upload_id
    agent_id: string;
    filename: string;
    content_type: string;
    size_bytes: number;
    chunk_count: number;
    created_at: string;
    is_deleted?: boolean;
    // Add other fields if necessary
}

export interface DocumentListResponse {
    uploads: KnowledgeDocument[];
}

export const knowledgeService = {
    // List Uploaded Files
    getDocuments: async (agentId: string): Promise<KnowledgeDocument[]> => {
        const response = await api.get<DocumentListResponse>(`/agents/${agentId}/documents`);
        return response.data.uploads;
    },

    // Upload a File
    uploadDocument: async (agentId: string, file: File): Promise<void> => {
        const formData = new FormData();
        formData.append('file', file);

        // Optional params with defaults as per API Guide
        formData.append('chunk_size', '400');
        formData.append('chunk_overlap', '80');
        formData.append('batch_size', '50');

        await api.post(`/agents/${agentId}/documents`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Delete an Uploaded File
    deleteDocument: async (agentId: string, uploadId: string): Promise<void> => {
        await api.delete(`/agents/${agentId}/documents/${uploadId}`);
    }
};
