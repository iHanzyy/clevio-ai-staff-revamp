"use client";

import React from "react";
import Image from "next/image";
import { SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

// Dummy Chat Data for Simulator
const MOCK_CHAT = [
    {
        id: 1,
        sender: "Asdos Bot",
        message: "Hello, Anta. Your nim is assi consectetur adipistnmumiano ullma.",
        time: "10:00 AM"
    },
    {
        id: 2,
        sender: "User",
        message: "Yasi, nici your one of the commod onaor lves:e:an s rastributed on the chat ri've-raggrested in tnit ink alibra concams.",
        time: "10:00 AM"
    },
    {
        id: 3,
        sender: "Asdos Bot",
        message: "Dopesill kama, menakkan kemorat proger?",
        time: "10:00 AM"
    },
    {
        id: 4,
        sender: "User",
        message: "Hey, ham I mengipokan sangxx-ae mengar sanum serensial?",
        time: "10:00 AM"
    },
    {
        id: 5,
        sender: "Asdos Bot",
        message: "Witnr, altar herum .trnyu btrana isk sultem.",
        time: "10:00 AM"
    }
];

export default function SimulatorPhone() {
    return (
        <div className={cn(
            "w-full h-[800px] md:h-full max-h-[85vh] flex flex-col rounded-[3rem] overflow-hidden border-[8px] border-[#1C1F26]",
            "bg-[#F9F9F9]", // Phone Screen Background
            // Device Outer Shadow (Clay-like depth)
            "shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
        )}>
            {/* --- HEADER --- */}
            <div className="flex items-center justify-between px-6 py-5 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10">
                <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                        <Image
                            src="/simulatorProfile.webp"
                            alt="Asdos Bot"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">Asdos Bot</h3>
                        <p className="text-xs text-gray-500 font-medium">Simulator</p>
                    </div>
                </div>
                <button className="text-sm font-medium text-gray-400 hover:text-red-600 transition-colors cursor-pointer">
                    Reset
                </button>
            </div>

            {/* --- CHAT BODY --- */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-apple bg-[#F9F9F9]">
                {MOCK_CHAT.map((msg) => {
                    const isBot = msg.sender === "Asdos Bot";
                    return (
                        <div key={msg.id} className={cn("flex flex-col max-w-[85%]", isBot ? "items-start mr-auto" : "items-end ml-auto")}>
                            {/* Message Bubble */}
                            <div className={cn(
                                "px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm relative",
                                isBot
                                    ? "bg-[#2A2E37] text-white rounded-tl-none" // Dark Theme Bubble
                                    : "bg-[#E5E7EB] text-gray-800 rounded-tr-none"
                            )}>
                                {msg.message}
                            </div>

                            {/* Time & Status */}
                            <div className={cn("text-[10px] text-gray-400 mt-1 flex items-center gap-1", isBot ? "ml-1" : "mr-1 justify-end")}>
                                {msg.time}
                                {!isBot && <span className="text-[#2A2E37] font-bold">✓</span>}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* --- INPUT AREA --- */}
            <div className="p-4 bg-white border-t border-gray-100">
                <div className={cn(
                    "flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full",
                    "bg-white",
                    // Claymorphism Input Container
                    "shadow-[inset_2px_2px_6px_rgba(0,0,0,0.05),0_4px_10px_rgba(0,0,0,0.05)]",
                    "border border-gray-100"
                )}>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-grow bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm h-10"
                    />
                    <button className="w-10 h-10 bg-[#2A2E37] hover:bg-[#353A45] rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 cursor-pointer">
                        <SendHorizontal className="w-5 h-5 ml-0.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
