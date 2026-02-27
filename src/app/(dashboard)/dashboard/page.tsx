"use client";

import React, { useState } from "react";
import ArthurPhone from "@/components/features/dashboard/ArthurPhone";
import SimulatorPhone from "@/components/features/dashboard/SimulatorPhone";
import PreviewPhone from "@/components/features/dashboard/PreviewPhone";
import AgentWorkArea from "@/components/features/dashboard/AgentDetail";
import AgentEmptyState from "@/components/features/dashboard/AgentEmptyState";
import { useToast } from "@/components/ui/ToastProvider";
import { cn } from "@/lib/utils";

import { agentService, Agent } from "@/services/agentService";



export default function DashboardPage() {
    const [hasAgent, setHasAgent] = useState(false);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isArthurActive, setIsArthurActive] = useState(false);


    // Agent version to trigger simulator session reset on updates
    const [agentVersion, setAgentVersion] = useState(0);
    // Focus interaction state
    const [activeSection, setActiveSection] = useState<'setting' | 'coba'>('setting');
    
    // NEW STATE: 3D Flip state for Setting column
    const [isManualMode, setIsManualMode] = useState(false);

    const { showToast } = useToast();

    // Fetch Agents on Mount (with retry for newly registered users)
    const fetchAgents = async (retryCount = 0) => {
        try {
            const fetchedAgents = await agentService.getAgents();
            setAgents(fetchedAgents);
            if (fetchedAgents.length > 0) {
                setHasAgent(true);
                // Only set selected if none selected - fetch full details
                if (!selectedAgent) {
                    // Check localStorage for persisted agent ID (restored after OAuth redirect)
                    const persistedAgentId = typeof window !== 'undefined'
                        ? localStorage.getItem('selected_agent_id')
                        : null;

                    const targetAgentId = persistedAgentId && fetchedAgents.find(a => a.id === persistedAgentId)
                        ? persistedAgentId
                        : fetchedAgents[0].id;

                    const fullAgentData = await agentService.getAgent(targetAgentId);
                    setSelectedAgent(fullAgentData);
                }
            } else {
                setHasAgent(false);
                setIsManualMode(false); // Reset to auto mode if no agent
            }
        } catch (error: any) {
            console.error(`Failed to fetch agents (attempt ${retryCount + 1})`, error);

            // Retry once after 2s for newly registered users whose backend data may not be ready
            if (retryCount < 2) {
                console.log(`Retrying fetchAgents in 2s... (attempt ${retryCount + 2})`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                return fetchAgents(retryCount + 1);
            }

            // Only show error toast on final failure, and only for non-401 errors
            const status = error.response?.status;
            if (status !== 401 && status !== 403) {
                showToast("Gagal memuat data agen.", "error");
            }
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchAgents();
    }, []);

    const handleAgentCreated = async (rawAgentData: any) => {

        try {
            console.log('[Dashboard] rawAgentData:', JSON.stringify(rawAgentData, null, 2));

            // CRITICAL: If N8N sent tokens in webhook, store them for future use
            // This happens when user passes through Arthur / N8N
            if (rawAgentData.access_token || rawAgentData.jwt_token) {
                // Handle swapped keys from N8N webhook
                let realApiToken = rawAgentData.access_token;
                let realUserToken = rawAgentData.jwt_token;

                try {
                    const parseJwt = (token: string) => JSON.parse(atob(token.split('.')[1]));
                    const token1Payload = rawAgentData.jwt_token ? parseJwt(rawAgentData.jwt_token) : null;
                    const token2Payload = rawAgentData.access_token ? parseJwt(rawAgentData.access_token) : null;
                    
                    if (token1Payload?.type === 'agent' || token2Payload?.type === 'user') {
                        realApiToken = rawAgentData.jwt_token; // Agent API Key
                        realUserToken = rawAgentData.access_token; // User JWT
                    }
                } catch (e) {
                    console.warn("[Dashboard] Failed to decode raw tokens, falling back to raw keys.");
                }

                // Store as access_token (primary for CRUD)
                if (realApiToken) {
                    localStorage.setItem('access_token', realApiToken);
                    // api_token cookie untuk SSR proxy (Google Workspace dll)
                    document.cookie = `api_token=${realApiToken}; path=/; max-age=604800; SameSite=Lax`;
                }
                
                // JWT User Token untuk profil auth
                if (realUserToken) {
                    localStorage.setItem('jwt_token', realUserToken);
                    document.cookie = `session_token=${realUserToken}; path=/; max-age=604800; SameSite=Lax`;
                } else if (realApiToken) {
                    // Fallback to access_token if no jwt_token
                    document.cookie = `session_token=${realApiToken}; path=/; max-age=604800; SameSite=Lax`;
                }
            }

            // ====================================================================
            // BRANCH A: N8N MCP already created the agent on the backend.
            // The payload has _responseType but NO name/system_prompt.
            // We just need to refresh the agent list from the API.
            // ====================================================================
            if (rawAgentData._responseType === 'agent_created') {
                console.log('[Dashboard] Agent already created by N8N MCP. Refreshing agent list...');
                showToast("Agent berhasil dibuat! Merefresh dashboard...", "success");

                // Small delay to allow backend to finalize
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Refresh the full agent list from the backend
                const fetchedAgents = await agentService.getAgents();
                
                // === SORT AGENTS BY CREATED AT DESCENDING (Newest First) ===
                fetchedAgents.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                
                if (fetchedAgents.length > 0) {
                    const newestAgent = fetchedAgents[0];
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('selected_agent_id', newestAgent.id);
                        window.location.reload(); // FORCE FULL RELOAD TO SATISFY "REFRESH DASHBOARD" REQUIREMENT
                    }
                }
                return;
            }

            // ====================================================================
            // BRANCH B: Legacy flow — rawAgentData contains name, system_prompt
            // We need to POST it to /api/agents/create ourselves.
            // ====================================================================
            showToast("Sedang membuat agent...", "info");

            const token = localStorage.getItem('access_token') || localStorage.getItem('jwt_token');

            if (!token) {
                console.error('[Dashboard] No access_token or jwt_token found!');
                showToast("Error: Token autentikasi tidak ditemukan. Silakan login ulang.", "error");
                return;
            }

            const agentPayload = {
                name: rawAgentData.name,

                // Top Level Fields
                google_tools: rawAgentData.google_tools || [],
                mcp_tools: rawAgentData.mcp_tools || [],

                config: {
                    system_prompt: rawAgentData.system_prompt || rawAgentData.config?.system_prompt,
                    llm_model: rawAgentData.llm_model || rawAgentData.config?.llm_model || 'gpt-4o-mini',
                    temperature: rawAgentData.config?.temperature ?? 0.1,
                },

                mcp_servers: rawAgentData.mcp_servers || {
                    "calculator_sse": {
                        "transport": "sse",
                        "url": "http://194.238.23.242:8190/sse"
                    }
                },

                // Pass through additional fields if present (for backend validation/limits)
                token_limit: rawAgentData.token_limit,
                plan_code: rawAgentData.plan_code,
            };

            console.log('[Dashboard] agentPayload to send:', JSON.stringify(agentPayload, null, 2));
            console.log('[Dashboard] Using token:', token.substring(0, 20) + '...');

            // Use proxy route (same as landing page) to avoid CORS and for consistent auth
            const createResponse = await fetch('/api/agents/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    payload: agentPayload,
                    token: token
                })
            });

            if (!createResponse.ok) {
                const errorData = await createResponse.json().catch(() => ({}));
                const errorMsg = errorData.error || errorData.detail || `Status ${createResponse.status}`;
                console.error(`[Dashboard] Agent creation failed (${createResponse.status}):`, errorData);
                showToast(`Gagal membuat agent: ${errorMsg} (${createResponse.status})`, "error");
                return;
            }

            const newAgent = await createResponse.json();
            console.log('[Dashboard] Agent created successfully:', newAgent.id);

            // Fetch full details (including auth_required)
            const fullAgentData = await agentService.getAgent(newAgent.id);

            // Refresh list and select new agent
            setAgents(prev => [fullAgentData, ...prev]);
            setSelectedAgent(fullAgentData);
            setHasAgent(true);
            setIsArthurActive(false); // Reset Arthur flow

            showToast("Agent berhasil dibuat!", "success");
        } catch (error: any) {
            const errMsg = error.response?.data?.detail || error.response?.data?.error || error.message || 'Unknown error';
            const status = error.response?.status || '';
            console.error(`[Dashboard] Failed to create agent:`, error);
            showToast(`Gagal membuat agent: ${errMsg} ${status ? `(${status})` : ''}`, "error");
        }
    };

    // Handle agent selection with full data fetch
    const handleSelectAgent = async (agent: Agent) => {
        try {
            // Fetch full agent details including auth_required
            const fullAgentData = await agentService.getAgent(agent.id);
            setSelectedAgent(fullAgentData);
            // Persist to localStorage for OAuth redirect restore
            if (typeof window !== 'undefined') {
                localStorage.setItem('selected_agent_id', agent.id);
            }
        } catch (error) {
            console.error("Failed to fetch agent details", error);
            // Fallback to basic agent data
            setSelectedAgent(agent);
        }
    };

    const refreshAgents = async () => {
        try {
            const fetched = await agentService.getAgents();
            setAgents(fetched);
            if (selectedAgent) {
                // Fetch full details to get auth_required, etc.
                const fullAgentData = await agentService.getAgent(selectedAgent.id);
                setSelectedAgent(fullAgentData);
                // Increment version to trigger simulator session reset
                setAgentVersion(prev => prev + 1);
            }
        } catch (error) {
            console.error("Failed to refresh agents", error);
        }
    };

    // Update messages_remaining in selectedAgent (called after chat)
    const handleMessagesRemainingUpdate = (remaining: number) => {
        if (selectedAgent) {
            setSelectedAgent(prev => prev ? { ...prev, messages_remaining: remaining } : null);
        }
    };

    if (isLoading) {
        return null; // Or a loading spinner
    }

    return (
        <div className="w-full h-full flex flex-col overflow-hidden bg-[linear-gradient(135deg,#f5f7fa_0%,#e4ecf7_100%)]">
            {/* MOBILE TAB BAR - Fixed at top, only visible < lg */}
            <div className="lg:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/50 px-4 py-3 flex gap-3 justify-center shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)]">
                <button
                    onClick={() => setActiveSection('setting')}
                    className={cn(
                        "px-8 py-2.5 rounded-full font-bold text-sm transition-all duration-300 select-none",
                        activeSection === 'setting' 
                            ? "bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] text-white shadow-[0_8px_16px_-6px_rgba(37,99,235,0.5)] scale-105" 
                            : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-100"
                    )}
                >
                    Setting
                </button>
                <button
                    onClick={() => setActiveSection('coba')}
                    className={cn(
                        "px-8 py-2.5 rounded-full font-bold text-sm transition-all duration-300 select-none",
                        activeSection === 'coba' 
                            ? "bg-gradient-to-br from-[#41CD5D] to-[#36bf50] text-white shadow-[0_8px_16px_-6px_rgba(65,205,93,0.5)] scale-105" 
                            : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-100"
                    )}
                >
                    Coba
                </button>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 overflow-hidden px-4 pb-4 lg:px-10 lg:pb-10 lg:pt-6">
                {/* 50:50 DESKTOP GRID */}
                <div className="hidden lg:grid lg:grid-cols-2 gap-8 xl:gap-14 h-full max-w-[1600px] mx-auto">
                    
                    {/* COLUMN 1: Setting (3D Flip Container) */}
                    <div className="relative w-full h-full [perspective:2500px] flex flex-col">
                        
                        {/* Tab Indicator - Absolute centered above card */}
                        <div className="flex justify-center mb-6 z-20 pointer-events-none drop-shadow-sm">
                            <div className="px-10 py-2.5 rounded-full font-bold shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)] bg-[#2563EB] text-white tracking-wide">
                                Setting
                            </div>
                        </div>

                        {/* 3D Flip Environment */}
                        <div className={cn(
                            "relative w-full flex-1 transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] [transform-style:preserve-3d]",
                            isManualMode ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"
                        )}>
                            
                            {/* FRONT FACE: Mode Otomatis (ArthurPhone) */}
                            <div className={cn(
                                "absolute inset-0 [backface-visibility:hidden]",
                                isManualMode ? "pointer-events-none" : ""
                            )}>
                                <ArthurPhone
                                    isActive={isArthurActive}
                                    onAgentCreated={handleAgentCreated}
                                    onAgentUpdated={refreshAgents}
                                    hasAgent={hasAgent}
                                    selectedAgent={selectedAgent}
                                    isFocused={true}
                                    isManualMode={isManualMode}
                                    onToggleMode={() => setIsManualMode(true)}
                                />
                            </div>

                            {/* BACK FACE: Mode Manual (AgentWorkArea) */}
                            <div className={cn(
                                "absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]",
                                !isManualMode ? "pointer-events-none" : ""
                            )}>
                                <div className="h-full rounded-[30px] bg-gradient-to-b from-[#FDFDFE] to-[#F3F6FD] shadow-[0_20px_60px_-15px_rgba(37,99,235,0.25)] border-[3px] border-white/80 flex flex-col overflow-hidden relative group">
                                    
                                    {/* Manual Mode Header Bar - Matches ArthurPhone's style */}
                                    <div className="w-full h-14 bg-gradient-to-r from-[#4285F4] to-[#2563EB] flex items-center justify-between px-8 shrink-0 relative z-10 shadow-md border-b-[2px] border-[#6ea0f7]/40">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-200 animate-pulse"></div>
                                            <span className="text-white font-bold tracking-wider text-[11px] md:text-xs uppercase">Mode Manual</span>
                                        </div>
                                        <button 
                                            onClick={() => setIsManualMode(false)}
                                            className="h-8 px-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center gap-2 transition-all duration-300 outline-none border border-white/20 text-white cursor-pointer hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                                        >
                                            <span className="text-[10px] md:text-[11px] font-bold tracking-widest hidden sm:block">MODE OTOMATIS</span>
                                            <svg className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:-rotate-180 transition-transform duration-700 ease-in-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                        </button>
                                    </div>
                                    
                                    <div className="flex-1 overflow-hidden relative bg-transparent scrollbar-apple">
                                        {!hasAgent ? (
                                            <AgentEmptyState onCreateClick={() => { setIsManualMode(false); setIsArthurActive(true); }} />
                                        ) : (
                                            <div className="h-full p-2">
                                                <AgentWorkArea
                                                    agents={agents}
                                                    selectedAgent={selectedAgent}
                                                    onSelectAgent={handleSelectAgent}
                                                    onAgentUpdate={refreshAgents}
                                                    isFocused={true}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>

                    {/* COLUMN 2: Coba (SimulatorPhone/PreviewPhone) */}
                    <div className="h-full flex flex-col transition-all duration-300">
                        
                        {/* Tab Indicator */}
                        <div className="flex justify-center mb-6 pt-0 drop-shadow-sm">
                            <div className="px-10 py-2.5 rounded-full font-bold shadow-[0_8px_20px_-6px_rgba(65,205,93,0.4)] bg-[#41CD5D] text-white tracking-wide">
                                Coba
                            </div>
                        </div>

                        {!hasAgent ? (
                            <PreviewPhone />
                        ) : (
                            <div className="flex-1 w-full relative">
                                <SimulatorPhone
                                    selectedAgent={selectedAgent}
                                    onMessagesRemainingUpdate={handleMessagesRemainingUpdate}
                                    agentVersion={agentVersion}
                                    isFocused={true}
                                />
                            </div>
                        )}
                    </div>

                </div>

                {/* MOBILE VIEW (Only visible < lg) */}
                <div className="lg:hidden h-full overflow-y-auto pt-4 relative scrollbar-apple pb-8 flex flex-col">
                    
                    {/* Setting Section (Still has 3D Flip on Mobile) */}
                    {activeSection === 'setting' && (
                        <div className="w-full h-full flex-1 flex flex-col [perspective:2000px] relative min-h-[550px]">
                            <div className={cn(
                                "relative w-full h-full transition-all duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] [transform-style:preserve-3d]",
                                isManualMode ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"
                            )}>
                                
                                <div className={cn(
                                    "absolute inset-0 [backface-visibility:hidden]",
                                    isManualMode ? "pointer-events-none" : ""
                                )}>
                                    <ArthurPhone
                                        isActive={isArthurActive}
                                        onAgentCreated={handleAgentCreated}
                                        onAgentUpdated={refreshAgents}
                                        hasAgent={hasAgent}
                                        selectedAgent={selectedAgent}
                                        isFocused={false}
                                        isManualMode={isManualMode}
                                        onToggleMode={() => setIsManualMode(true)}
                                    />
                                </div>

                                <div className={cn(
                                    "absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]",
                                    !isManualMode ? "pointer-events-none" : ""
                                )}>
                                    <div className="h-full rounded-[30px] bg-gradient-to-b from-[#FDFDFE] to-[#F3F6FD] shadow-[0_12px_40px_-10px_rgba(37,99,235,0.25)] border-[2px] border-white/80 flex flex-col overflow-hidden relative">
                                        <div className="w-full h-12 bg-gradient-to-r from-[#4285F4] to-[#2563EB] flex items-center justify-between px-5 shrink-0 relative z-10 shadow-sm border-b border-blue-400">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-200 animate-pulse"></div>
                                                <span className="text-white font-bold tracking-wide text-[10px] uppercase">Mode Manual</span>
                                            </div>
                                            <button 
                                                onClick={() => setIsManualMode(false)}
                                                className="h-7 px-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center gap-1.5 transition-all outline-none border border-white/20 text-white cursor-pointer active:scale-95 group"
                                            >
                                                <span className="text-[9px] font-bold tracking-wider">MODE OTOMATIS</span>
                                                <svg className="w-3 h-3 group-hover:-rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="flex-1 overflow-hidden relative p-1 pb-4">
                                            {!hasAgent ? (
                                                <AgentEmptyState onCreateClick={() => { setIsManualMode(false); setIsArthurActive(true); }} />
                                            ) : (
                                                <AgentWorkArea
                                                    agents={agents}
                                                    selectedAgent={selectedAgent}
                                                    onSelectAgent={handleSelectAgent}
                                                    onAgentUpdate={refreshAgents}
                                                    isFocused={false}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* Coba Section */}
                    {activeSection === 'coba' && (
                        <div className="h-full flex-1 min-h-[550px] flex flex-col relative w-full pt-1">
                            {!hasAgent ? (
                                <PreviewPhone />
                            ) : (
                                <SimulatorPhone
                                    selectedAgent={selectedAgent}
                                    onMessagesRemainingUpdate={handleMessagesRemainingUpdate}
                                    agentVersion={agentVersion}
                                    isFocused={false}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
