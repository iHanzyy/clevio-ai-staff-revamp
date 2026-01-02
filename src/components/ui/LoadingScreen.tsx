
export default function LoadingScreen({ text }: { text?: string }) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#F9F6EE] flex-col gap-6">
            <div className="loader"></div>
            {text && (
                <h2 className="text-xl font-bold font-sans text-[#1a1a1a] animate-pulse">
                    {text}
                </h2>
            )}
        </div>
    );
}
