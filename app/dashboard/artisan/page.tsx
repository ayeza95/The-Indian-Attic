'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Package, MessageSquare, Settings, AlertTriangle, Search, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ArtisanDashboard() {
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
                                <p className="text-red-50 text-sm">Your account has been permanently disabled. All your product listings have been removed.</p>
                            </div>
                        </div>
                    )}

                    {userStatus?.isRestricted && !userStatus?.isBanned && (
                        <div className="bg-orange-500 text-white p-4 rounded-lg shadow-md flex items-center gap-3">
                            <AlertTriangle className="h-6 w-6 shrink-0" />
                            <div>
                                <h3 className="font-bold text-lg">Account Restricted</h3>
                                <p className="text-orange-50 text-sm">Your account is currently under review. You cannot add or modify products at this time. Please check your <Link href="/dashboard/artisan/messages" className="underline font-bold">messages</Link> for details.</p>
                            </div>
                        </div>
                    )}

                    {userStatus && userStatus.warningCount > 0 && !userStatus.isRestricted && !userStatus.isBanned && (
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-sm flex items-center gap-3">
                            <AlertTriangle className="h-6 w-6 text-yellow-500 shrink-0" />
                            <div>
                                <h3 className="font-bold">Warning Issued ({userStatus.warningCount}/3)</h3>
                                <p className="text-sm">You have received an official warning. Please review our community guidelines in your <Link href="/dashboard/artisan/messages" className="underline font-semibold">messages</Link> to avoid account restriction.</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mb-8">
                    <h1 className="heading-section">Welcome, {session.user.name}</h1>
                    <p className="text-heritage-600 mt-2">Manage your products and orders</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link href="/dashboard/artisan/profile">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                    <User className="h-5 w-5 text-heritage-600" />
                                    <CardTitle>My Profile</CardTitle>
                                </div>
                                <CardDescription>
                                    View and edit your artisan profile
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link href="/dashboard/artisan/products">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                    <Package className="h-5 w-5 text-heritage-600" />
                                    <CardTitle>My Products</CardTitle>
                                </div>
                                <CardDescription>
                                    Manage your product listings
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link href="/dashboard/artisan/orders">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                    <Package className="h-5 w-5 text-heritage-600" />
                                    <CardTitle>Orders</CardTitle>
                                </div>
                                <CardDescription>
                                    View and fulfill customer orders
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link href="/dashboard/artisan/messages">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                    <MessageSquare className="h-5 w-5 text-heritage-600" />
                                    <CardTitle>Messages</CardTitle>
                                </div>
                                <CardDescription>
                                    Chat with customers
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                    <Link href="/dashboard/artisan/reports">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200 bg-green-50/30">
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                    <FileText className="h-5 w-5 text-green-700" />
                                    <CardTitle>Financial Reports</CardTitle>
                                </div>
                                <CardDescription>
                                    View earnings and download statements
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                    <Link href="/dashboard/artisan/tenders">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-heritage-200 bg-heritage-50">
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                    <Search className="h-5 w-5 text-heritage-600" />
                                    <CardTitle>Find a Tender</CardTitle>
                                </div>
                                <CardDescription>
                                    Browse and apply for custom artifact commissions
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    );
}
