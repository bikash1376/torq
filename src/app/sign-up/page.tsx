import { SignUp } from "@insforge/nextjs";

export default function SignUpPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="w-full max-w-md p-4">
                <SignUp
                    signInUrl="/sign-in"
                />
            </div>
        </div>
    );
}
