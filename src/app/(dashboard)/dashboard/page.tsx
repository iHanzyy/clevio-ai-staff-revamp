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
    const [activeSection, setActiveSection] = useState<'arthur' | 'work_area' | 'simulator'>('simulator');

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
        // Show loading state or toast
        showToast("Sedang membuat agent...", "info");

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

            // api.ts now automatically uses access_token if available, falling back to jwt_token
            // We just need to ensure one exists to pass to the proxy
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
        <div className="w-full h-full flex flex-col overflow-hidden">
            {/* MOBILE TAB BAR - Fixed at top, only visible < lg */}
            <div className="lg:hidden sticky top-0 z-50 bg-linear-to-b from-[#C3D2F4] to-[#C3D2F4]/90 px-4 py-3 flex gap-2 justify-center">
                <button
                    onClick={() => setActiveSection('arthur')}
                    className={cn(
                        "px-6 py-2 rounded-full font-medium text-sm transition-all duration-200 select-none",
                        activeSection === 'arthur' ? "bg-[#2563EB] text-white shadow-md" : "bg-[#E0E0E0] text-gray-500"
                    )}
                >
                    Arthur
                </button>
                <button
                    onClick={() => setActiveSection('work_area')}
                    className={cn(
                        "px-6 py-2 rounded-full font-medium text-sm transition-all duration-200 select-none",
                        activeSection === 'work_area' ? "bg-[#2563EB] text-white shadow-md" : "bg-[#E0E0E0] text-gray-500"
                    )}
                >
                    Pengaturan Lanjutan
                </button>
                <button
                    onClick={() => setActiveSection('simulator')}
                    className={cn(
                        "px-6 py-2 rounded-full font-medium text-sm transition-all duration-200 select-none",
                        activeSection === 'simulator' ? "bg-[#41CD5D] text-white shadow-md" : "bg-[#E0E0E0] text-gray-500"
                    )}
                >
                    Coba
                </button>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 overflow-hidden px-4 pb-4 lg:px-10 lg:pb-10 lg:pt-5">
                {/* DESKTOP GRID - Only visible >= lg */}
                <div className="hidden lg:grid lg:grid-cols-12 gap-6 h-full">

                    {/* COLUMN 1: Arthur (Bot Creator) - 3 Columns width */}
                    <div
                        className={cn(
                            "lg:col-span-3 h-full flex flex-col min-h-0 transition-all duration-300 cursor-pointer",
                            activeSection !== 'arthur' && hasAgent && "opacity-75"
                        )}
                        onClick={() => hasAgent && setActiveSection('arthur')}
                    >
                        {/* Header: Arthur */}
                        <div className="flex justify-center mb-4">
                            <div className={cn(
                                "px-8 py-2 rounded-full font-medium shadow-md cursor-pointer hover:opacity-90 transition-all duration-300 select-none",
                                activeSection === 'arthur' && hasAgent ? "bg-[#2563EB] text-white" : "bg-[#E0E0E0] text-gray-700"
                            )}>
                                Arthur
                            </div>
                        </div>
                        <ArthurPhone
                            isActive={isArthurActive}
                            onAgentCreated={handleAgentCreated}
                            onAgentUpdated={refreshAgents}
                            hasAgent={hasAgent}
                            selectedAgent={selectedAgent}
                            isFocused={activeSection === 'arthur' && hasAgent}
                        />
                    </div>

                    {/* COLUMN 2: Work Area - 6 Columns width */}
                    <div
                        className={cn(
                            "lg:col-span-6 h-full flex flex-col min-h-0 relative transition-all duration-300 cursor-pointer",
                            activeSection !== 'work_area' && hasAgent && "opacity-75"
                        )}
                        onClick={() => hasAgent && setActiveSection('work_area')}
                    >
                        {/* Header: Pengaturan Lanjutan */}
                        <div className="flex justify-center mb-4">
                            <div className={cn(
                                "px-8 py-2 rounded-full font-medium shadow-sm cursor-pointer hover:opacity-90 transition-all duration-300 select-none",
                                activeSection === 'work_area' && hasAgent ? "bg-[#2563EB] text-white" : "bg-[#E0E0E0] text-gray-700"
                            )}>
                                Pengaturan Lanjutan
                            </div>
                        </div>

                        {!hasAgent ? (
                            <AgentEmptyState onCreateClick={() => setIsArthurActive(true)} />
                        ) : (
                            <AgentWorkArea
                                agents={agents}
                                selectedAgent={selectedAgent}
                                onSelectAgent={handleSelectAgent}
                                onAgentUpdate={refreshAgents}
                                isFocused={activeSection === 'work_area'}
                            />
                        )}
                    </div>

                    {/* COLUMN 3: Simulator/Preview - 3 Columns width */}
                    <div
                        className={cn(
                            "lg:col-span-3 h-full flex flex-col min-h-0 transition-all duration-300 cursor-pointer",
                            activeSection !== 'simulator' && hasAgent && "opacity-75"
                        )}
                        onClick={() => hasAgent && setActiveSection('simulator')}
                    >
                        {/* Header: Coba */}
                        <div className="flex justify-center mb-4">
                            <div className={cn(
                                "px-8 py-2 rounded-full font-medium shadow-sm cursor-pointer hover:opacity-90 transition-all duration-300 select-none",
                                activeSection === 'simulator' && hasAgent ? "bg-[#41CD5D] text-white" : "bg-[#E0E0E0] text-gray-700"
                            )}>
                                Coba
                            </div>
                        </div>
                        {!hasAgent ? (
                            <PreviewPhone />
                        ) : (
                            <SimulatorPhone
                                selectedAgent={selectedAgent}
                                onMessagesRemainingUpdate={handleMessagesRemainingUpdate}
                                agentVersion={agentVersion}
                                isFocused={activeSection === 'simulator'}
                            />
                        )}
                    </div>

                </div>

                {/* MOBILE SECTIONS - Only visible < lg, show only active section */}
                <div className="lg:hidden h-full overflow-y-auto">
                    {/* Arthur Section */}
                    {activeSection === 'arthur' && (
                        <div className="h-full flex flex-col">
                            <ArthurPhone
                                isActive={isArthurActive}
                                onAgentCreated={handleAgentCreated}
                                onAgentUpdated={refreshAgents}
                                hasAgent={hasAgent}
                                selectedAgent={selectedAgent}
                                isFocused={false}
                            />
                        </div>
                    )}

                    {/* Work Area Section */}
                    {activeSection === 'work_area' && (
                        <div className="h-full flex flex-col overflow-y-auto">
                            {!hasAgent ? (
                                <AgentEmptyState onCreateClick={() => setIsArthurActive(true)} />
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
                    )}

                    {/* Simulator Section */}
                    {activeSection === 'simulator' && (
                        <div className="h-full flex flex-col">
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
