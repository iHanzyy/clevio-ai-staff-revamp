"use client";

import Footer from "@/components/features/home/Footer";

export default function PrivacyPolicyPage() {
    return (
        <div className="w-full bg-[#FFFAF2]">
            {/* Header Spacer */}
            <div className="h-24"></div>

            <main className="max-w-4xl mx-auto px-6 py-12 font-google-sans-flex text-gray-800">
                <h1 className="text-4xl font-bold mb-8 text-[#1E293B]">Privacy Policy</h1>
                <p className="mb-4 text-sm text-gray-500">Last Updated: February 3, 2026</p>

                <section className="mb-8">
                    <p className="mb-4">
                        PT. Clevio ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services (collectively, the "Service").
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-[#1E293B]">1. Information We Collect</h2>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li><strong>Account Information:</strong> When you register, we collect your name, email address, and profile picture provided via Google OAuth.</li>
                        <li><strong>Usage Data:</strong> We collect information on how you interact with our Service, including log files, device information, and usage patterns.</li>
                        <li><strong>AI Agent Data:</strong> Information you provide to create AI agents, including system prompts, knowledge logs, and uploaded files.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-[#1E293B]">2. How We Use Your Information</h2>
                    <p className="mb-4">We use the collected information for the following purposes:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>To provide, maintain, and improve our Service.</li>
                        <li>To personalize your experience and manage your account.</li>
                        <li>To communicate with you regarding updates, security alerts, and support.</li>
                        <li>To process transactions and manage your subscription.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-[#1E293B]">3. Google OAuth & Limited Use Policy</h2>
                    <p className="mb-4">
                        Our Service uses Google OAuth to authenticate users and may request access to specific Google user data (e.g., Google Drive, Gmail) if you enable integration features for your AI Agents.
                    </p>
                    <div className="bg-blue-50 border-l-4 border-[#2563EB] p-4 rounded-r mb-4">
                        <p className="text-sm text-blue-900 font-medium">
                            <strong>Google API Services User Data Policy Disclosure:</strong><br />
                            Clevio's use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700">Google API Services User Data Policy</a>, including the Limited Use requirements.
                        </p>
                    </div>
                    <p className="mb-2">We strictly adhere to the following:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>We do not use Google user data for serving advertisements.</li>
                        <li>We do not sell Google user data to third parties.</li>
                        <li>We only use the data to provide or improve user-facing features that are prominent in the User Interface.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-[#1E293B]">4. Data Sharing and Disclosure</h2>
                    <p className="mb-4">
                        We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-[#1E293B]">5. Data Security</h2>
                    <p className="mb-4">
                        We adopt appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-[#1E293B]">6. Contact Us</h2>
                    <p className="mb-4">
                        If you have any questions about this Privacy Policy, please contact us at:
                    </p>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="font-semibold text-[#1E293B]">PT. Clevio</p>
                        <p className="text-gray-600">Bukit Golf Cibubur, Riverside 1 Blok A7/25</p>
                        <p className="text-gray-600">Gunung Putri, Bojong Nangka, Kec. Gn. Putri</p>
                        <p className="text-gray-600">Kabupaten Bogor, Jawa Barat 16963</p>
                        <p className="mt-4 text-[#2563EB]">Email: admin@clevio.co</p>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
