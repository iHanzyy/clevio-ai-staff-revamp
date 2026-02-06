"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { SendHorizontal, Lock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { arthurService } from "@/services/arthurService";
import { useToast } from "@/components/ui/ToastProvider";
import { Agent } from "@/services/agentService";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

interface Message {
    id: string;
    sender: "Arthur" | "User";
    message: string;
    time: string;
}

type SectionType = 'name' | 'system_prompt' | 'capabilities' | null;

interface ArthurPhoneProps {
    isActive?: boolean;
    onAgentCreated?: (agentData: any) => void;
    hasAgent?: boolean;
    // isAutoMode removed
    selectedSection?: SectionType;
    selectedAgent?: Agent | null;
    onSectionReset?: () => void;
}

const WELCOME_MESSAGES: Message[] = [
    {
        id: "welcome-1",
        sender: "Arthur",
        message: "Halo, saya Arthur. Saya akan membantu Anda membuat agent.",
        time: "10:05 AM"
    },
    {
        id: "welcome-2",
        sender: "Arthur",
        message: "Klik tombol 'Buat Agent Baru' di tengah untuk memulai.",
        time: "10:06 AM"
    }
];

const AUTO_MODE_WELCOME: Message[] = [
    {
        id: "auto-1",
        sender: "Arthur",
        message: "Hai! Saya siap membantu mengedit agent Anda.",
        time: "10:05 AM"
    },
    {
        id: "auto-2",
        sender: "Arthur",
        message: "Pilih section yang ingin Anda edit, lalu sampaikan perubahan yang diinginkan.",
        time: "10:06 AM"
    }
];

const SECTION_LABELS: Record<string, string> = {
    'name': 'Nama Agen',
    'system_prompt': 'Tugas Agen',
    'capabilities': 'Kemampuan Agen'
};

export default function ArthurPhone({
    isActive = false,
    onAgentCreated,
    hasAgent = false,
    // isAutoMode removed (implicitly true)
    selectedSection = null,
    selectedAgent = null,
    onSectionReset,
    onSelectSection // New Prop
}: ArthurPhoneProps & { onSelectSection?: (section: SectionType) => void }) {
    const [messages, setMessages] = useState<Message[]>(WELCOME_MESSAGES);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [sessionId, setSessionId] = useState("");
    const [hasStarted, setHasStarted] = useState(false);
    const [showLongWaitMessage, setShowLongWaitMessage] = useState(false);
    const [showInfoInsteadOfDots, setShowInfoInsteadOfDots] = useState(false);

    // Dropdown State
    const [isContextDropdownOpen, setIsContextDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const longWaitTimerRef = useRef<NodeJS.Timeout | null>(null);
    const toggleIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const { showToast } = useToast();

    // Determine Arthur's active state
    const isCreateMode = !hasAgent && isActive;
    const isEditMode = hasAgent; // Always valid if agent exists
    // Arthur is active if creating OR (Edit mode AND context selected)
    const isArthurFullyActive = isCreateMode || (isEditMode && selectedSection !== null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsContextDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setSessionId(`arthur-session-${Math.random().toString(36).substring(7)}`);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Long wait timer logic...
    useEffect(() => {
        if (isSending) {
            longWaitTimerRef.current = setTimeout(() => {
                setShowLongWaitMessage(true);
                toggleIntervalRef.current = setInterval(() => {
                    setShowInfoInsteadOfDots(prev => !prev);
                }, 3000);
            }, 10000);
        } else {
            if (longWaitTimerRef.current) clearTimeout(longWaitTimerRef.current);
            if (toggleIntervalRef.current) clearInterval(toggleIntervalRef.current);
            setShowLongWaitMessage(false);
            setShowInfoInsteadOfDots(false);
        }
        return () => {
            if (longWaitTimerRef.current) clearTimeout(longWaitTimerRef.current);
            if (toggleIntervalRef.current) clearInterval(toggleIntervalRef.current);
        };
    }, [isSending]);

    // Reset messages when switching modes (Create vs Edit)
    useEffect(() => {
        if (hasAgent) {
            setMessages(AUTO_MODE_WELCOME);
            setHasStarted(false);
        } else {
            setMessages(WELCOME_MESSAGES);
            setHasStarted(false);
        }
    }, [hasAgent]);

    useEffect(() => {
        if (isCreateMode && !hasStarted && sessionId) {
            setHasStarted(true);
            handleAutoStart();
        }
    }, [isCreateMode, hasStarted, sessionId]);

    const getCurrentTime = () => {
        return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const handleAutoStart = async () => {
        const startMsg = "Saya mau buat Agent AI";
        const userMsg: Message = { id: Date.now().toString(), sender: "User", message: startMsg, time: getCurrentTime() };
        setMessages(prev => [...prev, userMsg]);
        setIsSending(true);
        try {
            const response = await arthurService.sendMessage(sessionId, startMsg);
            handleArthurResponse(response);
        } catch (error) {
            console.error("Failed to start Arthur:", error);
            showToast("Gagal menghubungkan ke Arthur.", "error");
            setIsSending(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isSending || !isArthurFullyActive) return;

        const msgText = input;
        const userMsg: Message = { id: Date.now().toString(), sender: "User", message: msgText, time: getCurrentTime() };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsSending(true);

        try {
            const response = await arthurService.sendMessageWithContext(
                sessionId,
                msgText,
                isEditMode && selectedAgent ? {
                    userId: selectedAgent.user_id,
                    agentId: selectedAgent.id,
                    konteks: selectedSection || '',
                    name: selectedAgent.name,
                    system_prompt: selectedAgent.config?.system_prompt || '',
                    mcp_tools: selectedAgent.mcp_tools || [],
                    google_tools: selectedAgent.google_tools || []
                } : undefined
            );
            handleArthurResponse(response);
        } catch (error) {
            console.error("Failed to send message:", error);
            showToast("Gagal mengirim pesan.", "error");
            setIsSending(false);
        }
    };

    const handleArthurResponse = async (response: any) => {
        const responseText = response.output || response.message || JSON.stringify(response);
        const botMsg: Message = { id: Date.now().toString(), sender: "Arthur", message: responseText, time: getCurrentTime() };
        setMessages(prev => [...prev, botMsg]);
        setIsSending(false);

        if (isCreateMode) {
            // ... (Agent Creation Logic remains same) ...
            // We can optimize this block if needed, but keeping it as is for safety
            const agentData = response.agentData || response;
            if (agentData.name && (agentData.system_prompt || agentData.config?.system_prompt) && onAgentCreated) {
                onAgentCreated(agentData);
            }
        }

        // Removed automatic onSectionReset() to keep context active during conversation
        // if (isEditMode && onSectionReset) {
        //     if (response.success !== false) {
        //         onSectionReset();
        //         showToast("Perubahan berhasil diterapkan!", "success");
        //     }
        // }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!isSending && isArthurFullyActive) handleSend();
        }
    };

    const handleClear = () => {
        if (hasAgent) {
            setMessages(AUTO_MODE_WELCOME);
        } else {
            setMessages(WELCOME_MESSAGES);
        }
        setHasStarted(false);
        setSessionId(`arthur-session-${Math.random().toString(36).substring(7)}`);
    };

    const getPlaceholder = () => "Ketik pesan...";

    const getOverlayMessage = () => {
        if (!hasAgent && !isActive) return "Terkunci";
        return null;
    };

    const overlayMessage = getOverlayMessage();

    return (
        <div className={cn(
            "relative w-full h-[800px] md:h-full max-h-[85vh] flex flex-col rounded-4xl overflow-hidden",
            "bg-[linear-gradient(0deg,#FFFAF2_0%,#C3D2F4_100%)]",
            "shadow-[0px_4px_63px_3px_rgba(37,99,235,1)]"
        )}>
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-5 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10 transition-all">
                <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                        <Image src="/arthurProfile.webp" alt="Arthur" fill className="object-cover" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[#2563EB] text-lg leading-tight">Arthur</h3>
                        <p className="text-xs text-[#111827] font-medium">{isSending ? "Mengetik..." : "AI Assistant"}</p>
                    </div>
                </div>
                <button onClick={handleClear} className="text-sm font-medium text-gray-400 hover:text-red-500 transition-colors cursor-pointer">Clear</button>
            </div>

            {/* CHAT BODY */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-apple bg-transparent">
                {/* Disclaimer / System Message */}
                <div className="bg-white text-gray-800 rounded-2xl px-2 py-3 shadow-sm mx-auto mb-6 text-center text-sm font-semibold w-fit max-w-[80%] leading-snug">
                    Arthur siap membantumu membuat staf AI yang kamu inginkan
                </div>

                {messages.map((msg) => {
                    const isArthur = msg.sender === "Arthur";
                    return (
                        <div key={msg.id} className={cn("flex flex-col max-w-[85%]", isArthur ? "items-start mr-auto" : "items-end ml-auto")}>
                            <div className={cn("px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm relative wrap-break-word", isArthur ? "bg-[#2563EB] text-white rounded-tl-none" : "bg-[#02457A] text-white rounded-tr-none")}>
                                <MarkdownRenderer content={msg.message} isBot={isArthur} />
                            </div>
                            <div className={cn("text-[10px] text-gray-400 mt-1 flex items-center gap-1", isArthur ? "ml-1" : "mr-1 justify-end")}>{msg.time}</div>
                        </div>
                    );
                })}
                {isSending && (
                    <div className="flex flex-col max-w-[85%] items-start mr-auto animate-fade-in-up">
                        <div className="px-5 py-4 rounded-2xl rounded-tl-none bg-[#2A2E37] text-white shadow-sm flex gap-1 items-center min-h-[48px] transition-opacity duration-500">
                            {(!showLongWaitMessage || !showInfoInsteadOfDots) ? (
                                <>
                                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce"></div>
                                </>
                            ) : (
                                <span className="text-sm animate-fade-in italic">⏳ Mohon menunggu sekitar 1-2 menit...</span>
                            )}
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* INPUT AREA */}
            <div className="p-4 bg-white border-t border-gray-100 relative">
                {/* Overlay for non-active states */}
                {overlayMessage && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center animate-fade-in-down">
                        <div className="bg-white p-3 rounded-full shadow-lg border border-gray-100 flex items-center gap-2 px-4">
                            <Lock className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-semibold text-gray-500">{overlayMessage}</span>
                        </div>
                    </div>
                )}

                {/* CONTEXT DROPDOWN (Moved Above Input) */}
                {hasAgent && (
                    <div className="relative mb-2 px-1" ref={dropdownRef}>
                        <button
                            onClick={() => setIsContextDropdownOpen(!isContextDropdownOpen)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border select-none w-fit",
                                selectedSection
                                    ? "bg-lime-100 text-lime-700 border-lime-200 hover:bg-lime-200"
                                    : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                            )}
                        >
                            <span className="opacity-70 font-medium">Konteks:</span>
                            {selectedSection ? SECTION_LABELS[selectedSection] : "Pilih..."}
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("transition-transform", isContextDropdownOpen && "rotate-180")}>
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {isContextDropdownOpen && (
                            <div className="absolute bottom-full left-0 mb-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 z-50 animate-fade-in-up">
                                <div className="text-[10px] font-bold text-gray-400 px-3 py-1.5 uppercase tracking-wider">
                                    Pilih Konteks
                                </div>

                                {Object.entries(SECTION_LABELS).map(([key, label]) => (
                                    <button
                                        key={key}
                                        onClick={() => {
                                            onSelectSection?.(key as SectionType);
                                            setIsContextDropdownOpen(false);
                                        }}
                                        className={cn(
                                            "w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-between",
                                            selectedSection === key
                                                ? "bg-lime-50 text-lime-700"
                                                : "text-gray-700 hover:bg-gray-50"
                                        )}
                                    >
                                        {label}
                                        {selectedSection === key && <div className="w-1.5 h-1.5 rounded-full bg-lime-500"></div>}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className={cn(
                    "flex items-end gap-2 pl-4 pr-1.5 py-1.5 rounded-[24px]", // Reverted pl-2 to pl-4
                    "bg-white",
                    "shadow-[inset_2px_2px_6px_rgba(0,0,0,0.05),0_4px_10px_rgba(0,0,0,0.05)]",
                    "border border-gray-100",
                    !isArthurFullyActive && "opacity-80" // Less opacity reduction
                )}>



                    <textarea
                        rows={1}
                        placeholder={getPlaceholder()}
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            e.target.style.height = 'auto';
                            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                        }}
                        onKeyDown={handleKeyDown}
                        disabled={!isArthurFullyActive} // Simplified disabled condition
                        className="grow bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm min-h-[40px] max-h-[120px] py-2.5 resize-none scrollbar-hide"
                        style={{ height: '40px' }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!isArthurFullyActive || isSending || !input.trim()}
                        className="w-10 h-10 mb-0.5 bg-[#2563EB] hover:bg-[#1d4ed8] rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                        <SendHorizontal className="w-5 h-5 ml-0.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

