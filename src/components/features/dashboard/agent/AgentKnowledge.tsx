"use client";

import React, { useState, useEffect } from "react";
import { Trash2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Agent } from "@/services/agentService";
import { knowledgeService, KnowledgeDocument } from "@/services/knowledgeService";

interface AgentKnowledgeProps {
    selectedAgent: Agent | null;
}

export default function AgentKnowledge({ selectedAgent }: AgentKnowledgeProps) {
    const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
    const [isFilesModalOpen, setIsFilesModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (selectedAgent) {
            fetchDocuments();
        } else {
            setDocuments([]);
        }
    }, [selectedAgent]);

    const fetchDocuments = async () => {
        if (!selectedAgent) return;
        setIsLoading(true);
        try {
            const docs = await knowledgeService.getDocuments(selectedAgent.id);
            // Filter out deleted docs just in case backend returns them marked as deleted
            setDocuments(docs.filter(d => !d.is_deleted));
        } catch (error) {
            console.error("Failed to fetch documents", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (docId: string, event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent modal toggle interactions if any
        if (!selectedAgent) return;
        if (!confirm("Are you sure you want to delete this file?")) return;

        try {
            await knowledgeService.deleteDocument(selectedAgent.id, docId);
            setDocuments(prev => prev.filter(d => d.id !== docId));
        } catch (error) {
            console.error("Failed to delete document", error);
            alert("Failed to delete document");
        }
    };

    // Filter visible files (Top 3)
    const visibleFiles = documents.slice(0, 3);
    const hasMoreFiles = documents.length > 3;

    return (
        <>
            <div className={cn(
                "w-full px-6 py-6 rounded-[1rem] flex flex-col h-full",
                "bg-[#FDFDFD]",
                "shadow-[0_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,1)]"
            )}>
                <h3 className="text-gray-900 font-bold text-lg mb-4">Pengetahuan Agen</h3>

                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Memuat...</div>
                ) : documents.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Belum ada dokumen.</div>
                ) : (
                    <div className="flex flex-col gap-4 flex-1">
                        {visibleFiles.map((file) => (
                            <div key={file.id} className="flex items-start justify-between pb-3 border-b border-gray-100 last:border-0">
                                <div className="flex items-start gap-3 overflow-hidden">
                                    <div className="p-2 bg-gray-100 rounded-lg shrink-0">
                                        <FileText className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-gray-900 text-sm truncate">{file.filename}</h4>
                                        <p className="text-xs text-gray-500 line-clamp-1">{Math.round(file.size_bytes / 1024)} KB • {file.content_type}</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">Ditambahkan: {new Date(file.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => handleDelete(file.id, e)}
                                    className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer p-1"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {hasMoreFiles && (
                    <button
                        onClick={() => setIsFilesModalOpen(true)}
                        className="w-full mt-4 text-center text-[#2A2E37] font-bold text-sm hover:underline cursor-pointer"
                    >
                        Buka lebih banyak..
                    </button>
                )}
            </div>

            {/* Files Modal */}
            {isFilesModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFilesModalOpen(false)} />
                    <div className="relative bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[85vh] shadow-2xl animate-fade-in-up flex flex-col">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 shrink-0">Knowledge Base Files</h3>
                        <div className="overflow-y-auto flex flex-col gap-4 pr-2">
                            {documents.map((file) => (
                                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="p-2 bg-white rounded-lg shadow-sm shrink-0">
                                            <FileText className="w-5 h-5 text-gray-500" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-gray-900 text-sm truncate">{file.filename}</h4>
                                            <p className="text-xs text-gray-500 truncate">{Math.round(file.size_bytes / 1024)} KB • {file.content_type}</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">Ditambahkan: {new Date(file.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => handleDelete(file.id, e)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full cursor-pointer shrink-0"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-end shrink-0">
                            <button
                                onClick={() => setIsFilesModalOpen(false)}
                                className="px-6 py-2 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
