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

// Pool of suggestion prompts
const SUGGESTION_POOL = [
    "Buatkan agent customer service untuk travel umroh",
    "Buatkan personal assistant untuk jadwal meeting",
    "Buatkan agent sales untuk jualan properti",
    "Buatkan agent support untuk toko online",
    "Buatkan agent untuk FAQ produk skincare",
    "Buatkan assistant untuk booking restaurant",
    "Buatkan agent konsultasi kesehatan dasar",
    "Buatkan agent untuk follow up leads",
    "Buatkan assistant untuk reminder tagihan",
    "Buatkan agent untuk handling komplain pelanggan",
];

export default function ArthurSection() {
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, from: "arthur", text: "Halo! Saya Arthur, AI Creator yang siap membantu Anda." }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [isProcessingFinal, setIsProcessingFinal] = useState(false);
    const [showLongWaitMessage, setShowLongWaitMessage] = useState(false);
    const [showInfoInsteadOfDots, setShowInfoInsteadOfDots] = useState(false);

    // Random suggestions (picked on mount)
    const [suggestions, setSuggestions] = useState<string[]>([]);

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
    const longWaitTimerRef = useRef<NodeJS.Timeout | null>(null);
    const toggleIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

    // Pick 3 random suggestions on mount
    useEffect(() => {
        const shuffled = [...SUGGESTION_POOL].sort(() => Math.random() - 0.5);
        setSuggestions(shuffled.slice(0, 3));
    }, []);

    // Initialize session and credentials on mount (Check Storage First)
    useEffect(() => {
        // Session restoration logic REMOVED as per request.
        // Always generate new session on reload.

        // try {
        //     const storedSession = sessionStorage.getItem("arthur_session_data");
        //     if (storedSession) { ... }
        // } catch (e) { ... }

        // Generate random credentials
        const randomString = Math.random().toString(36).substring(2, 10);
        const generatedEmail = `${randomString}@clevio.staff`;
        const generatedPassword = `${randomString}1`;

        // Generate random session ID
        const generatedSessionId = `arthur-session-${Math.random().toString(36).substring(2, 9)}`;

        const newSessionData = {
            sessionId: generatedSessionId,
            credentials: {
                email: generatedEmail,
                password: generatedPassword
            }
        };

        setCredentials(newSessionData.credentials);
        setSessionId(newSessionData.sessionId);

        // Save to sessionStorage
        sessionStorage.setItem("arthur_session_data", JSON.stringify(newSessionData));
        persistLog("🆕 Created new session", generatedSessionId);
    }, []);




    // Long wait timer: show alternating message after 10 seconds of typing
    useEffect(() => {
        if (isTyping) {
            // Start timer when typing begins - after 10s, start alternating
            longWaitTimerRef.current = setTimeout(() => {
                setShowLongWaitMessage(true);
                // Start alternating between dots and info every 3 seconds
                toggleIntervalRef.current = setInterval(() => {
                    setShowInfoInsteadOfDots(prev => !prev);
                }, 3000);
            }, 10000); // 10 seconds
        } else {
            // Reset everything when typing completes
            if (longWaitTimerRef.current) {
                clearTimeout(longWaitTimerRef.current);
                longWaitTimerRef.current = null;
            }
            if (toggleIntervalRef.current) {
                clearInterval(toggleIntervalRef.current);
                toggleIntervalRef.current = null;
            }
            setShowLongWaitMessage(false);
            setShowInfoInsteadOfDots(false);
        }

        return () => {
            if (longWaitTimerRef.current) {
                clearTimeout(longWaitTimerRef.current);
            }
            if (toggleIntervalRef.current) {
                clearInterval(toggleIntervalRef.current);
            }
        };
    }, [isTyping]);

    // Cleanup polling on unmount
    useEffect(() => {
        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, []);

    // Helper function to persist logs to localStorage (survives page reload)
    const persistLog = (message: string, data?: any) => {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${message}${data ? ': ' + JSON.stringify(data) : ''}`;
        console.log(logEntry);
        try {
            const existingLogs = localStorage.getItem('arthur_debug_logs') || '';
            localStorage.setItem('arthur_debug_logs', existingLogs + '\n' + logEntry);
        } catch (e) { /* ignore storage errors */ }
    };

    // Start polling for agent data from webhook
    const startPollingForAgentData = () => {
        if (pollingIntervalRef.current) {
            persistLog("Polling already running, skipping");
            return; // Already polling
        }

        // Clear previous logs for new session - REMOVED to keep history
        // localStorage.removeItem('arthur_debug_logs');
        persistLog("🚀 Starting polling for session", sessionId);

        let pollCount = 0;
        const maxPolls = 480; // 480 * 2s = 16 minutes max

        pollingIntervalRef.current = setInterval(async () => {
            pollCount++;
            // Only log every 5th poll to avoid spam
            if (pollCount % 5 === 1 || pollCount <= 3) {
                persistLog(`🔍 Poll #${pollCount} for session`, sessionId);
            }

            if (pollCount > maxPolls) {
                // Timeout - stop polling
                persistLog("⏰ Polling timeout reached, stopping");
                if (pollingIntervalRef.current) {
                    clearInterval(pollingIntervalRef.current);
                    pollingIntervalRef.current = null;
                }
                setIsTyping(false);
                return;
            }

            try {
                // Add timestamp to prevent browser caching of 404 responses
                const res = await fetch(`/api/webhooks/arthur/agent-created?session_id=${sessionId}&t=${Date.now()}`);

                if (res.ok) {
                    const agentData = await res.json();

                    if (agentData && agentData.name) {
                        persistLog("✅ Agent data found!", agentData.name);
                        // Stop polling
                        if (pollingIntervalRef.current) {
                            clearInterval(pollingIntervalRef.current);
                            pollingIntervalRef.current = null;
                        }

                        // Save to localStorage
                        localStorage.setItem('agent_payload', JSON.stringify(agentData));
                        persistLog("💾 Saved agent_payload to localStorage");

                        setIsTyping(false);
                        setIsProcessingFinal(true);
                        persistLog("🎬 Calling handleFinalRegistration");

                        // Proceed to registration and agent creation
                        await handleFinalRegistration(agentData);
                    }
                }
            } catch (err) {
                persistLog("❌ Polling error", String(err));
            }
        }, 2000); // Poll every 2 seconds
    };

    // Auto-restart polling when sessionId changes/restores
    useEffect(() => {
        // Cleanup old polling to prevent stale session usage
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
            persistLog("♻️ Session changed/restored, restarting polling logic");
        }

        // Only auto-start if we have a session but NO agent data yet
        if (sessionId && !localStorage.getItem('agent_payload')) {
            startPollingForAgentData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId]);

    const handleFinalRegistration = async (agentData: any) => {
        persistLog("🎯 handleFinalRegistration started", agentData?.name);
        try {
            // NEW FLOW: N8N sends access_token INSIDE the agent-created payload!
            // No need to poll payment/status separately.
            persistLog("🔍 Checking for Access Token in agent payload...");

            let accessToken = agentData?.access_token;

            if (!accessToken) {
                // Fallback: Maybe token is nested differently?
                accessToken = agentData?.token || agentData?.accessToken;
            }

            persistLog("🔑 Access Token", accessToken ? "✅ Found in payload!" : "❌ Not found in payload");

            if (!accessToken) {
                persistLog("❌ No access_token in agent payload from N8N");
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    from: "arthur",
                    text: "Maaf, terjadi kesalahan sistem (token missing). Mohon coba lagi."
                }]);
                setIsProcessingFinal(false);
                return;
            }

            const tokenToUse = accessToken;

            // Save to localStorage (for API calls)
            // Store as access_token (primary for CRUD)
            localStorage.setItem('access_token', accessToken);
            // Store as jwt_token (for login session compatibility)
            localStorage.setItem('jwt_token', accessToken);

            // Save to cookie (for middleware protection)
            document.cookie = `session_token=${accessToken}; path=/; max-age=604800; SameSite=Lax`;

            persistLog("🔑 Token saved to localStorage and cookie");

            // Step 3: Create agent using Proxy (to avoid CORS)
            try {
                // Sanitize payload to match Dashboard implementation and avoid "Invalid tools" error
                // N8N might receive specific tools in 'tools' field which backend rejects if they are MCP tools
                const validMcpTools = ['web_search', 'deep_research']; // Add known legitimate MCP tools

                // Extract and clean tools
                let mcpTools = agentData.mcp_tools || [];

                // If N8N put MCP tools in 'tools' (legacy), move them to mcp_tools
                if (Array.isArray(agentData.tools)) {
                    const legacyTools = agentData.tools.filter((t: string) => validMcpTools.includes(t));
                    mcpTools = [...new Set([...mcpTools, ...legacyTools])]; // Merge unique
                }

                const cleanPayload = {
                    name: agentData.name,

                    // Top Level Fields
                    google_tools: agentData.google_tools || [],
                    mcp_tools: mcpTools,

                    config: {
                        system_prompt: agentData.system_prompt || agentData.config?.system_prompt,
                        llm_model: agentData.llm_model || agentData.config?.llm_model || 'gpt-4o-mini',
                        temperature: agentData.config?.temperature ?? 0.1,
                    },

                    mcp_servers: agentData.mcp_servers || {
                        "calculator_sse": {
                            "transport": "sse",
                            "url": "http://194.238.23.242:8190/sse"
                        }
                    },

                    // Pass through specific fields only
                    token_limit: agentData.token_limit,
                    plan_code: agentData.plan_code
                };

                persistLog("🤖 Step 3: Creating agent via Proxy", JSON.stringify(cleanPayload, null, 2));

                const createAgentResponse = await fetch('/api/agents/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        payload: cleanPayload,
                        token: tokenToUse
                    })
                });

                persistLog("🤖 Agent create status", createAgentResponse.status);

                if (!createAgentResponse.ok) {
                    const errorData = await createAgentResponse.json().catch(() => ({}));
                    persistLog("❌ Failed to create agent", errorData);
                    throw new Error("Failed to create agent via proxy");
                }

                persistLog("✅ Agent created successfully!");

            } catch (agentError) {
                persistLog("❌ Agent creation error", String(agentError));
                // Still redirect even if agent creation fails
            }
            // Step 4: Redirect to dashboard

            // Step 4: Redirect to dashboard
            persistLog("🚀 Step 4: Calling router.push('/dashboard')");
            router.push('/dashboard');
            persistLog("✅ router.push called - should redirect now!");

        } catch (error) {
            persistLog("❌ Registration error", String(error));
            // Still try to redirect
            persistLog("🚀 Redirecting despite error");
            router.push('/dashboard');
        }
    };

    const handleSendMessage = async (overrideText?: string) => {
        const textToSend = overrideText || message;
        if (!textToSend.trim() || isTyping || isProcessingFinal) return;

        // Add user message
        const userMsg: Message = { id: Date.now(), from: "user", text: textToSend };
        setMessages(prev => [...prev, userMsg]);
        setMessage("");
        setIsTyping(true);

        // Always start polling immediately in background (resilience)
        startPollingForAgentData();

        // Setup timeout for chat request (25 seconds) to prevent browser hang/reload issues
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000);

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
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId); // Clear timeout if successful

            const data = await response.json();
            console.log("[ArthurSection] Chat response:", data);

            // Extract response text from various N8N response formats
            let responseText = "";

            if (Array.isArray(data) && data.length > 0 && data[0].system_prompt) {
                // Direct agent data response - process immediately
                console.log("[ArthurSection] Direct agent data received");
                localStorage.setItem('agent_payload', JSON.stringify(data[0]));

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

        } catch (error: any) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                console.log("[ArthurSection] Chat request timed out (expected), continuing polling...");
                // Don't show error to user, just let polling handle it. 
                // Keep typing indicator on? No, maybe show "Processing..." logic?
                // Or just let typing indicator run until polling succeeds?
                // Let's keep typing indicator ON, because N8N is still working.
                // We trust polling to finish the job.
            } else {
                console.error("[ArthurSection] Chat error:", error);
                setIsTyping(false);
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    from: "arthur",
                    text: "Maaf, terjadi kesalahan koneksi. Namun saya tetap memproses permintaan Anda di background."
                }]);
            }
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevent accidental form submission
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

            {/* Chat Section - Cream Background, Gradient only on chat container */}
            <div
                className="relative py-8 px-0 sm:px-8 md:px-12 lg:px-16"
                style={{
                    background: '#FFFAF2'
                }}
            >
                {/* Chat Messages Container - Gradient applied here */}
                <div
                    ref={chatContainerRef}
                    className="max-w-4xl mx-auto mb-4 space-y-4 px-6 sm:px-8 min-h-[300px] rounded-3xl pt-8 -mt-5"
                    style={{
                        background: 'linear-gradient(to bottom, #C3D2F4 0%, #FFFAF2 100%)'
                    }}
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

                    {/* Typing Indicator with Long Wait Logic */}
                    {isTyping && (
                        <div className="flex justify-start animate-fade-in">
                            <div className="bg-[#2563EB] text-white px-5 py-3.5 rounded-3xl shadow-md min-h-[48px] flex items-center">
                                {(!showLongWaitMessage || !showInfoInsteadOfDots) ? (
                                    <div className="flex gap-1.5">
                                        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                ) : (
                                    <span className="text-sm animate-fade-in italic">⏳ Mohon menunggu sekitar 1-2 menit...</span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Creation Animation - Replaces Text Message */}
                    {isProcessingFinal && (
                        <div className="flex justify-center py-6 animate-fade-in-up">
                            <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-2xl px-8 py-6 shadow-lg flex flex-col items-center gap-4">
                                <div className="relative w-12 h-12">
                                    <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                                </div>
                                <div className="text-center">
                                    <h3 className="font-bold text-blue-600 text-lg">Creating Agent...</h3>
                                    <p className="text-xs text-gray-500 mt-1">Setup personality & tools</p>
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
                            {/* Button INSIDE input - Explicitly type="button" to prevent form submit */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleSendMessage();
                                }}
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

                        {/* Suggestion Chips - Only show when chat is empty */}
                        {messages.length === 1 && !isTyping && !isProcessingFinal && (
                            <div className="flex flex-wrap justify-center gap-2 mt-4">
                                {suggestions.map((suggestion, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => handleSendMessage(suggestion)}
                                        className="px-4 py-2 bg-white/80 hover:bg-white border border-blue-200 rounded-full text-sm text-gray-700 hover:text-blue-600 transition-all shadow-sm hover:shadow-md cursor-pointer"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
