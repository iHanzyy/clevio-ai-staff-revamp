"use client";

import Image from "next/image";
import { useState } from "react";

export default function ArthurSection() {
    const [message, setMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const handleSendMessage = () => {
        if (message.trim()) {
            // TODO: Handle send message logic
            console.log("Message sent:", message);
            setMessage("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    // Dummy chat messages
    const chatMessages = [
        { id: 1, from: "arthur", text: "Halo! Saya Arthur, AI Creator yang siap membantu Anda." },
        { id: 2, from: "user", text: "Hai Arthur, saya ingin membuat staf AI untuk customer service." },
        { id: 3, from: "arthur", text: "Tentu! Saya akan membantu Anda membuat AI staf untuk customer service. Apa nama yang ingin Anda berikan?" },
        { id: 4, from: "user", text: "Bagaimana kalau kita beri nama \"Sarah\"?" },
    ];

    return (
        <section className="relative w-full font-google-sans-flex -mt-60">
            {/* Wave SVG at TOP - overlapping from hero */}
            <div className="relative w-full" style={{ minHeight: '280px' }}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 390 280"
                    fill="none"
                    className="w-full h-full absolute inset-0"
                    style={{ filter: 'drop-shadow(0 -3px 21.4px rgba(0, 0, 0, 0.25))' }}
                    preserveAspectRatio="none"
                >
                    <path d="M0 24.4C62.6661 113.341 390 20.9 390 140C390 260 390 280 390 280H0V24.4Z" fill="#FFFAF2" />
                </svg>

                {/* Content positioned INSIDE the wave area */}
                <div className="relative z-10 flex flex-col justify-center h-full pt-35 pb-8 px-6 sm:px-8 md:px-12 lg:px-16">
                    {/* Heading */}
                    <div className="max-w-4xl mx-auto mb-6 w-full">
                        <h2 className="text-center text-xl sm:text-2xl md:text-3xl leading-normal text-gray-800" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                            Hai.. saya <span className="font-bold">ARTHUR</span> saya akan membantu Anda membuat staf AI
                        </h2>
                    </div>

                    {/* Arthur Profile - Aligned Left */}
                    <div className="max-w-3xl mx-auto w-full">
                        <div className="flex items-center gap-3">
                            <div className="relative w-[60px] h-[60px] rounded-full overflow-hidden shadow-lg flex-shrink-0">
                                <Image
                                    src="/arthurProfile.webp"
                                    alt="Arthur"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1">
                                    <span className="font-poppins font-bold text-[20px] text-[#2563EB]">
                                        Arthur
                                    </span>
                                    <span className="text-[#2563EB] text-xs">✦</span>
                                </div>
                                <span className="font-poppins font-medium text-[12px] text-gray-600">
                                    AI Creator
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Section - Gradient Background */}
            <div
                className="relative py-8 px-6 sm:px-8 md:px-12 lg:px-16"
                style={{
                    background: 'linear-gradient(to bottom, #C3D2F4 0%, #FFFAF2 100%)'
                }}
            >
                {/* Chat Messages Container */}
                <div className="max-w-3xl mx-auto mb-8 space-y-4">
                    {chatMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
                        >
                            <div
                                className={`max-w-[70%] sm:max-w-[60%] px-5 py-3.5 rounded-3xl shadow-md ${msg.from === "arthur"
                                    ? "bg-[#2563EB] text-white"
                                    : "bg-[#02457A] text-white"
                                    }`}
                            >
                                <p className="text-sm sm:text-base leading-relaxed">{msg.text}</p>
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex justify-start animate-fade-in">
                            <div className="bg-[#2563EB] text-white px-5 py-3.5 rounded-3xl shadow-md">
                                <div className="flex gap-1.5">
                                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Field */}
                <div className="max-w-3xl mx-auto">
                    <div className="relative bg-white rounded-full shadow-2xl pl-6 pr-14 py-4">
                        <input
                            type="text"
                            placeholder="Ketik disini......."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="w-full bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 text-base"
                        />
                        {/* Button INSIDE input */}
                        <button
                            onClick={handleSendMessage}
                            disabled={!message.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-[#2563EB] rounded-full flex items-center justify-center hover:bg-[#1d4ed8] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Send Message"
                        >
                            <div className="h-5 w-5 relative">
                                <Image
                                    src="/starIcon.png"
                                    alt="Send"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
