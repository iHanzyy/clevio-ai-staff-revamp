"use client";

export default function CtaSection() {
    return (
        <section
            className="relative w-full py-16 px-6 sm:px-8 md:px-12 lg:px-16 font-google-sans-flex"
            style={{ backgroundColor: '#FFFAF2' }}
        >
            {/* CTA Card */}
            <div
                className="mx-auto flex flex-col items-center text-center p-8"
                style={{
                    width: '350px',
                    maxWidth: '100%',
                    minHeight: '316px',
                    borderRadius: '19px',
                    background: 'linear-gradient(0deg, #FFFAF2 0%, #C3D2F4 100%)'
                }}
            >
                {/* Headline */}
                <h2
                    className="font-bold text-[24px] mb-4"
                    style={{ color: '#02457A' }}
                >
                    Bangun tim<br />staf AI Anda
                </h2>

                {/* Subtitle */}
                <p
                    className="font-normal text-[15px] mb-6"
                    style={{ color: '#02457A' }}
                >
                    Mulai transformasi digital bisnis Anda hari ini. Gratis untuk memulai, tidak perlu kartu kredit.
                </p>

                {/* CTA Button */}
                <button
                    className="px-8 py-3 text-white font-medium text-[15px] transition-all duration-300 hover:opacity-90 mb-6"
                    style={{
                        borderRadius: '59px',
                        background: 'linear-gradient(0deg, #2563EB 0%, #2563EB 100%), #FFF',
                        boxShadow: '0 0 17.2px 0 #2563EB'
                    }}
                >
                    Mulai Gratis
                </button>

                {/* Benefits */}
                <p
                    className="font-normal text-[12px]"
                    style={{ color: '#2563EB' }}
                >
                    Tidak perlu kartu kredit • Setup dalam 5 menit • Cancel kapan saja
                </p>
            </div>
        </section>
    );
}
