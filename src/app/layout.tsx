import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/ToastProvider";
import GlobalErrorHandler from "@/components/GlobalErrorHandler";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chiefaiofficer.id"),
  title: {
    default: "Clevio AI Staff - Buat AI Agent untuk Bisnis Anda",
    template: "%s | Clevio AI Staff",
  },
  description:
    "Clevio AI Staff membantu Anda membuat AI agent custom untuk bisnis. Otomatisasi customer service, marketing, dan sales dengan teknologi AI terdepan.",
  keywords: [
    "AI agent",
    "AI staff",
    "customer service AI",
    "chatbot bisnis",
    "Clevio",
    "otomatisasi bisnis",
    "WhatsApp AI",
  ],
  authors: [{ name: "PT. Clevio" }],
  creator: "PT. Clevio",
  publisher: "PT. Clevio",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://chiefaiofficer.id",
    siteName: "Clevio AI Staff",
    title: "Clevio AI Staff - Buat AI Agent untuk Bisnis Anda",
    description:
      "Buat AI agent custom untuk bisnis Anda. Otomatisasi customer service, marketing, dan sales dengan Clevio AI Staff.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clevio AI Staff - Buat AI Agent untuk Bisnis Anda",
    description:
      "Buat AI agent custom untuk bisnis Anda. Otomatisasi customer service, marketing, dan sales.",
  },
  alternates: {
    canonical: "https://chiefaiofficer.id",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght,wdth@8..144,100..1000,25..151&display=swap"
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${poppins.variable} antialiased relative min-h-screen w-full overflow-x-hidden`}
      >
        {/* Persistent Content Wrapper */}
        <div className="relative z-10 flex flex-col items-center w-full h-full">
          <GlobalErrorHandler />
          <ToastProvider>
            {children}
          </ToastProvider>
        </div>
      </body>
    </html>
  );
}
