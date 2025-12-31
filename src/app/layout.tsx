import type { Metadata } from "next";
import { Poppins } from "next/font/google";
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
        <div className="relative z-10 flex flex-col items-center w-full h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
