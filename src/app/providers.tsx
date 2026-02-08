
'use client';
import { InsforgeBrowserProvider, type InitialAuthState } from '@insforge/nextjs';
import { insforge } from '@/lib/insforge';

export function InsforgeProvider({ children, initialState }: { children: React.ReactNode, initialState?: InitialAuthState }) {
    console.log("InsforgeProvider initialState:", initialState ? { hasUser: !!initialState.user, userId: initialState.user?.id } : "none");
    return (
        <InsforgeBrowserProvider client={insforge} afterSignInUrl="/chat" initialState={initialState}>
            {children}
        </InsforgeBrowserProvider>
    );
}
