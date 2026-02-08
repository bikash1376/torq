"use client";
import { ForgotPassword } from "@insforge/nextjs";

export default function ForgotPasswordPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="w-full max-w-md p-4">
                <ForgotPassword />
            </div>
        </div>
    );
}
