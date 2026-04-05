'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, ShoppingBag, MessageSquare, Settings, Heart, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function BuyerDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [userStatus, setUserStatus] = useState<{
        warningCount: number;
        isRestricted: boolean;
        isBanned: boolean;
    } | null>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchUserStatus();
        }
    }, [status]);

    const fetchUserStatus = async () => {
        try {
            const res = await fetch('/api/user/profile');
            if (res.ok) {
                const data = await res.json();
                setUserStatus({
                    warningCount: data.user.warningCount,
                    isRestricted: data.user.isRestricted,
                    isBanned: data.user.isBanned,
                });
            }
        } catch (error) {
            console.error('Failed to fetch user status:', error);
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-heritage-50 to-white">
            <div className="container mx-auto px-4 py-8">
                {/* Safety Banners */}
                <div className="mb-6 space-y-4">
                    {userStatus?.isBanned && (
                        <div className="bg-red-600 text-white p-4 rounded-lg shadow-md flex items-center gap-3 animate-pulse">
                            <AlertTriangle className="h-6 w-6 shrink-0" />
                            <div>
                                <h3 className="font-bold text-lg">Account Permanently Banned</h3>
                                <p className="text-red-50 text-sm">Your account has been permanently disabled for violating community guidelines. All activities have been restricted.</p>
                            </div>
                        </div>
                    )}

                    {userStatus?.isRestricted && !userStatus?.isBanned && (
                        <div className="bg-orange-500 text-white p-4 rounded-lg shadow-md flex items-center gap-3">
                            <AlertTriangle className="h-6 w-6 shrink-0" />
                            <div>
                                <h3 className="font-bold text-lg">Account Restricted</h3>
                                <p className="text-orange-50 text-sm">Your account is currently under review. Some features may be unavailable. Please check your <Link href="/dashboard/buyer/messages" className="underline font-bold">messages</Link> for details.</p>
                            </div>
                        </div>
                    )}

                    {userStatus && userStatus.warningCount > 0 && !userStatus.isRestricted && !userStatus.isBanned && (
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-sm flex items-center gap-3">
                            <AlertTriangle className="h-6 w-6 text-yellow-500 shrink-0" />
                            <div>
                                <h3 className="font-bold">Warning Issued ({userStatus.warningCount}/3)</h3>
                                <p className="text-sm">You have received an official warning. Please review our community guidelines in your <Link href="/dashboard/buyer/messages" className="underline font-semibold">messages</Link> to avoid account restriction.</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mb-8">
                    <h1 className="heading-section">Welcome back, {session.user.name}</h1>
                    <p className="text-heritage-600 mt-2">Manage your orders and preferences</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link href="/dashboard/buyer/profile">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                    <User className="h-5 w-5 text-heritage-600" />
                                    <CardTitle>My Profile</CardTitle>
                                </div>
                                <CardDescription>
                                    View and edit your profile information
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link href="/dashboard/buyer/wishlist">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                    <Heart className="h-5 w-5 text-heritage-600" />
                                    <CardTitle>My Wishlist</CardTitle>
                                </div>
                                <CardDescription>
                                    View your saved items
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link href="/dashboard/buyer/transactions">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-heritage-200">
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                    <ShoppingBag className="h-5 w-5 text-heritage-600" />
                                    <CardTitle>Transactions & Orders</CardTitle>
                                </div>
                                <CardDescription>
                                    View your payment history and track orders
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link href="/dashboard/buyer/messages">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                    <MessageSquare className="h-5 w-5 text-heritage-600" />
                                    <CardTitle>Messages</CardTitle>
                                </div>
                                <CardDescription>
                                    Chat with artisans about products
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link href="/dashboard/buyer/preferences">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                    <Settings className="h-5 w-5 text-heritage-600" />
                                    <CardTitle>Preferences</CardTitle>
                                </div>
                                <CardDescription>
                                    Set your cultural preferences and interests
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    );
}
