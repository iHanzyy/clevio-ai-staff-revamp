import type { Metadata } from "next";
import DashboardNavbar from "@/components/layout/DashboardNavbar";

export const metadata: Metadata = {
    title: "Dashboard - Clevio AI Staff",
    description: "Manage your AI Agents",
};

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen w-full bg-[#14161B] text-white">
            {/* Navbar pinned to top */}
            <DashboardNavbar />

            {/* Dashboard Content */}
            <main className="w-full min-h-[calc(100vh-80px)]">
                {children}
            </main>
        </div>
    );
}
