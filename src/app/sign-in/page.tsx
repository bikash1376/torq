import { SignIn } from "@insforge/nextjs";

export default function SignInPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="w-full max-w-md p-4">
                <SignIn
                    signUpUrl="/sign-up"
                    forgotPasswordUrl="/forgot-password"
                />
            </div>
        </div>
    );
}
