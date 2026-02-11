"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { SendHorizontal, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Agent, agentService } from "@/services/agentService";
import { useToast } from "@/components/ui/ToastProvider";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

interface Message {
    id: string;
    sender: string;
    message: string;
    time: string;
    isBot: boolean;
}

interface SimulatorPhoneProps {
    selectedAgent: Agent | null;
    onMessagesRemainingUpdate?: (remaining: number) => void;
    agentVersion?: number; // Increment this to trigger session reset
    isFocused?: boolean;
}

export default function SimulatorPhone({ selectedAgent, onMessagesRemainingUpdate, agentVersion = 0, isFocused = false }: SimulatorPhoneProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [sessionId, setSessionId] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { showToast } = useToast();

    // Generate new session ID
    const generateSessionId = () => {
        return `sim-session-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    };

    // Initialize session on mount
    useEffect(() => {
        setSessionId(generateSessionId());
    }, []);

    // Reset chat AND session when agent changes
    useEffect(() => {
        setMessages([]);
        setInput("");
        setSessionId(generateSessionId());
    }, [selectedAgent?.id]);

    // Reset session when agent is updated (agentVersion changes)
    useEffect(() => {
        if (agentVersion > 0) {
            setMessages([]);
            setSessionId(generateSessionId());
        }
    }, [agentVersion]);

    // Format current time
    const getCurrentTime = () => {
        return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !selectedAgent) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            sender: "User",
            message: input,
            time: getCurrentTime(),
            isBot: false,
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsSending(true);

        try {
            const response = await agentService.executeAgent(selectedAgent.id, userMsg.message, sessionId);
            const botText = response.response || response.output || JSON.stringify(response);

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: selectedAgent.name,
                message: botText,
                time: getCurrentTime(),
                isBot: true,
            };
            setMessages(prev => [...prev, botMsg]);

            // Update messages_remaining if returned by backend
            if (response.messages_remaining !== undefined && onMessagesRemainingUpdate) {
                onMessagesRemainingUpdate(response.messages_remaining);
            }

        } catch (error) {
            console.error("Agent execution failed", error);
            showToast("Gagal memproses pesan agen.", "error");

            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: "System",
                message: "Maaf, terjadi kesalahan saat memproses pesan.",
                time: getCurrentTime(),
                isBot: true,
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!isSending) handleSend();
        }
    };

    const handleClear = () => {
        setMessages([]);
        setSessionId(generateSessionId()); // New session on clear
    };

    const agentName = selectedAgent?.name || "Agent";

    return (
        <div className="relative w-full h-[800px] md:h-full max-h-[85vh] flex flex-col items-center justify-center">

            {/* MAIN DEVICE BODY */}
            <div className={cn(
                "relative w-full h-full flex flex-col overflow-hidden",
                "rounded-4xl",
                "rounded-4xl",
                "bg-cover bg-center bg-no-repeat", // Use tailwind utility or style
                isFocused ? "shadow-[0px_4px_63px_3px_rgba(65,205,93,1)]" : "shadow-none", // Green Glow
                "select-text"
            )}
                style={{
                    backgroundImage: "url('/whatsapp_background.png')",
                    // Removed blend mode and repeat to make it the main wallpaper
                }}>

                {/* --- HEADER --- */}
                <div className="flex items-center justify-between px-6 py-4 pt-9 bg-[#41CD5D] border-b border-green-600/10 z-20 text-white">
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                            <Image
                                src="/simulatorProfile.webp"
                                alt="Simulator Profile"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-base leading-tight truncate max-w-[120px]">{agentName}</h3>
                            <p className="text-[10px] text-white/90 font-medium">{isSending ? "Mengetik..." : "Simulator"}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClear}
                        className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full text-xs font-bold transition-colors cursor-pointer"
                    >
                        Clear
                    </button>
                </div>

                {/* --- CHAT BODY --- */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-apple bg-transparent">
                    {/* Disclaimer / System Message - Same design as ArthurPhone */}
                    <div className="flex items-center justify-center gap-2 mx-auto mb-6 max-w-[85%]">
                        <Info className="w-5 h-5 text-[#111827] stroke-[2px] shrink-0" />
                        <span className="text-[#111827] text-sm font-semibold leading-tight text-left">
                            Jika masih ada yang salah kamu bisa minta tolong ke Arthur
                        </span>
                    </div>

                    {messages.map((msg) => (
                        <div key={msg.id} className={cn("flex flex-col max-w-[85%]", msg.isBot ? "items-start mr-auto" : "items-end ml-auto")}>
                            {/* Message Bubble */}
                            <div className={cn(
                                "px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm relative wrap-break-word",
                                msg.isBot
                                    ? "bg-white text-gray-800 rounded-tl-none"
                                    : "bg-[#41CD5D] text-white rounded-tr-none"
                            )}>
                                <MarkdownRenderer content={msg.message} isBot={msg.isBot} />
                            </div>

                            {/* Time & Status */}
                            <div className={cn("text-[10px] text-gray-400 mt-1 flex items-center gap-1", msg.isBot ? "ml-1" : "mr-1 justify-end")}>
                                {msg.time}
                                {!msg.isBot && <span className="text-[#2A2E37] font-bold">✓</span>}
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isSending && (
                        <div className="flex flex-col max-w-[85%] items-start mr-auto animate-fade-in-up">
                            <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-[#2A2E37] text-white shadow-sm flex gap-1 items-center">
                                <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>


                {/* --- INPUT AREA --- */}
                <div className="p-4 pb-4 bg-white border-t border-gray-100 z-20">
                    <div className={cn(
                        "flex items-end gap-2 pl-4 pr-1.5 py-1.5 rounded-[24px]",
                        "bg-white",
                        "shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]",
                        "border border-gray-200"
                    )}>
                        <textarea
                            rows={1}
                            placeholder={selectedAgent ? "Ketik pesan..." : "Pilih agen dulu..."}
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                            }}
                            onKeyDown={handleKeyDown}
                            disabled={!selectedAgent}
                            className="grow bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm min-h-[40px] max-h-[120px] py-2.5 resize-none scrollbar-hide"
                            style={{ height: '40px' }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!selectedAgent || isSending || !input.trim()}
                            className="w-10 h-10 mb-0.5 bg-[#41CD5D] hover:bg-[#36bf50] rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                        >
                            <SendHorizontal className="w-5 h-5 ml-0.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
