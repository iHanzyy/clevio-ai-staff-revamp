import LoginForm from "@/components/LoginForm";
import LoginBackground from "@/components/LoginBackground";

export default function LoginPage() {
    return (
        <>
            {/* Login Background */}
            <LoginBackground />

            {/* Login Content */}
            <div className="w-full h-full pt-[80px] flex items-center justify-center">
                <LoginForm />
            </div>
        </>
    );
}
