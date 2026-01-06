"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Agent, agentService } from "@/services/agentService";
import { useToast } from "@/components/ui/ToastProvider";

interface Message {
    id: string;
    sender: string;
    message: string;
    time: string;
    isBot: boolean;
}

interface SimulatorPhoneProps {
    selectedAgent: Agent | null;
}

export default function SimulatorPhone({ selectedAgent }: SimulatorPhoneProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { showToast } = useToast();

    // Reset chat when agent changes
    useEffect(() => {
        setMessages([]);
        setInput("");
    }, [selectedAgent?.id]);

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
            const response = await agentService.executeAgent(selectedAgent.id, userMsg.message);
            // Assuming response has an 'output' or 'response' field. 
            // Based on API Guide: "response payload includes a response field"
            // Let's fallback to JSON stringify if object, or just text.
            const botText = response.response || response.output || JSON.stringify(response);

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: selectedAgent.name,
                message: botText,
                time: getCurrentTime(),
                isBot: true,
            };
            setMessages(prev => [...prev, botMsg]);

        } catch (error) {
            console.error("Agent execution failed", error);
            showToast("Gagal memproses pesan agen.", "error");

            // Optional: Add error message to chat
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
    };

    const agentName = selectedAgent?.name || "Agent";

    return (
        <div className="relative w-full h-[800px] md:h-full max-h-[85vh] flex flex-col items-center justify-center">

            {/* FRAME ELEMENTS (Buttons) - Absolute to container */}
            <div className="absolute top-24 -left-[2px] w-1 h-7 bg-[#2A2E37] rounded-l-md" />
            <div className="absolute top-36 -left-[2px] w-1 h-12 bg-[#2A2E37] rounded-l-md" />
            <div className="absolute top-52 -left-[2px] w-1 h-12 bg-[#2A2E37] rounded-l-md" />
            <div className="absolute top-40 -right-[2px] w-1 h-16 bg-[#2A2E37] rounded-r-md" />

            {/* MAIN DEVICE BODY */}
            <div className={cn(
                "relative w-full h-full flex flex-col overflow-hidden",
                "rounded-[3rem]",
                "border-[8px] md:border-[10px] border-[#1C1F26]",
                "bg-[#F9F9F9]",
                "shadow-[0_20px_50px_rgba(0,0,0,0.3)]",
                "select-none"
            )}>

                {/* NOTCH */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[25px] bg-[#1C1F26] rounded-b-3xl z-30 flex items-center justify-center">
                    <div className="flex gap-2">
                        <div className="w-12 h-1.5 bg-[#0f1115] rounded-full opacity-60"></div>
                        <div className="w-1.5 h-1.5 bg-blue-900/30 rounded-full"></div>
                    </div>
                </div>

                {/* --- HEADER --- */}
                <div className="flex items-center justify-between px-6 py-4 pt-9 bg-white/80 backdrop-blur-md border-b border-gray-100 z-20">
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
                            <h3 className="font-bold text-gray-900 text-base leading-tight truncate max-w-[120px]">{agentName}</h3>
                            <p className="text-[10px] text-gray-500 font-medium">{isSending ? "Mengetik..." : "Simulator"}</p>
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
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-apple bg-[#F9F9F9]">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 text-xs text-center px-8">
                            <p>Mulai percakapan dengan {agentName}.</p>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div key={msg.id} className={cn("flex flex-col max-w-[85%]", msg.isBot ? "items-start mr-auto" : "items-end ml-auto")}>
                            {/* Message Bubble */}
                            <div className={cn(
                                "px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm relative break-words",
                                msg.isBot
                                    ? "bg-[#2A2E37] text-white rounded-tl-none"
                                    : "bg-[#E5E7EB] text-gray-800 rounded-tr-none"
                            )}>
                                {msg.message}
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
                <div className="p-4 pb-8 bg-white border-t border-gray-100 z-20">
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
                            className="flex-grow bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm min-h-[40px] max-h-[120px] py-2.5 resize-none scrollbar-hide"
                            style={{ height: '40px' }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!selectedAgent || isSending || !input.trim()}
                            className="w-10 h-10 mb-0.5 bg-[#2A2E37] hover:bg-[#353A45] rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                        >
                            <SendHorizontal className="w-5 h-5 ml-0.5" />
                        </button>
                    </div>
                </div>

                {/* HOME INDICATOR */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-300 rounded-full z-30"></div>
            </div>
        </div>
    );
}
