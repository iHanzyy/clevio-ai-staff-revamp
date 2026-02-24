import type { Metadata } from "next";
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import GuestTimer from "@/components/features/dashboard/GuestTimer";
import ExpiredPlanPopup from "@/components/ui/ExpiredPlanPopup";

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
        <div className="h-screen w-full bg-[linear-gradient(0deg,#FFFAF2_0%,#C3D2F4_100%)] text-white flex flex-col overflow-hidden">
            <GuestTimer />
            <ExpiredPlanPopup />
            {/* Navbar pinned to top */}
            <DashboardNavbar />

            {/* Dashboard Content (Flex-1 to take remaining height, fixed for internal scroll) */}
            <main className="w-full flex-1 overflow-hidden">
                {children}
            </main>
        </div>
    );
}
