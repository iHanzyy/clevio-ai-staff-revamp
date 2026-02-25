import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { whatsappService } from "@/services/whatsappService";
import { useToast } from "@/components/ui/ToastProvider";

interface WhatsAppModalProps {
    isOpen: boolean;
    onClose: () => void;
    agentId: string;
    agentName: string;
    onStatusChange?: () => void;
}

type ViewState = "CONFIRM" | "LOADING" | "SCAN_QR" | "CONNECTED" | "ERROR";

export default function WhatsAppModal({
    isOpen,
    onClose,
    agentId,
    agentName,
    onStatusChange
}: WhatsAppModalProps) {
    const [view, setView] = useState<ViewState>("CONFIRM");
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoadingAction, setIsLoadingAction] = useState(false);

    // Polling Ref
    const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const { showToast } = useToast();

    // Init & Reset
    useEffect(() => {
        if (isOpen) {
            checkInitialStatus();
        } else {
            // Cleanup on close
            stopPolling();
            setView("CONFIRM");
            setQrCode(null);
        }
    }, [isOpen, agentId]);

    // Cleanup on unmount
    useEffect(() => {
        return () => stopPolling();
    }, []);

    const stopPolling = () => {
        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
        }
    };

    const startPolling = () => {
        stopPolling();
        pollIntervalRef.current = setInterval(async () => {
            try {
                const res = await whatsappService.getSessionDetail(agentId);
                // Payload: { data: { session: { status: "connected" } } }
                const status = res?.data?.session?.status;

                if (status === "connected") {
                    setView("CONNECTED");
                    setIsConnected(true);
                    stopPolling();
                    onStatusChange?.();
                }
            } catch (error) {
                // Silent fail on polling
            }
        }, 3000);
    };

    const checkInitialStatus = async () => {
        try {
            setView("LOADING");
            const res = await whatsappService.getSessionDetail(agentId);
            const status = res?.data?.session?.status;

            if (status === "connected") {
                setView("CONNECTED");
                setIsConnected(true);
                onStatusChange?.();
            } else {
                setView("CONFIRM");
                setIsConnected(false);
            }
        } catch (error) {
            setView("CONFIRM"); // Default to confirm if checking status fails 404
        }
    };

    const handleConnect = async () => {
        setIsLoadingAction(true);
        try {
            const res = await whatsappService.createSession({ agentId, agentName });

            // Backend should return QR here or we poll for it?
            // Guide: "Create Session (get QR base64)"
            // Assuming res.data.qr or similar
            const qrRaw = res?.data?.qrCode || res?.data?.qrCodeBase64;

            if (qrRaw) {
                setQrCode(qrRaw);
                setView("SCAN_QR");
                startPolling();
            } else {
                // Maybe it returns "QR_READY" and we hit status? 
                // User guide implies create returns QR.
                setView("ERROR");
                showToast("Gagal mendapatkan QR Code", "error");
            }
        } catch (error) {
            console.error(error);
            showToast("Gagal membuat sesi WhatsApp", "error");
            setView("ERROR");
        } finally {
            setIsLoadingAction(false);
        }
    };

    const handleDisconnect = async () => {
        setIsLoadingAction(true);
        try {
            await whatsappService.deleteSession(agentId);
            showToast("Integrasi WhatsApp diputus", "info");
            onStatusChange?.();
            onClose();
        } catch (error) {
            showToast("Gagal memutus integrasi", "error");
        } finally {
            setIsLoadingAction(false);
        }
    };

    const handleReconnect = async () => {
        // Reconnect logic: Hit endpoints, maybe go back to QR?
        setIsLoadingAction(true);
        try {
            await whatsappService.reconnectSession(agentId);
            showToast("Mencoba menghubungkan ulang...", "info");
            // Check status again
            checkInitialStatus();
        } catch (error) {
            showToast("Gagal reconnect", "error");
        } finally {
            setIsLoadingAction(false);
        }
    };

    const handleCancelDuringQR = async () => {
        // "kalo user klik batal maka hit endpoint delete session"
        setIsLoadingAction(true);
        try {
            await whatsappService.deleteSession(agentId);
            onClose();
        } catch (error) {
            onClose();
        } finally {
            setIsLoadingAction(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity rounded-[30px]" onClick={onClose} />

            <div className={cn(
                "relative bg-[#F9FAFB] rounded-4xl p-8 max-w-sm w-full animate-fade-in-up flex flex-col items-center text-center",
                "shadow-[inset_-6px_-6px_14px_rgba(255,255,255,0.8),inset_6px_6px_10px_rgba(0,0,0,0.03),0_20px_40px_rgba(0,0,0,0.08)]",
                "border border-white/60"
            )}>
                {/* Hero Icon */}
                <div className="mb-5 relative w-16 h-16 transition-all duration-500">
                    <Image src="/iconWhatsapp.svg" alt="WhatsApp" fill className="object-contain" />
                    {view === "CONNECTED" && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Content Switching */}
                {view === "LOADING" && (
                    <div className="py-8 flex flex-col items-center justify-center">
                        <div className="relative w-20 h-20 mb-6">
                            <div className="absolute inset-0 bg-green-400/30 rounded-full blur-xl animate-pulse" />
                            <div className="relative w-full h-full bg-white/50 backdrop-blur-sm rounded-full shadow-lg border border-white/60 flex items-center justify-center">
                                <Image
                                    src="/iconWhatsapp.svg"
                                    alt="Loading"
                                    width={40}
                                    height={40}
                                    className="object-contain animate-pulse"
                                />
                            </div>
                            {/* Circular Spinner Ring */}
                            <svg className="absolute inset-0 w-full h-full animate-spin text-green-500" viewBox="0 0 100 100">
                                <circle className="opacity-25" cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="4" fill="none" />
                                <circle className="opacity-75" cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="100" strokeDashoffset="50" strokeLinecap="round" />
                            </svg>
                        </div>
                        <p className="text-gray-600 font-semibold text-base animate-pulse">Menghubungkan...</p>
                        <p className="text-gray-400 text-xs mt-1">Mohon tunggu sebentar</p>
                    </div>
                )}

                {view === "CONFIRM" && (
                    <>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Hubungkan ke WhatsApp?</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-8">
                            Agen Anda akan dapat membalas pesan WhatsApp secara otomatis.
                        </p>
                        <div className="flex gap-3 w-full justify-center">
                            <button
                                onClick={onClose}
                                className="px-6 py-3 rounded-[18px] text-gray-500 font-bold hover:bg-gray-100 transition-all text-sm cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleConnect}
                                disabled={isLoadingAction}
                                className="px-6 py-3 rounded-[18px] text-white font-bold bg-linear-to-br from-[#65a30d] to-[#84cc16] shadow-md hover:scale-[1.02] transition-all text-sm cursor-pointer active:scale-[0.98]"
                            >
                                {isLoadingAction ? "Memproses..." : "Ya, Hubungkan"}
                            </button>
                        </div>
                    </>
                )}

                {view === "SCAN_QR" && (
                    <>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Scan QR Code</h3>
                        <p className="text-gray-500 text-xs mb-4">
                            Buka WhatsApp HP {'>'} Perangkat Tertaut {'>'} Tautkan
                        </p>

                        <div className="bg-white p-3 rounded-xl shadow-inner border border-gray-100 mb-6 relative">
                            {qrCode ? (
                                // Assuming createSession returns raw base64 string or data uri
                                // Usually qr comes as "data:image/png;base64,..." or just base64
                                <img
                                    src={qrCode.startsWith('data:') ? qrCode : `data:image/png;base64,${qrCode}`}
                                    alt="QR Code"
                                    className="w-48 h-48 object-contain"
                                />
                            ) : (
                                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded-lg">
                                    <span className="text-gray-400 text-xs">QR Code Error</span>
                                </div>
                            )}

                            {/* Overlay if polling success but View hasn't switched yet (optional) */}
                        </div>

                        <div className="w-full">
                            <button
                                onClick={handleCancelDuringQR}
                                disabled={isLoadingAction}
                                className="w-full px-6 py-3 rounded-[18px] text-gray-500 font-bold hover:bg-red-50 hover:text-red-500 transition-all text-sm cursor-pointer"
                            >
                                Batal
                            </button>
                        </div>
                    </>
                )}

                {view === "CONNECTED" && (
                    <>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Terhubung!</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-8">
                            Agent sudah terhubung dengan WhatsApp.
                        </p>

                        <div className="flex gap-3 w-full justify-center">
                            <button
                                onClick={onClose}
                                className="px-6 py-3 rounded-[18px] text-gray-500 font-bold hover:bg-gray-100 transition-all text-sm cursor-pointer"
                            >
                                Keluar
                            </button>
                            <button
                                onClick={handleDisconnect}
                                disabled={isLoadingAction}
                                className="px-6 py-3 rounded-[18px] text-red-500 bg-red-50 font-bold border border-red-100 hover:bg-red-100 transition-all text-sm cursor-pointer"
                            >
                                Hapus
                            </button>
                            <button
                                onClick={handleReconnect}
                                disabled={isLoadingAction}
                                className="px-6 py-3 rounded-[18px] text-white font-bold bg-blue-600 shadow-md hover:bg-blue-700 transition-all text-sm cursor-pointer"
                            >
                                Reconnect
                            </button>
                        </div>
                    </>
                )}

                {view === "ERROR" && (
                    <>
                        <h3 className="text-xl font-bold text-red-500 mb-2">Terjadi Kesalahan</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-8">
                            Gagal menghubungi server WhatsApp.
                        </p>
                        <button
                            onClick={onClose}
                            className="px-6 py-3 rounded-[18px] text-gray-500 font-bold hover:bg-gray-100 transition-all text-sm cursor-pointer"
                        >
                            Tutup
                        </button>
                    </>
                )}

            </div>
        </div>
    );
}
