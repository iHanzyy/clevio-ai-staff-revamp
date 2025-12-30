import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* Hero Background - Home Only */}
      <div className="fixed inset-0 -z-10 w-full h-full">
        <Image
          src="/heroBackground.webp"
          alt="Hero Background"
          fill
          priority
          className="object-cover object-top"
          quality={100}
        />
      </div>
    </>
  );
}
