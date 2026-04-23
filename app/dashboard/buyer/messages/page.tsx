'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import MessageInterface from '@/components/messaging/MessageInterface';
import User from '@/models/User';

export default function BuyerMessages() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        }

        if (session?.user?.id) {
            setUserId(session.user.id);
        }
    }, [status, session, router]);

    if (status === 'loading' || !userId) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!session) {
        return null;
    }

    return (
        <div className="h-screen bg-gradient-to-b from-heritage-50 to-white">
            <div className="container mx-auto h-full flex flex-col">
                <h1 className="heading-section py-6">Messages</h1>
                <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
                    <MessageInterface userId={userId} />
                </div>
            </div>
        </div>
    );
}
