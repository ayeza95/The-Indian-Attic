'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, ArrowLeft, Loader2, Calendar, MapPin, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';

interface Tender {
    _id: string;
    title: string;
    description: string;
    status: 'OPEN' | 'CLOSED' | 'COMPLETED';
    createdAt: string;
    budget: string;
    timeline: string;
}

export default function BuyerTendersPage() {
    const [tenders, setTenders] = useState<Tender[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTenders = async () => {
            try {
                const res = await fetch('/api/tenders/buyer');
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

        fetchTenders();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'CLOSED':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'COMPLETED':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-heritage-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <Link href="/dashboard/buyer" className="flex items-center text-heritage-600 mb-2 hover:text-heritage-800 transition-colors">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-serif text-heritage-900">My Tenders</h1>
                        <p className="text-gray-600">Manage your active tenders and view applications</p>
                    </div>
                    <Link href="/dashboard/buyer/tenders/create">
                        <Button className="bg-heritage-600 hover:bg-heritage-700 text-white">
                            <Plus className="mr-2 h-4 w-4" />
                            Initiate New Tender
                        </Button>
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-heritage-600" />
                    </div>
                ) : tenders.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <div className="mb-4 bg-heritage-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                                <Plus className="h-8 w-8 text-heritage-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tenders Yet</h3>
                            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                                You haven't initiated any tenders yet. Start by creating a new tender for artisans.
                            </p>
                            <Link href="/dashboard/buyer/tenders/create">
                                <Button variant="outline" className="border-heritage-600 text-heritage-600 hover:bg-heritage-50">
                                    Initiate Your First Tender
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {tenders.map((tender) => (
                            <Card key={tender._id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-semibold text-gray-900">{tender.title}</h3>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(tender.status)}`}>
                                                    {tender.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 line-clamp-2 mb-4">{tender.description}</p>

                                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 mr-1.5" />
                                                    Posted on {format(new Date(tender.createdAt), 'MMM d, yyyy')}
                                                </div>
                                                <div className="flex items-center">
                                                    <IndianRupee className="h-4 w-4 mr-1.5" />
                                                    {tender.budget}
                                                </div>
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 mr-1.5" />
                                                    Timeline: {tender.timeline}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            {/* Ideally link to a details page to see applications. For now, just placeholder or non-functional as not explicitly asked for 'Manage Tender' page, but 'View Details' is good practice. */}
                                            {/* Since the user didn't ask for "Buyer View Tender Details" specifically beyond "Buyer's Tender List", I will just leave it as list or maybe a simple View button. */}
                                            <Button variant="outline" className="w-full md:w-auto">
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
