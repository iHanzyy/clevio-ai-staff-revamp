import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  return (
    <nav
      className={cn(
        "flex items-center justify-between px-[60px]",
        // Dimensions & Background
        // Width: 956px (responsive: scales down on smaller screens)
        "w-full max-w-[1000px] h-[80px]",
        "bg-[#F9F6EE] rounded-[30px]",
        // Shadow (exact values from design)
        "shadow-[0_452px_127px_0_rgba(0,0,0,0.01),0_289px_116px_0_rgba(0,0,0,0.04),0_163px_98px_0_rgba(0,0,0,0.15),0_72px_72px_0_rgba(0,0,0,0.26),0_18px_40px_0_rgba(0,0,0,0.29)]",
        className
      )}
    >
      {/* Logo Section */}
      <div className="flex-shrink-0">
        <Image
          src="/clevioLogo.webp"
          alt="Clevio Logo"
          width={60.054}
          height={62.943}
          style={{
            width: "60.054px",
            height: "62.943px",
            objectFit: "contain",
          }}
          priority
        />
      </div>

      {/* Navigation Links */}
      <div
        className="flex justify-center items-center gap-[30px]"
        style={{ width: "249px" }}
      >
        <div className="relative flex flex-col items-center justify-center">
          <Link
            href="/"
            className="text-black text-center font-sans text-[24px] font-bold leading-normal"
          >
            Home
          </Link>
          {/* Active Indicator Line - Absolute to prevent layout shift */}
          <div className="absolute top-full w-[81px] h-[3px] bg-black mt-1 rounded-[30px]" />
        </div>

        <Link
          href="/dashboard"
          className="text-black text-center font-sans text-[24px] font-bold leading-normal hover:opacity-70 transition-opacity"
        >
          Dashboard
        </Link>
      </div>
    </nav>
  );
}
