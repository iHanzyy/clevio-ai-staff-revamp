"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { agentService } from "@/services/agentService";

interface Message {
    id: number;
    from: "arthur" | "user";
    text: string;
}

export default function ArthurSection() {
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, from: "arthur", text: "Halo! Saya Arthur, AI Creator yang siap membantu Anda." }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [isProcessingFinal, setIsProcessingFinal] = useState(false);

    // State to hold session and credentials
    const [sessionId, setSessionId] = useState("");
    const [credentials, setCredentials] = useState({ email: "", password: "" });

    // Ref for auto-scroll


    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (messages.length > 1) { // Don't scroll on initial load
            // Use setTimeout to ensure DOM is updated completely
            setTimeout(() => {
                if (inputRef.current) {
                    // Scroll the Input into view.
                    // block: 'end' aligns the bottom of the input with the viewport bottom.
                    // This ensures the input (and thus the latest message above it) is visible.
                    inputRef.current.scrollIntoView({ behavior: 'instant', block: 'end' });
                }
            }, 100);
        }
    }, [messages, isTyping]);

    // Cleanup polling on unmount
    useEffect(() => {
        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, []);

    // ... (rest of code)

    // Ref for Chat Container
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Ref for section scroll target
    const sectionRef = useRef<HTMLElement>(null);

    // Ref for input focus
    const inputRef = useRef<HTMLInputElement>(null);

    // Polling ref
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Listen for custom events from HeroSection
    useEffect(() => {
        const handleScrollToArthur = () => {
            sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Focus input after scroll completes
            setTimeout(() => {
                inputRef.current?.focus();
            }, 600);
        };

        const handleSendToArthur = (e: CustomEvent<{ message: string }>) => {
            // Scroll first
            sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Set message and send after scroll
            setTimeout(() => {
                setMessage(e.detail.message);
                inputRef.current?.focus();
                // Trigger send after state update
                setTimeout(() => {
                    const sendButton = document.querySelector('[aria-label="Send Message"]') as HTMLButtonElement;
                    sendButton?.click();
                }, 100);
            }, 600);
        };

        window.addEventListener('scrollToArthur', handleScrollToArthur);
        window.addEventListener('sendToArthur', handleSendToArthur as EventListener);

        return () => {
            window.removeEventListener('scrollToArthur', handleScrollToArthur);
            window.removeEventListener('sendToArthur', handleSendToArthur as EventListener);
        };
    }, []);

    // Initialize session and credentials on mount
    useEffect(() => {
        // Generate random credentials
        const randomString = Math.random().toString(36).substring(2, 10);
        const generatedEmail = `${randomString}@clevio.staff`;
        const generatedPassword = `${randomString}1`;

        // Generate random session ID
        const generatedSessionId = `arthur-session-${Math.random().toString(36).substring(2, 9)}`;

        setCredentials({
            email: generatedEmail,
            password: generatedPassword
        });
        setSessionId(generatedSessionId);
    }, []);



    // Cleanup polling on unmount
    useEffect(() => {
        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, []);

    // Start polling for agent data from webhook
    const startPollingForAgentData = () => {
        if (pollingIntervalRef.current) return; // Already polling

        let pollCount = 0;
        const maxPolls = 120; // 120 * 2s = 4 minutes max

        pollingIntervalRef.current = setInterval(async () => {
            pollCount++;

            if (pollCount > maxPolls) {
                // Timeout - stop polling
                if (pollingIntervalRef.current) {
                    clearInterval(pollingIntervalRef.current);
                    pollingIntervalRef.current = null;
                }
                setIsTyping(false);
                return;
            }

            try {
                const res = await fetch(`/api/webhooks/arthur/agent-created?session_id=${sessionId}`);

                if (res.ok) {
                    const agentData = await res.json();

                    if (agentData && agentData.name) {
                        // Stop polling
                        if (pollingIntervalRef.current) {
                            clearInterval(pollingIntervalRef.current);
                            pollingIntervalRef.current = null;
                        }

                        // Save to localStorage
                        localStorage.setItem('agent_payload', JSON.stringify(agentData));

                        // Show success message
                        setMessages(prev => [...prev, {
                            id: Date.now(),
                            from: "arthur",
                            text: "Agen Anda berhasil dibuat! Sedang memproses akun Anda..."
                        }]);

                        setIsTyping(false);
                        setIsProcessingFinal(true);

                        // Proceed to registration and agent creation
                        await handleFinalRegistration(agentData);
                    }
                }
            } catch (err) {
                console.error("[ArthurSection] Polling error:", err);
            }
        }, 2000); // Poll every 2 seconds
    };

    const handleFinalRegistration = async (agentData: any) => {
        try {
            // Step 1: Hit register webhook and get access_token
            const registerResponse = await fetch('/api/arthur/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password
                })
            });

            const registerData = await registerResponse.json();
            console.log("[ArthurSection] Register response:", registerData);

            // Step 2: Extract and save access_token (Handle Array or Object)
            let accessToken;
            if (Array.isArray(registerData) && registerData.length > 0) {
                accessToken = registerData[0].access_token;
            } else {
                accessToken = registerData.access_token;
            }

            const tokenToUse = accessToken; // alias for clarity

            if (accessToken) {
                // Save to localStorage (for API calls)
                localStorage.setItem('jwt_token', accessToken);

                // Save to cookie (for middleware protection)
                document.cookie = `session_token=${accessToken}; path=/; max-age=604800; SameSite=Lax`;

                console.log("[ArthurSection] Access token saved successfully");

                // Step 3: Create agent using Proxy (to avoid CORS)
                try {
                    console.log("[ArthurSection] Creating agent via Proxy...");
                    const createAgentResponse = await fetch('/api/agents/create', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            payload: agentData,
                            token: tokenToUse
                        })
                    });

                    if (!createAgentResponse.ok) {
                        throw new Error("Failed to create agent via proxy");
                    }

                    console.log("[ArthurSection] Agent created successfully via Proxy");

                } catch (agentError) {
                    console.error("[ArthurSection] Failed to create agent:", agentError);
                    // Still redirect even if agent creation fails
                }
            } else {
                console.warn("[ArthurSection] No access_token received from register webhook");
            }

            // Step 4: Redirect to dashboard
            router.push('/dashboard');

        } catch (error) {
            console.error("[ArthurSection] Registration error:", error);
            // Still try to redirect
            router.push('/dashboard');
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim() || isTyping || isProcessingFinal) return;

        // Add user message
        const userMsg: Message = { id: Date.now(), from: "user", text: message };
        setMessages(prev => [...prev, userMsg]);
        setMessage("");
        setIsTyping(true);

        try {
            const response = await fetch('/api/arthur/landing-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId: sessionId,
                    chatInput: userMsg.text,
                    email: credentials.email,
                    password: credentials.password
                })
            });

            const data = await response.json();
            console.log("[ArthurSection] Chat response:", data);

            // Extract response text from various N8N response formats
            let responseText = "";

            if (Array.isArray(data) && data.length > 0 && data[0].system_prompt) {
                // Direct agent data response - process immediately
                console.log("[ArthurSection] Direct agent data received");
                localStorage.setItem('agent_payload', JSON.stringify(data[0]));
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    from: "arthur",
                    text: "Agen Anda berhasil dibuat! Sedang memproses..."
                }]);
                setIsTyping(false);
                setIsProcessingFinal(true);
                await handleFinalRegistration(data[0]);
                return;
            } else if (data.output) {
                responseText = data.output;
            } else if (data.text) {
                responseText = data.text;
            } else if (typeof data === 'string') {
                responseText = data;
            } else if (data.message) {
                responseText = data.message;
            } else {
                responseText = "Saya mengerti. Bisa Anda jelaskan lebih lanjut?";
            }

            // Add Arthur's response
            setIsTyping(false); // STOP TYPING IMMEDIATELY
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                from: "arthur",
                text: responseText
            }]);

            // ALWAYS start polling after every response (runs in background)
            // Polling will check if N8N has posted agent data to webhook
            startPollingForAgentData();

        } catch (error) {
            console.error("[ArthurSection] Chat error:", error);
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                from: "arthur",
                text: "Maaf, terjadi kesalahan koneksi. Silakan coba lagi."
            }]);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    return (
        <section ref={sectionRef} id="arthur-section" className="relative w-full font-google-sans-flex -mt-50 sm:mt-0">
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
                            <div className="relative w-[60px] h-[60px] rounded-full overflow-hidden shadow-lg shrink-0">
                                <Image
                                    src="/arthurProfile.webp"
                                    alt="Arthur"
                                    fill
                                    sizes="60px"
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
                className="relative py-8 px-0 sm:px-8 md:px-12 lg:px-16"
                style={{
                    background: 'linear-gradient(to bottom, #C3D2F4 0%, #FFFAF2 100%)'
                }}
            >
                {/* Chat Messages Container - Full Height/Page Scroll */}
                <div
                    ref={chatContainerRef}
                    className="max-w-3xl mx-auto mb-4 space-y-4 px-6 sm:px-0 min-h-[300px]"
                >
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
                        >
                            <div
                                className={`max-w-[85%] sm:max-w-[80%] px-5 py-3.5 rounded-3xl shadow-md ${msg.from === "arthur"
                                    ? "bg-[#2563EB] text-white"
                                    : "bg-[#02457A] text-white"
                                    }`}
                            >
                                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
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

                    {/* Spacer */}
                    <div className="h-4" />
                </div>

                {/* Input Field - Normal Flow (Not Sticky) */}
                <div className="p-4 pb-8 -mx-1 sm:-mx-8 md:-mx-12 lg:-mx-16 z-30">
                    <div className="max-w-3xl mx-auto">
                        <div className="relative bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 pl-6 pr-14 py-4 transition-transform duration-200 focus-within:scale-[1.01]">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Ketik disini......."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isTyping || isProcessingFinal}
                                className="w-full bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 text-base disabled:opacity-50"
                                style={{ fontSize: '16px' }} // Prevent iOS zoom
                            />
                            {/* Button INSIDE input */}
                            <button
                                onClick={handleSendMessage}
                                disabled={!message.trim() || isTyping || isProcessingFinal}
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-[#2563EB] rounded-full flex items-center justify-center hover:bg-[#1d4ed8] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                                aria-label="Send Message"
                            >
                                <div className="h-5 w-5 relative">
                                    <Image
                                        src="/starIcon.png"
                                        alt="Send"
                                        fill
                                        sizes="20px"
                                        className="object-contain"
                                    />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
