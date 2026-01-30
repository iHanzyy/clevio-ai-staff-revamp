"use client";

import React, { useState, useEffect, useRef } from "react";
import { Trash2, FileText, Plus, Loader2, FileStack, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Agent } from "@/services/agentService";
import { knowledgeService, KnowledgeDocument } from "@/services/knowledgeService";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { useToast } from "@/components/ui/ToastProvider";
import { useUserTier } from "@/hooks/useUserTier";
import PlanRestrictionPopup from "@/components/ui/PlanRestrictionPopup";

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
    const [isFileSelectionModalOpen, setIsFileSelectionModalOpen] = useState(false); // NEW: Popup for file confirmation
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Trial Logic
    const { isGuest } = useUserTier();
    const [isTrialPopupOpen, setIsTrialPopupOpen] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { showToast } = useToast();

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
            setDocuments(docs.filter(d => !d.is_deleted));
        } catch (error) {
            console.error("Failed to fetch documents", error);
            showToast("Gagal mengambil dokumen. Terjadi kesalahan saat mengambil dokumen.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const newFiles = Array.from(files).filter(file => {
            if (file.size > 10 * 1024 * 1024) {
                showToast(`File ${file.name} terlalu besar. Ukuran maksimum file adalah 10MB.`, "error");
                return false;
            }
            return true;
        });

        if (newFiles.length > 0) {
            setSelectedFiles(prev => [...prev, ...newFiles]);
            // Open confirmation popup after file selection
            setIsFileSelectionModalOpen(true);
        }

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Reset old files when opening file picker (fresh selection)
    const handleOpenFilePicker = () => {
        // Clear any stale files from previous failed uploads
        setSelectedFiles([]);
        setUploadProgress({});
        fileInputRef.current?.click();
    };

    const handleAddMoreFiles = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveFile = (index: number) => {
        setSelectedFiles(prev => {
            const updated = prev.filter((_, i) => i !== index);
            // If no files left, close popup
            if (updated.length === 0) {
                setIsFileSelectionModalOpen(false);
            }
            return updated;
        });
    };

    const handleCancelSelection = () => {
        setSelectedFiles([]);
        setUploadProgress({});
        setIsFileSelectionModalOpen(false);
    };

    const handleUpload = async () => {
        if (!selectedAgent || selectedFiles.length === 0) return;

        // Close popup first, then show loading in section
        setIsFileSelectionModalOpen(false);
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
        } catch (error) {
            console.error("Upload failed", error);
            showToast("Beberapa dokumen gagal diupload.", "error");
        } finally {
            // Always reset state and refresh documents list
            // This ensures successfully uploaded files appear even if some failed
            setSelectedFiles([]);
            setUploadProgress({});
            setIsUploading(false);
            await fetchDocuments();
        }
    };

    const handleDeleteClick = (docId: string, event: React.MouseEvent) => {
        event.stopPropagation();
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

    // Calculate total size of selected files
    const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.docx,.txt,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                multiple
            />

            <div className={cn(
                "w-full px-6 py-6 rounded-2xl flex flex-col h-full",
                "bg-[#FDFDFD]",
                "shadow-[0_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,1)]",
                "relative overflow-hidden" // Needed for overlay
            )}>
                <div className={cn("flex flex-col h-full", isGuest && "opacity-50 grayscale pointer-events-none")}>
                    <h3 className="text-gray-900 font-bold text-lg mb-4">Pengetahuan Agen</h3>

                    {/* UPLOADING STATE - Progress bars in section */}
                    {isUploading ? (
                        <div className="flex flex-col flex-1">
                            <h4 className="font-bold text-gray-900 text-sm mb-3">Mengupload dokumen...</h4>

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
                                        <div className="text-xs text-gray-500 font-medium z-10">
                                            {uploadProgress[file.name] || 0}%
                                        </div>

                                        {/* Progress Bar Overlay */}
                                        <div
                                            className="absolute bottom-0 left-0 h-1 bg-[#84cc16] transition-all duration-300 z-20"
                                            style={{ width: `${uploadProgress[file.name] || 0}%` }}
                                        />
                                    </div>
                                ))}
                            </div>

                            <p className="text-gray-400 text-xs mb-auto animate-pulse">Mohon tunggu, sedang mengupload...</p>
                        </div>
                    ) : (
                        <>
                            {/* NORMAL STATE - Document list or empty state */}
                            {isLoading ? (
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
                                onClick={handleOpenFilePicker}
                                disabled={!selectedAgent || isLoading}
                                className="w-full py-3 bg-linear-to-br from-[#65a30d] to-[#84cc16] text-white font-bold rounded-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_14px_0_rgba(101,163,13,0.39)] outline-none"
                                style={{ marginTop: documents.length > 0 ? "1rem" : "0" }}
                            >
                                Pilih Dokumen
                            </button>
                        </>
                    )}
                </div> {/* End of grayscaled content */}

                {/* Trial Overlay */}
                {isGuest && (
                    <div
                        className="absolute inset-0 z-20 cursor-pointer"
                        onClick={() => setIsTrialPopupOpen(true)}
                    ></div>
                )}
            </div >

            <PlanRestrictionPopup
                isOpen={isTrialPopupOpen}
                onClose={() => setIsTrialPopupOpen(false)}
                type="feature"
                message="Knowledge Base (RAG) hanya tersedia untuk pengguna terdaftar."
            />

            {/* FILE SELECTION CONFIRMATION POPUP */}
            {
                isFileSelectionModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCancelSelection} />
                        <div className="relative bg-white rounded-3xl p-8 max-w-lg w-full max-h-[85vh] shadow-2xl animate-fade-in-up flex flex-col">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 shrink-0">Dokumen Dipilih</h3>
                            <p className="text-gray-500 text-sm mb-4">
                                {selectedFiles.length} file • {(totalSize / 1024 / 1024).toFixed(2)} MB total
                            </p>

                            <div className="overflow-y-auto flex flex-col gap-3 pr-2 flex-1 max-h-[40vh]">
                                {selectedFiles.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="p-2 bg-white rounded-lg shadow-sm shrink-0">
                                                <FileText className="w-5 h-5 text-gray-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-gray-900 text-sm truncate">{file.name}</h4>
                                                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveFile(idx)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full cursor-pointer shrink-0"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add More Files Button */}
                            <button
                                onClick={handleAddMoreFiles}
                                className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 font-bold rounded-xl hover:border-[#84cc16] hover:text-[#65a30d] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Plus className="w-5 h-5" />
                                Tambah File Lagi
                            </button>

                            {/* Action Buttons */}
                            <div className="mt-6 flex gap-3 shrink-0">
                                <button
                                    onClick={handleCancelSelection}
                                    className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleUpload}
                                    className="flex-1 py-3 bg-linear-to-br from-[#65a30d] to-[#84cc16] text-white font-bold rounded-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_14px_0_rgba(101,163,13,0.39)]"
                                >
                                    Kirim Dokumen
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* ALL FILES MODAL */}
            {
                isFilesModalOpen && (
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
                )
            }

            {/* DELETE CONFIRMATION MODAL */}
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

