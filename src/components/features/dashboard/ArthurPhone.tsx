"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { SendHorizontal, Lock, Sparkles, Info } from "lucide-react";
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



interface ArthurPhoneProps {
    isActive?: boolean;
    onAgentCreated?: (agentData: any) => void;
    onAgentUpdated?: () => void;
    hasAgent?: boolean;
    selectedAgent?: Agent | null;
    isFocused?: boolean;
    isManualMode?: boolean;
    onToggleMode?: () => void;
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



export default function ArthurPhone({
    isActive = true,
    onAgentCreated,
    onAgentUpdated,
    hasAgent = false,
    selectedAgent = null,
    isFocused = true,
    isManualMode = false,
    onToggleMode
}: ArthurPhoneProps) {
    const [messages, setMessages] = useState<Message[]>(WELCOME_MESSAGES);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [sessionId, setSessionId] = useState("");
    const [hasStarted, setHasStarted] = useState(false);
    const [showLongWaitMessage, setShowLongWaitMessage] = useState(false);
    const [showInfoInsteadOfDots, setShowInfoInsteadOfDots] = useState(false);



    const messagesEndRef = useRef<HTMLDivElement>(null);
    const longWaitTimerRef = useRef<NodeJS.Timeout | null>(null);
    const toggleIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const { showToast } = useToast();

    // Determine Arthur's active state
    const isCreateMode = !hasAgent && isActive;
    const isEditMode = hasAgent;
    // Arthur is always active when agent exists or in create mode
    const isArthurFullyActive = isCreateMode || isEditMode;



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
                setShowInfoInsteadOfDots(true); // Stay on thinking text, no toggle back
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
        // N8N returns array format: [{ _responseType, is_done, output }]
        const parsed = Array.isArray(response) ? response[0] : response;

        const responseText = parsed.output || parsed.message || JSON.stringify(parsed);
        const botMsg: Message = { id: Date.now().toString(), sender: "Arthur", message: responseText, time: getCurrentTime() };
        setMessages(prev => [...prev, botMsg]);
        setIsSending(false);

        // Handle _responseType from N8N
        if (parsed._responseType === 'agent_updated' && parsed.is_done === true) {
            console.log('[ArthurPhone] agent_updated detected. Refreshing dashboard data...');
            if (onAgentUpdated) {
                onAgentUpdated();
            }
            return;
        }

        if (isCreateMode) {
            // First check if agentData is directly in response
            const agentData = parsed.agentData || parsed;
            if (agentData.name && (agentData.system_prompt || agentData.config?.system_prompt) && onAgentCreated) {
                onAgentCreated(agentData);
                return;
            }
        } else if (isEditMode) {
            // DETEKSI EDIT SELESAI DARI N8N (legacy fallback tanpa _responseType)
            if (parsed.is_done === true) {
                console.log('[ArthurPhone] Edit completed (legacy). Refreshing dashboard data...');
                if (onAgentUpdated) {
                    onAgentUpdated();
                }
                return;
            }
        }
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
            "relative w-full h-[800px] md:h-full max-h-[85vh] flex flex-col rounded-[30px] overflow-hidden",
            "bg-[linear-gradient(0deg,#FFFAF2_0%,#C3D2F4_100%)]",
            isFocused ? "shadow-[0px_4px_63px_3px_rgba(37,99,235,1)]" : "shadow-none"
        )}>
            {/* HEADER */}
            <div className="flex items-center justify-between px-5 md:px-6 py-4 md:py-5 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10 transition-all shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-gray-200 shadow-sm shrink-0">
                        <Image src="/arthurProfile.webp" alt="Arthur" fill className="object-cover" />
                    </div>
                    <div className="min-w-0 pr-2">
                        <h3 className="font-bold text-[#2563EB] text-base md:text-lg leading-tight truncate">Arthur</h3>
                        <p className="text-[11px] md:text-xs text-[#111827] font-medium truncate">{isSending ? "Mengetik..." : "AI Assistant"}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                    {hasAgent && onToggleMode && (
                        <button 
                            onClick={onToggleMode}
                            className="h-8 px-3 md:px-4 bg-gradient-to-r from-gray-50 to-white hover:from-white hover:to-gray-50 rounded-full flex items-center gap-1.5 md:gap-2 transition-all outline-none border border-gray-200 text-gray-700 cursor-pointer shadow-sm hover:shadow active:scale-95 group"
                        >
                            <span className="text-[9px] md:text-[11px] font-bold tracking-widest hidden sm:block">MODE MANUAL</span>
                            <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#2563EB] group-hover:rotate-180 transition-transform duration-700 ease-in-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    )}
                    <button onClick={handleClear} className="text-[11px] md:text-sm font-medium text-gray-400 hover:text-red-500 transition-colors cursor-pointer p-1.5 md:p-0">Clear</button>
                </div>
            </div>

            {/* CHAT BODY */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-apple bg-transparent">
                {/* Disclaimer / System Message - Updated Design */}
                <div className="flex items-center justify-center gap-2 mx-auto mb-6 max-w-[85%]">
                    <Info className="w-5 h-5 text-[#111827] stroke-[2px] shrink-0" />
                    <span className="text-[#111827] text-sm font-semibold leading-tight text-left">
                        Arthur siap membantumu membuat staf AI yang kamu inginkan
                    </span>
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
                                <span className="text-sm animate-thinking-shimmer font-medium">Sedang berpikir...</span>
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

