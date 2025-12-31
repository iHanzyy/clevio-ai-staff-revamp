import { Navbar } from "@/components/layout/Navbar";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col items-center pt-[20px] w-full h-full">
            {/* Persistent Navbar for Main Routes */}
            <Navbar />

            {/* Dynamic Page Content */}
            <main className="w-full h-full flex-grow">
                {children}
            </main>
        </div>
    );
}
