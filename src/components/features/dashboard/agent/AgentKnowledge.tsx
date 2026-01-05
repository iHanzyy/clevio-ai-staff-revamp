"use client";

import React, { useState } from "react";
import { Trash2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const KNOWLEDGE_FILES = [
    { id: 1, title: "Tite teatu:m 1", desc: "Sesourest descriptions bant yurmili sepantum.", date: "DD MMM YYYY" },
    { id: 2, title: "Penetarrum 2", desc: "Resouresi descriptions bant yurmili sepantum.", date: "DD MMM YYYY" },
    { id: 3, title: "Penetarrum 3", desc: "Resouresi descriptions bant yurmili sepantum.", date: "DD MMM YYYY" },
    // Hidden by default if > 3
    { id: 4, title: "Hidden File 4", desc: "This file is hidden by default.", date: "DD MMM YYYY" },
    { id: 5, title: "Hidden File 5", desc: "This file is hidden by default.", date: "DD MMM YYYY" },
];

export default function AgentKnowledge() {
    const [isFilesModalOpen, setIsFilesModalOpen] = useState(false);

    // Filter visible files (Top 3)
    const visibleFiles = KNOWLEDGE_FILES.slice(0, 3);
    const hasMoreFiles = KNOWLEDGE_FILES.length > 3;

    return (
        <>
            <div className={cn(
                "w-full px-6 py-6 rounded-[1rem] flex flex-col h-full", // Flex col + h-full
                "bg-[#FDFDFD]",
                "shadow-[0_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,1)]"
            )}>
                <h3 className="text-gray-900 font-bold text-lg mb-4">Pengetahuan Agen</h3>
                <div className="flex flex-col gap-4 flex-1">
                    {visibleFiles.map((file) => (
                        <div key={file.id} className="flex items-start justify-between pb-3 border-b border-gray-100">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <FileText className="w-5 h-5 text-gray-500" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{file.title}</h4>
                                    <p className="text-xs text-gray-500 line-clamp-1">{file.desc}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">Ditambahkan: {file.date}</p>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
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
                    <div className="relative bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl animate-fade-in-up">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Knowledge Base Files</h3>
                        <div className="max-h-[60vh] overflow-y-auto flex flex-col gap-4">
                            {KNOWLEDGE_FILES.map((file) => (
                                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <FileText className="w-5 h-5 text-gray-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm">{file.title}</h4>
                                            <p className="text-xs text-gray-500">{file.desc}</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">Ditambahkan: {file.date}</p>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full cursor-pointer">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-end">
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
