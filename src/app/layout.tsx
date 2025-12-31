import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Clevio AI Staff",
  description: "Clevio AI Staff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${poppins.variable} antialiased relative min-h-screen w-full overflow-hidden`}
      >
        {/* Persistent Content Wrapper */}
        <div className="relative z-10 flex flex-col items-center pt-[30px] w-full h-full">
          {/* Persistent Navbar */}
          <Navbar />

          {/* Dynamic Page Content */}
          <main className="w-full h-full flex-grow">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
