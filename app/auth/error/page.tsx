'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';

import { Suspense } from 'react';

function AuthErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <div className="flex flex-col items-center">
                    <div className="rounded-full bg-red-100 p-3 mb-4">
                        <ShieldAlert className="h-12 w-12 text-red-600" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Authentication Error
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        {error === 'Configuration'
                            ? 'There is a problem with the server configuration.'
                            : error === 'AccessDenied'
                            ? 'You do not have permission to access this resource.'
                            : 'An unexpected error occurred during authentication.'}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                        Error code: <code className="bg-gray-100 px-1 py-0.5 rounded">{error || 'Unknown'}</code>
                    </p>
                </div>

                <div className="mt-8 space-y-4">
                    <Link
                        href="/auth/login"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        Return to Login
                    </Link>
                    <Link
                        href="/"
                        className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        Go to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function AuthErrorPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p>Loading...</p>
            </div>
        }>
            <AuthErrorContent />
        </Suspense>
    );
}
