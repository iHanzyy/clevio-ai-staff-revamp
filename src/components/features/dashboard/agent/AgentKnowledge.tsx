"use client";

import React, { useState, useEffect } from "react";
import { Trash2, FileText, Plus, Loader2, FileStack, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Agent } from "@/services/agentService";
import { knowledgeService, KnowledgeDocument } from "@/services/knowledgeService";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { useToast } from "@/components/ui/ToastProvider";

interface AgentKnowledgeProps {
    selectedAgent: Agent | null;
    onAgentUpdate?: () => void;
    isAutoMode?: boolean;
}

export default function AgentKnowledge({ selectedAgent, onAgentUpdate, isAutoMode = false }: AgentKnowledgeProps) {
    const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

    const [isFilesModalOpen, setIsFilesModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const { showToast } = useToast();
    // ... rest of imports/state is same context ...


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
            showToast("Gagal mengambil dokumen.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const newFiles = Array.from(files).filter(file => {
            if (file.size > 10 * 1024 * 1024) {
                showToast(`File ${file.name} terlalu besar (Maks 10MB)`, "error");
                return false;
            }
            return true;
        });

        setSelectedFiles(prev => [...prev, ...newFiles]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleRemoveFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleCancel = () => {
        setSelectedFiles([]);
        setUploadProgress({});
    };

    const handleUpload = async () => {
        if (!selectedAgent || selectedFiles.length === 0) return;

        setIsUploading(true);
        const initialProgress: Record<string, number> = {};
        selectedFiles.forEach(f => initialProgress[f.name] = 0);
        setUploadProgress(initialProgress);

        try {
            for (const file of selectedFiles) {
                // Simulate progress for UX
                let progress = 0;
                const interval = setInterval(() => {
                    progress = Math.min(progress + 10, 90);
                    setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
                }, 200);

                await knowledgeService.uploadDocument(selectedAgent.id, file);

                clearInterval(interval);
                setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
            }

            showToast("Semua dokumen berhasil diupload!", "success");
            setSelectedFiles([]);
            setUploadProgress({});
            await fetchDocuments();
        } catch (error) {
            console.error("Upload failed", error);
            showToast("Gagal mengupload beberapa dokumen.", "error");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteClick = (docId: string, event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent modal toggle interactions if any
        setDeleteId(docId);
    };

    const confirmDelete = async () => {
        if (!selectedAgent || !deleteId) return;

        try {
            await knowledgeService.deleteDocument(selectedAgent.id, deleteId);
            setDocuments(prev => prev.filter(d => d.id !== deleteId));
            showToast("Dokumen berhasil dihapus!", "success");
        } catch (error) {
            console.error("Failed to delete document", error);
            showToast("Gagal menghapus dokumen.", "error");
        } finally {
            setDeleteId(null);
        }
    };

    // Filter visible files (Top 3)
    const visibleFiles = documents.slice(0, 3);
    const hasMoreFiles = documents.length > 3;

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.docx,.txt,.pptx"
                multiple
            />

            <div className={cn(
                "w-full px-6 py-6 rounded-[1rem] flex flex-col h-full",
                "bg-[#FDFDFD]",
                "shadow-[0_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,1)]"
            )}>
                <h3 className="text-gray-900 font-bold text-lg mb-4">Pengetahuan Agen</h3>

                {selectedFiles.length > 0 ? (
                    <div className="flex flex-col flex-1">
                        <h4 className="font-bold text-gray-900 text-sm mb-3">Dokumen dipilih</h4>

                        <div className="border border-gray-200 rounded-xl overflow-hidden mb-2">
                            {selectedFiles.map((file, idx) => (
                                <div key={idx} className="relative p-3 bg-white border-b border-gray-100 last:border-0 flex items-center justify-between overflow-hidden">
                                    <div className="flex items-center gap-3 overflow-hidden z-10">
                                        <div className="p-2 bg-gray-50 rounded-lg shrink-0">
                                            <FileText className="w-5 h-5 text-gray-500" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-medium text-gray-900 text-sm truncate">{file.name}</h4>
                                            <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                                        </div>
                                    </div>
                                    {!isUploading && (
                                        <button onClick={() => handleRemoveFile(idx)} className="text-gray-400 hover:text-red-500 z-10 cursor-pointer">
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}

                                    {/* Progress Bar Overlay */}
                                    {isUploading && (
                                        <div
                                            className="absolute bottom-0 left-0 h-1 bg-[#84cc16] transition-all duration-300 z-20"
                                            style={{ width: `${uploadProgress[file.name] || 0}%` }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <p className="text-gray-400 text-xs mb-auto">Periksa nama dokumen sebelum dikirim.</p>

                        <div className="flex items-center gap-3 mt-4">
                            <button
                                onClick={handleCancel}
                                disabled={isUploading}
                                className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={isUploading}
                                className="flex-1 py-3 bg-gradient-to-br from-[#65a30d] to-[#84cc16] text-white font-bold rounded-xl hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_14px_0_rgba(101,163,13,0.39)]"
                            >
                                {isUploading ? <><Loader2 className="w-5 h-5 animate-spin" /></> : "Kirim Dokumen"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {isLoading && !isUploading ? (
                            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm animate-pulse">Memuat...</div>
                        ) : documents.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-4 pb-14">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                                    <FileStack className="w-8 h-8 text-gray-300" />
                                </div>
                                <h4 className="text-gray-900 font-bold mb-2">Belum ada dokumen</h4>
                                <p className="text-gray-400 text-xs max-w-[220px] mx-auto">
                                    Unggah PDF, DOCX, atau TXT untuk memperkaya jawaban agen.
                                </p>
                            </div>
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
                                            onClick={(e) => handleDeleteClick(file.id, e)}
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

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={!selectedAgent || isLoading || isUploading}
                            className="w-full py-3 bg-gradient-to-br from-[#65a30d] to-[#84cc16] text-white font-bold rounded-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_14px_0_rgba(101,163,13,0.39)] outline-none"
                            style={{ marginTop: documents.length > 0 ? "1rem" : "0" }}
                        >
                            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Pilih Dokumen"}
                        </button>
                    </>
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
                                        onClick={(e) => handleDeleteClick(file.id, e)}
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

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
                title="Hapus Dokumen?"
                message="Apakah Anda yakin ingin menghapus dokumen ini? Tindakan ini tidak dapat dibatalkan."
                confirmText="Hapus"
                cancelText="Batal"
                type="danger"
            />
        </>
    );
}
