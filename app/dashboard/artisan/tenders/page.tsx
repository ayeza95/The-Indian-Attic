'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Loader2, Calendar, MapPin, IndianRupee, Search } from 'lucide-react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';

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
    };
}

export default function ArtisanTendersPage() {
    const [tenders, setTenders] = useState<Tender[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchTenders = async () => {
            try {
                const res = await fetch('/api/tenders');
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

    const filteredTenders = tenders.filter(tender =>
        tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tender.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#FDFCF7] py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12">
                    <Link href="/dashboard/artisan" className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 mb-6 hover:bg-gray-100 transition-colors">
                        <ArrowLeft className="h-5 w-5 text-gray-700" />
                    </Link>
                    <h1 className="text-4xl font-sans tracking-tight text-gray-900 font-bold uppercase mb-2">Available Tenders</h1>
                </div>

                <div className="mb-8 relative max-w-md">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search tenders..."
                        className="pl-10 border-gray-300 rounded-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-heritage-600" />
                    </div>
                ) : filteredTenders.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">
                        {searchQuery ? 'No tenders matching your search.' : 'There are currently no open tenders available.'}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredTenders.map((tender) => {
                            if (tender.status === 'OPEN') {
                                return (
                                    <Link key={tender._id} href={`/dashboard/artisan/tenders/${tender._id}`} className="block">
                                        <div className="bg-[#FEF9C3] hover:bg-[#FEF08A] transition-colors border border-gray-400 p-4 rounded-md shadow-sm group">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="text-lg font-bold uppercase tracking-tight text-gray-900 group-hover:text-black">
                                                        {tender.title}
                                                    </h3>
                                                    <p className="text-sm font-medium text-gray-700 uppercase">
                                                        TENDER BY: {tender.createdBy?.name || 'Unknown'}, {tender.deliveryAddress.split(',').pop()?.trim().toUpperCase() || 'INDIA'}
                                                    </p>
                                                </div>
                                                <div className="flex items-center text-sm font-bold text-gray-800 uppercase group-hover:underline">
                                                    View Details <span className="ml-2">→</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            } else if (tender.status === 'COMPLETED') {
                                return (
                                    <div key={tender._id} className="bg-[#DCFCE7] border border-gray-400 p-6 rounded-md shadow-sm text-center">
                                        <h3 className="text-lg font-bold uppercase tracking-tight text-gray-900">
                                            Tender Completed Successfully
                                        </h3>
                                    </div>
                                );
                            } else {
                                // CLOSED
                                return (
                                    <div key={tender._id} className="bg-[#FEE2E2] border border-gray-400 p-6 rounded-md shadow-sm text-center">
                                        <h3 className="text-lg font-bold uppercase tracking-tight text-gray-900">
                                            Tender Closed No Suitable Applicant Found on Time
                                        </h3>
                                    </div>
                                );
                            }
                        })}
                    </div>
                )}

                <div className="mt-12 text-sm text-gray-500 font-medium italic">
                    * Click on view details to view full description
                </div>
            </div>
        </div>
    );
}
