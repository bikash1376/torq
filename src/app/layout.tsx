import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { InsforgeProvider } from "./providers";
import { SignedIn, SignedOut, UserButton, getAuthFromCookies } from "@insforge/nextjs";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Torq - AI Learning Tutor",
  description: "Your personal AI tutor with interactive learning visuals",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = await getAuthFromCookies();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <InsforgeProvider initialState={initialState}>
          <nav className="fixed top-4 right-4 z-50 flex gap-4">
            <SignedOut>
              <Link
                href="/sign-in"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md shadow hover:bg-primary/90 transition-colors"
              >
                Sign In
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </nav>
          {children}
        </InsforgeProvider>
      </body>
    </html>
  );
}
