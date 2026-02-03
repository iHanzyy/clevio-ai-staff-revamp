"use client";

import Footer from "@/components/features/home/Footer";

export default function TermsPage() {
    return (
        <div className="w-full bg-[#FFFAF2]">
            {/* Header Spacer */}
            <div className="h-24"></div>

            <main className="max-w-4xl mx-auto px-6 py-12 font-google-sans-flex text-gray-800">
                <h1 className="text-4xl font-bold mb-8 text-[#1E293B]">Terms & Conditions</h1>
                <p className="mb-4 text-sm text-gray-500">Last Updated: February 3, 2026</p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-[#1E293B]">1. Introduction</h2>
                    <p className="mb-4">
                        Welcome to Clevio AI Staff. These Terms & Conditions ("Terms") govern your use of our website and services operated by PT. Clevio ("Company", "we", "us", or "our").
                    </p>
                    <p className="mb-4">
                        By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-[#1E293B]">2. Accounts</h2>
                    <p className="mb-4">
                        When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                    </p>
                    <p className="mb-4">
                        You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-[#1E293B]">3. Intellectual Property</h2>
                    <p className="mb-4">
                        The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of PT. Clevio and its licensors. The Service is protected by copyright, trademark, and other laws of both Indonesia and foreign countries.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-[#1E293B]">4. AI Agents & Content</h2>
                    <p className="mb-4">
                        You retain rights to the content you create using our AI agents. However, you are responsible for ensuring that your use of the AI agents complies with applicable laws and does not infringe on the rights of others.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-[#1E293B]">5. Termination</h2>
                    <p className="mb-4">
                        We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-[#1E293B]">6. Limitation of Liability</h2>
                    <p className="mb-4">
                        In no event shall PT. Clevio, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-[#1E293B]">7. Governing Law</h2>
                    <p className="mb-4">
                        These Terms shall be governed and construed in accordance with the laws of Indonesia, without regard to its conflict of law provisions.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-[#1E293B]">8. Changes</h2>
                    <p className="mb-4">
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-[#1E293B]">9. Contact Us</h2>
                    <p className="mb-4">
                        If you have any questions about these Terms, please contact us:
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
