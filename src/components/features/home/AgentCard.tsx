
import Image from "next/image";
import { Send } from "lucide-react";

export default function AgentCard() {
    return (
        <div className="relative w-[300px] sm:w-[340px] md:w-[380px] rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up">
            {/* Header - Brown */}
            <div className="bg-[#6D4C41] p-4 flex items-center gap-3">
                <div className="bg-[#8D6E63] p-1.5 rounded-lg border border-[#A1887F]">
                    {/* Simple Robot/Icon placeholder - lucide bot or similar could be better but using simple shapes for now to match style or generic */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="12" x="3" y="6" rx="2" />
                        <path d="M9 14v4" />
                        <path d="M15 14v4" />
                        <path d="M9 10h.01" />
                        <path d="M15 10h.01" />
                        <path d="M12 2v4" />
                        <circle cx="12" cy="2" r="1" />
                    </svg>
                </div>
                <div className="text-white text-xs font-sans">
                    <p className="font-semibold text-white/90">Product Development Agent</p>
                    <p className="text-white/60">Active</p>
                </div>
            </div>

            {/* Body - Glass/Grayish White */}
            <div className="bg-white/90 backdrop-blur-md p-5 pb-6">

                {/* Chat Bubbles */}
                <div className="flex flex-col gap-4 mb-16">
                    {/* User Bubble (Right - Dark Brown) */}
                    <div className="w-[120px] h-[70px] bg-[#5D4037] rounded-2xl rounded-tr-sm self-start animate-pulse mb-4"></div>

                    {/* AI Bubble (Left - Gray) */}
                    <div className="w-[140px] h-[70px] bg-[#9E9E9E] rounded-2xl rounded-tl-sm self-end opacity-80"></div>
                </div>

                {/* Input Placeholder */}
                <div className="relative mt-4">
                    <div className="w-full bg-white rounded-full border border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
                        <span className="text-gray-400 text-xs sm:text-sm">Saya butuh AI Customer Service...</span>
                        <div className="w-6 h-6 bg-[#6D4C41] rounded-full flex items-center justify-center">
                            <Send className="w-3 h-3 text-white ml-0.5" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
