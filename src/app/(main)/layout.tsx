import { Navbar } from "@/components/layout/Navbar";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="relative flex flex-col items-center w-full min-h-screen bg-[#FFFAF2]">
            {/* Persistent Navbar for Main Routes - Absolute positioning to float over hero */}
            <div className="absolute top-5 z-50 w-full flex justify-center">
                <Navbar />
            </div>

            {/* Dynamic Page Content */}
            <main className="w-full h-full grow">
                {children}
            </main>
        </div>
    );
}
