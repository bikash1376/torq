
import { InsforgeMiddleware } from '@insforge/nextjs/middleware';

export default InsforgeMiddleware({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    publicRoutes: ['/', '/sign-in', '/sign-up', '/forgot-password'],
    useBuiltInAuth: false,
    signInUrl: '/sign-in',
    signUpUrl: '/sign-up',
    forgotPasswordUrl: '/forgot-password',
    afterSignInUrl: '/chat',
});

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
