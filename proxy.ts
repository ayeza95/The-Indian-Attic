import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
    });

    const { pathname } = request.nextUrl;

    // API routes untouched
    if (pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    // Redirect to login if accessing protected route without auth
    if (!token && pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Role-based access control
    if (token && pathname.startsWith('/dashboard')) {
        const role = token.role as string;

        if (!role) {
            return NextResponse.next();
        }

        if (pathname.startsWith('/dashboard/buyer') && role !== 'buyer') {
            return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
        }

        if (pathname.startsWith('/dashboard/artisan') && role !== 'artisan') {
            return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
        }

        if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
            return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
        }
    }

    // Redirect authenticated users away from auth pages
    if (token && pathname.startsWith('/auth/')) {
        const role = token.role as string;
        if (role) {
            return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
