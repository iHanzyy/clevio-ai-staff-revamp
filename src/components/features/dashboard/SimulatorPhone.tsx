"use client";

import React from "react";
import Image from "next/image";
import { SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";


export default function SimulatorPhone({ agentName }: { agentName?: string }) {
    return (
        <div className="relative w-full h-[800px] md:h-full max-h-[85vh] flex flex-col items-center justify-center">

            {/* FRAME ELEMENTS (Buttons) - Absolute to container */}
            {/* Left Side: Mute & Volume */}
            <div className="absolute top-24 -left-[2px] w-1 h-7 bg-[#2A2E37] rounded-l-md" /> {/* Mute */}
            <div className="absolute top-36 -left-[2px] w-1 h-12 bg-[#2A2E37] rounded-l-md" /> {/* Vol Up */}
            <div className="absolute top-52 -left-[2px] w-1 h-12 bg-[#2A2E37] rounded-l-md" /> {/* Vol Down */}

            {/* Right Side: Power */}
            <div className="absolute top-40 -right-[2px] w-1 h-16 bg-[#2A2E37] rounded-r-md" /> {/* Power */}

            {/* MAIN DEVICE BODY */}
            <div className={cn(
                "relative w-full h-full flex flex-col overflow-hidden",
                "rounded-[3rem]", // Extra rounded corners for iPhone look
                "border-[8px] md:border-[10px] border-[#1C1F26]", // The Bezel
                "bg-[#F9F9F9]",
                "shadow-[0_20px_50px_rgba(0,0,0,0.3)]",
                "select-none"
            )}>

                {/* NOTCH (Dynamic Island style) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[25px] bg-[#1C1F26] rounded-b-3xl z-30 flex items-center justify-center">
                    {/* Camera/Sensor dots */}
                    <div className="flex gap-2">
                        <div className="w-12 h-1.5 bg-[#0f1115] rounded-full opacity-60"></div>
                        <div className="w-1.5 h-1.5 bg-blue-900/30 rounded-full"></div>
                    </div>
                </div>

                {/* --- HEADER --- */}
                {/* Added pt-9 to push content below notch */}
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
                            <h3 className="font-bold text-gray-900 text-base leading-tight">{agentName}</h3>
                            <p className="text-[10px] text-gray-500 font-medium">Simulator</p>
                        </div>
                    </div>
                    <button className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full text-xs font-bold transition-colors cursor-pointer">
                        Reset
                    </button>
                </div>

                {/* --- CHAT BODY --- */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-apple bg-[#F9F9F9]">
                    {/* Real Messages will come here */}
                    {[].map((msg: any) => {
                        const isBot = msg.sender === (agentName || "Bot");
                        return (
                            <div key={msg.id} className={cn("flex flex-col max-w-[85%]", isBot ? "items-start mr-auto" : "items-end ml-auto")}>
                                {/* Message Bubble */}
                                <div className={cn(
                                    "px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm relative",
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
                <div className="p-4 pb-8 bg-white border-t border-gray-100 z-20"> {/* pb-8 to account for home indicator area */}
                    <div className={cn(
                        "flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full",
                        "bg-white",
                        "shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]",
                        "border border-gray-200"
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

                {/* HOME INDICATOR */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-300 rounded-full z-30"></div>
            </div>
        </div>
    );
}
