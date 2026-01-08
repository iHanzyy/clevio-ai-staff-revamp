"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { SendHorizontal, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { arthurService } from "@/services/arthurService";
import { useToast } from "@/components/ui/ToastProvider";

interface Message {
    id: string;
    sender: "Arthur" | "User";
    message: string;
    time: string;
}

interface ArthurPhoneProps {
    isActive?: boolean;
    onAgentCreated?: (agentData: any) => void;
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

export default function ArthurPhone({ isActive = false, onAgentCreated }: ArthurPhoneProps) {
    const [messages, setMessages] = useState<Message[]>(WELCOME_MESSAGES);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [sessionId, setSessionId] = useState("");
    const [hasStarted, setHasStarted] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { showToast } = useToast();

    useEffect(() => {
        setSessionId(`arthur-session-${Math.random().toString(36).substring(7)}`);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (isActive && !hasStarted && sessionId) {
            setHasStarted(true);
            handleAutoStart();
        }
    }, [isActive, hasStarted, sessionId]);

    const getCurrentTime = () => {
        return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const handleAutoStart = async () => {
        const startMsg = "Saya mau buat Agent AI";

        const userMsg: Message = {
            id: Date.now().toString(),
            sender: "User",
            message: startMsg,
            time: getCurrentTime()
        };
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
        if (!input.trim() || isSending) return;

        const msgText = input;
        const userMsg: Message = {
            id: Date.now().toString(),
            sender: "User",
            message: msgText,
            time: getCurrentTime()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsSending(true);

        try {
            const response = await arthurService.sendMessage(sessionId, msgText);
            handleArthurResponse(response);
        } catch (error) {
            console.error("Failed to send message:", error);
            showToast("Gagal mengirim pesan.", "error");
            setIsSending(false);
        }
    };

    const handleArthurResponse = async (response: any) => {


        const responseText = response.output || response.message || JSON.stringify(response);

        const botMsg: Message = {
            id: Date.now().toString(),
            sender: "Arthur",
            message: responseText,
            time: getCurrentTime()
        };
        setMessages(prev => [...prev, botMsg]);
        setIsSending(false);

        // 1. Detect Agent Completion (Direct Payload from N8N)
        const agentData = response.agentData || response;
        if (agentData.name && (agentData.system_prompt || agentData.config?.system_prompt) && onAgentCreated) {

            onAgentCreated(agentData);
            return;
        }

        // 2. Fallback: Check Webhook Buffer (Bridge for Separate N8N Flows)
        if (onAgentCreated && sessionId) {

            try {
                // Short delay to allow N8N to finish writing to webhook buffer
                await new Promise(r => setTimeout(r, 1500));

                const res = await fetch(`/api/webhooks/arthur/agent-created?session_id=${sessionId}`);
                if (res.ok) {
                    const bufferedData = await res.json();
                    if (bufferedData.name) {

                        onAgentCreated(bufferedData);
                    } else {

                    }
                }
            } catch (err) {
                console.error("[ArthurPhone] Buffer check error:", err);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!isSending) handleSend();
        }
    };

    const handleClear = () => {
        setMessages(WELCOME_MESSAGES);
        setHasStarted(false);
        setSessionId(`arthur-session-${Math.random().toString(36).substring(7)}`);
    };

    return (
        <div className={cn(
            "relative w-full h-[800px] md:h-full max-h-[85vh] flex flex-col rounded-[2rem] overflow-hidden border-[8px] border-[#1C1F26]",
            "bg-[#F9F9F9]",
            "shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
        )}>
            {/* --- HEADER --- */}
            <div className="flex items-center justify-between px-6 py-5 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10 transition-all">
                <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                        <Image
                            src="/arthurProfile.webp"
                            alt="Arthur"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">Arthur</h3>
                        <p className="text-xs text-gray-500 font-medium">{isSending ? "Mengetik..." : "AI Creator"}</p>
                    </div>
                </div>
                <button
                    onClick={handleClear}
                    className="text-sm font-medium text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                    Clear
                </button>
            </div>

            {/* --- CHAT BODY --- */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-apple bg-[#F9F9F9]">
                {messages.map((msg) => {
                    const isArthur = msg.sender === "Arthur";
                    return (
                        <div key={msg.id} className={cn("flex flex-col max-w-[85%]", isArthur ? "items-start mr-auto" : "items-end ml-auto")}>
                            <div className={cn(
                                "px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm relative break-words",
                                isArthur
                                    ? "bg-[#2A2E37] text-white rounded-tl-none"
                                    : "bg-[#E5E7EB] text-gray-800 rounded-tr-none"
                            )}>
                                {msg.message}
                            </div>
                            <div className={cn("text-[10px] text-gray-400 mt-1 flex items-center gap-1", isArthur ? "ml-1" : "mr-1 justify-end")}>
                                {msg.time}
                            </div>
                        </div>
                    );
                })}
                {isSending && (
                    <div className="flex flex-col max-w-[85%] items-start mr-auto animate-fade-in-up">
                        <div className="px-5 py-4 rounded-2xl rounded-tl-none bg-[#2A2E37] text-white shadow-sm flex gap-1 items-center">
                            <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* --- INPUT AREA --- */}
            <div className="p-4 bg-white border-t border-gray-100 relative">

                {/* INACTIVE STATE OVERLAY */}
                {!isActive && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center animate-fade-in-down">
                        <div className="bg-white p-3 rounded-full shadow-lg border border-gray-100 flex items-center gap-2 px-4">
                            <Lock className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-semibold text-gray-500">Terkunci</span>
                        </div>
                    </div>
                )}

                <div className={cn(
                    "flex items-end gap-2 pl-4 pr-1.5 py-1.5 rounded-[24px]",
                    "bg-white",
                    "shadow-[inset_2px_2px_6px_rgba(0,0,0,0.05),0_4px_10px_rgba(0,0,0,0.05)]",
                    "border border-gray-100",
                    !isActive && "opacity-50"
                )}>
                    <textarea
                        rows={1}
                        placeholder={isActive ? "Jawab pertanyaan Arthur..." : "Buat Agent Baru dulu..."}
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            e.target.style.height = 'auto';
                            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                        }}
                        onKeyDown={handleKeyDown}
                        disabled={!isActive}
                        className="flex-grow bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm min-h-[40px] max-h-[120px] py-2.5 resize-none scrollbar-hide"
                        style={{ height: '40px' }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!isActive || isSending || !input.trim()}
                        className="w-10 h-10 mb-0.5 bg-[#2A2E37] hover:bg-[#353A45] rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                        <SendHorizontal className="w-5 h-5 ml-0.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
