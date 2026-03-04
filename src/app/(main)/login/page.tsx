import LoginForm from "@/components/features/auth/LoginForm";

export default function LoginPage() {
    return (
        <>
            {/* Dashboard Background - Ivory */}
            <div className="fixed inset-0 -z-10 w-full h-full bg-[#fffff0]" />

            {/* Login Content */}
            <div className="w-full min-h-screen pt-[120px] md:pt-[140px] pb-10 flex items-center justify-center">
                <LoginForm />
            </div>
        </>
    );
}
