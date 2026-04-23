'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Calendar, IndianRupee, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface Tender {
    _id: string;
    title: string;
    description: string;
    status: 'OPEN' | 'CLOSED' | 'COMPLETED';
    createdAt: string;
    budget: string;
    timeline: string;
    deliveryAddress: string;
    createdBy: {
        _id: string;
        name: string;
        email: string;
    };
}

export default function AdminTendersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [tenders, setTenders] = useState<Tender[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
            fetchTenders();
        }
    }, [session]);

    const fetchTenders = async () => {
        try {
            const res = await fetch('/api/admin/tenders');
            if (res.ok) {
                const data = await res.json();
                setTenders(data.tenders);
            }
        } catch (error) {
            console.error('Error fetching tenders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'OPEN': return 'outline';
            case 'CLOSED': return 'destructive';
            case 'COMPLETED': return 'default';
            default: return 'secondary';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-heritage-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-heritage-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Button>
                    <h1 className="text-3xl font-serif text-heritage-900">Tender Management</h1>
                    <p className="text-gray-600">Overview of all tenders across the platform</p>
                </div>

                <div className="grid gap-6">
                    {tenders.length === 0 ? (
                        <Card className="p-12 text-center text-gray-500">
                            No tenders found.
                        </Card>
                    ) : (
                        tenders.map((tender) => (
                            <Card key={tender._id}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <div>
                                        <CardTitle className="text-xl">{tender.title}</CardTitle>
                                        <div className="text-sm text-gray-500 mt-1">
                                            By {tender.createdBy.name} ({tender.createdBy.email})
                                        </div>
                                    </div>
                                    <Badge variant={getStatusVariant(tender.status)}>
                                        {tender.status}
                                    </Badge>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 line-clamp-2 mb-4">{tender.description}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <IndianRupee className="h-4 w-4 mr-1.5" />
                                            Budget: {tender.budget}
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-1.5" />
                                            Deadline: {tender.timeline}
                                        </div>
                                        <div className="flex items-center">
                                            <MapPin className="h-4 w-4 mr-1.5" />
                                            {tender.deliveryAddress}
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-4">
                                        Posted on {format(new Date(tender.createdAt), 'MMMM do, yyyy')}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
