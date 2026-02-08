
'use client';
import { InsforgeBrowserProvider, type InitialAuthState } from '@insforge/nextjs';
import { insforge } from '@/lib/insforge';

export function InsforgeProvider({ children, initialState }: { children: React.ReactNode, initialState?: InitialAuthState }) {
    return (
        <InsforgeBrowserProvider client={insforge} afterSignInUrl="/chat" initialState={initialState}>
            {children}
        </InsforgeBrowserProvider>
    );
}
