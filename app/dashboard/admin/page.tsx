'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Package, MessageSquare, Settings } from 'lucide-react';

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        }
        if (status === 'authenticated' && session?.user?.role !== 'admin') {
            router.push('/');
        }
    }, [status, session, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (!session || session.user.role !== 'admin') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-heritage-50 to-white">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="heading-section">Admin Dashboard</h1>
                    <p className="text-heritage-600 mt-2">Manage users, products, and platform settings</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link href="/dashboard/admin/users">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                    <Users className="h-5 w-5 text-heritage-600" />
                                    <CardTitle>User Management</CardTitle>
                                </div>
                                <CardDescription>
                                    View, manage, and moderate all registered users
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link href="/dashboard/admin/products">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                    <Package className="h-5 w-5 text-heritage-600" />
                                    <CardTitle>Product Management</CardTitle>
                                </div>
                                <CardDescription>
                                    Moderate and manage all product listings
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link href="/dashboard/admin/messages">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                    <MessageSquare className="h-5 w-5 text-heritage-600" />
                                    <CardTitle>Messages</CardTitle>
                                </div>
                                <CardDescription>
                                    Send messages to users
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link href="/dashboard/admin/artisans">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                    <Users className="h-5 w-5 text-heritage-600" />
                                    <CardTitle>Artisan Verification</CardTitle>
                                </div>
                                <CardDescription>
                                    Approve or reject artisan applications
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>

                    <Link href="/states">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                    <Settings className="h-5 w-5 text-heritage-600" />
                                    <CardTitle>States</CardTitle>
                                </div>
                                <CardDescription>
                                    Manage geographic data
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    );
}
