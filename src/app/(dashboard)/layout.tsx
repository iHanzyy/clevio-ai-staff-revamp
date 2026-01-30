import type { Metadata } from "next";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import GuestTimer from "@/components/features/dashboard/GuestTimer";

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
        <div className="h-screen w-full bg-[#14161B] text-white flex flex-col overflow-hidden">
            <GuestTimer />
            {/* Navbar pinned to top */}
            <DashboardNavbar />

            {/* Dashboard Content (Flex-1 to take remaining height, fixed for internal scroll) */}
            <main className="w-full flex-1 overflow-hidden">
                {children}
            </main>
        </div>
    );
}
