'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PendingArtisan {
    _id: string;
    name: string;
    email: string;
    businessName?: string;
    createdAt: string;
    phone?: string;
}

export default function ArtisanVerificationPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [pendingArtisans, setPendingArtisans] = useState<PendingArtisan[]>([]);
    const [verifiedArtisans, setVerifiedArtisans] = useState<PendingArtisan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        }
        if (status === 'authenticated' && session?.user?.role !== 'admin') {
            router.push('/');
        }
    }, [status, session, router]);

    useEffect(() => {
        if (session?.user?.role === 'admin') {
            fetchArtisans();
        }
    }, [session]);

    const fetchArtisans = async () => {
        try {
            // Fetch pending artisans
            const pendingResponse = await fetch('/api/admin/artisans/pending');
            if (pendingResponse.ok) {
                const data = await pendingResponse.json();
                setPendingArtisans(data.artisans);
            }

            // Fetch verified artisans
            const verifiedResponse = await fetch('/api/admin/artisans/verified');
            if (verifiedResponse.ok) {
                const data = await verifiedResponse.json();
                setVerifiedArtisans(data.artisans);
            }
        } catch (error) {
            console.error('Failed to fetch artisans:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (artisanId: string) => {
        try {
            const response = await fetch(`/api/admin/artisans/${artisanId}/verify`, {
                method: 'POST',
            });

            if (response.ok) {
                alert('Artisan verified successfully');
                // Move from pending to verified locally
                const verifiedArtisan = pendingArtisans.find(a => a._id === artisanId);
                if (verifiedArtisan) {
                    setPendingArtisans(pendingArtisans.filter(a => a._id !== artisanId));
                    setVerifiedArtisans([verifiedArtisan, ...verifiedArtisans]);
                }
            } else {
                alert('Failed to verify artisan');
            }
        } catch (error) {
            alert('An error occurred');
        }
    };

    const handleReject = async (artisanId: string) => {
        if (!confirm('Are you sure you want to reject this artisan?')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/artisans/${artisanId}/reject`, {
                method: 'POST',
            });

            if (response.ok) {
                alert('Artisan rejected');
                setPendingArtisans(pendingArtisans.filter(a => a._id !== artisanId));
            } else {
                alert('Failed to reject artisan');
            }
        } catch (error) {
            alert('An error occurred');
        }
    };

    if (status === 'loading' || loading) {
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
                    <h1 className="heading-section">Artisan Verification</h1>
                    <p className="text-heritage-600 mt-2">Review and approve artisan registrations</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Pending Artisans Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Artisan Applications ({pendingArtisans.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {pendingArtisans.length === 0 ? (
                                <p className="text-center py-8 text-heritage-600">No pending artisan applications</p>
                            ) : (
                                <div className="space-y-4">
                                    {pendingArtisans.map((artisan) => (
                                        <div
                                            key={artisan._id}
                                            className="border border-heritage-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg text-heritage-900">{artisan.name}</h3>
                                                    {artisan.businessName && (
                                                        <p className="text-sm text-heritage-600">{artisan.businessName}</p>
                                                    )}
                                                    <p className="text-sm text-heritage-600 mt-1">{artisan.email}</p>
                                                    {artisan.phone && (
                                                        <p className="text-sm text-heritage-600">{artisan.phone}</p>
                                                    )}
                                                    <p className="text-xs text-heritage-500 mt-2">
                                                        Applied: {new Date(artisan.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2 ml-4">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleVerify(artisan._id)}
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleReject(artisan._id)}
                                                    >
                                                        Reject
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Verified Artisans Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Verified Artisans ({verifiedArtisans.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {verifiedArtisans.length === 0 ? (
                                <p className="text-center py-8 text-heritage-600">No verified artisans</p>
                            ) : (
                                <div className="space-y-4">
                                    {verifiedArtisans.map((artisan) => (
                                        <div
                                            key={artisan._id}
                                            className="border border-green-200 bg-green-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold text-lg text-heritage-900">{artisan.name}</h3>
                                                        <Badge className="bg-green-600">Verified</Badge>
                                                    </div>
                                                    {artisan.businessName && (
                                                        <p className="text-sm text-heritage-600">{artisan.businessName}</p>
                                                    )}
                                                    <p className="text-sm text-heritage-600 mt-1">{artisan.email}</p>
                                                    {artisan.phone && (
                                                        <p className="text-sm text-heritage-600">{artisan.phone}</p>
                                                    )}
                                                    <p className="text-xs text-heritage-500 mt-2">
                                                        Joined: {new Date(artisan.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
