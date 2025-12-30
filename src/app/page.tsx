import Image from "next/image";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/heroBackground.webp"
          alt="Hero Background"
          fill
          priority
          className="object-cover object-top"
          quality={100}
        />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col items-center pt-0 w-full h-full">
        <Navbar />
      </div>
    </main>
  );
}
