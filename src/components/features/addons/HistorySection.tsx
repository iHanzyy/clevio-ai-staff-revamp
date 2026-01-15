"use client";

import React from "react";
import { History } from "lucide-react";

export default function HistorySection() {
    return (
        <div className="w-full flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-[#2A2E37] rounded-2xl flex items-center justify-center mb-6 shadow-md border border-white/5">
                <History className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Belum Ada Riwayat</h3>
            <p className="text-gray-400 text-center max-w-sm">
                Tidak ada riwayat transaksi yang ditemukan saat ini.
            </p>
        </div>
    );
}
