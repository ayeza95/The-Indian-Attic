'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2, Calendar, MapPin, IndianRupee, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Tender {
    _id: string;
    title: string;
    description: string;
    eligibility: string;
    demands: string;
    timeline: string;
    deliveryAddress: string;
    budget: string;
    status: 'OPEN' | 'CLOSED' | 'COMPLETED';
    createdAt: string;
    createdBy: {
        _id: string;
        name: string;
    };
}

export default function TenderDetailsPage({ params }: { params: Promise<{ tenderId: string }> }) {
    const { tenderId } = use(params);
    const router = useRouter();
    const [tender, setTender] = useState<Tender | null>(null);
    const [hasApplied, setHasApplied] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isApplying, setIsApplying] = useState(false);
    const [applicationForm, setApplicationForm] = useState({
        cost: '',
        availability: '',
        negotiations: '',
    });

    useEffect(() => {
        const fetchTender = async () => {
            try {
                const res = await fetch(`/api/tenders/${tenderId}`);
                if (res.ok) {
                    const data = await res.json();
                    setTender(data.tender);
                    setHasApplied(data.hasApplied);
                }
            } catch (error) {
                console.error('Error fetching tender:', error);
                toast.error('Failed to load tender details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTender();
    }, [tenderId]);

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsApplying(true);

        try {
            const res = await fetch(`/api/tenders/${tenderId}/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(applicationForm),
            });

            if (res.ok) {
                toast.success('Application submitted successfully!');
                // Reset form or redirect? User said "Submit your proposals...".
                // Maybe redirect back to list or show success state.
                router.push('/dashboard/artisan/tenders');
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to submit application');
            }
        } catch (error) {
            console.error('Error applying:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsApplying(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-heritage-600" />
            </div>
        );
    }

    if (!tender) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h2 className="text-xl font-bold mb-4">Tender not found</h2>
                <Link href="/dashboard/artisan/tenders">
                    <Button>Back to Tenders</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFCF7] py-8 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <Link href="/dashboard/artisan/tenders" className="flex items-center text-gray-700 hover:text-black transition-colors">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <div className="text-sm font-bold tracking-widest text-gray-500 uppercase">
                        TENDER ID: {tender._id.slice(-6).toUpperCase()}
                    </div>
                </div>

                <div className="bg-[#FEF9C3] border border-gray-400 rounded-lg shadow-sm overflow-hidden mb-8">
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">{tender.title}</h1>
                        <p className="text-gray-800 text-lg leading-relaxed mb-8">
                            {tender.description}
                        </p>

                        <div className="h-px bg-gray-400 w-full mb-8"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
                            {/* Left Column */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-sm font-black tracking-widest text-gray-900 uppercase mb-4">ELIGIBILITY TO ACCEPT</h3>
                                    <ul className="space-y-2">
                                        {tender.eligibility.split('\n').filter(line => line.trim()).map((line, idx) => (
                                            <li key={idx} className="flex items-start text-gray-800">
                                                <span className="mr-2">•</span>
                                                <span>{line.replace(/^[•*-]\s*/, '')}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="h-px bg-gray-400 w-full"></div>

                                <div>
                                    <h3 className="text-sm font-black tracking-widest text-gray-900 uppercase mb-2">TIME</h3>
                                    <p className="text-gray-800 font-medium">{tender.timeline}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-black tracking-widest text-gray-900 uppercase mb-2">BUDGET</h3>
                                    <p className="text-gray-800 font-medium">{tender.budget}</p>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-sm font-black tracking-widest text-gray-900 uppercase mb-4">DEMANDS</h3>
                                    <ul className="space-y-2">
                                        {tender.demands.split('\n').filter(line => line.trim()).map((line, idx) => (
                                            <li key={idx} className="flex items-start text-gray-800">
                                                <span className="mr-2">•</span>
                                                <span>{line.replace(/^[•*-]\s*/, '')}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="h-px bg-gray-400 w-full"></div>

                                <div>
                                    <h3 className="text-sm font-black tracking-widest text-gray-900 uppercase mb-2">DELIVERY ADDRESS</h3>
                                    <p className="text-gray-800 font-medium">{tender.deliveryAddress}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {hasApplied ? (
                    <div className="bg-green-100 border border-green-300 p-8 rounded-lg text-center shadow-sm">
                        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Proposal Submitted</h2>
                        <p className="text-gray-700">You have already applied for this tender. We will notify you of any updates.</p>
                        <Link href="/dashboard/artisan/tenders">
                            <Button variant="outline" className="mt-6 border-green-600 text-green-700 hover:bg-green-50">
                                Back to Available Tenders
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row gap-4">
                        <Button
                            onClick={() => {
                                const formEl = document.getElementById('application-form');
                                formEl?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="flex-1 py-8 text-xl font-bold uppercase tracking-widest bg-[#DCFCE7] hover:bg-[#BBF7D0] text-gray-900 border border-gray-400 rounded-lg shadow-sm"
                        >
                            Apply
                        </Button>
                        <Button
                            onClick={() => router.push('/dashboard/artisan/tenders')}
                            className="flex-1 py-8 text-xl font-bold uppercase tracking-widest bg-[#FEE2E2] hover:bg-[#FECACA] text-gray-900 border border-gray-400 rounded-lg shadow-sm"
                        >
                            Reject
                        </Button>
                    </div>
                )}

                {!hasApplied && (
                    <div id="application-form" className="mt-12 bg-white p-8 border border-gray-400 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase tracking-tight">Submit Your Proposal</h2>
                        <form onSubmit={handleApply} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="cost" className="text-sm font-bold uppercase tracking-widest text-gray-700">Proposed Cost</label>
                                <Input
                                    id="cost"
                                    value={applicationForm.cost}
                                    onChange={(e) => setApplicationForm(prev => ({ ...prev, cost: e.target.value }))}
                                    placeholder="e.g. ₹60,000"
                                    className="p-6 text-lg border-gray-300 focus:ring-yellow-500 focus:border-yellow-500"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="availability" className="text-sm font-bold uppercase tracking-widest text-gray-700">Availability of Items</label>
                                <Input
                                    id="availability"
                                    value={applicationForm.availability}
                                    onChange={(e) => setApplicationForm(prev => ({ ...prev, availability: e.target.value }))}
                                    placeholder="e.g. Available immediately or 2 weeks"
                                    className="p-6 text-lg border-gray-300 focus:ring-yellow-500 focus:border-yellow-500"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="negotiations" className="text-sm font-bold uppercase tracking-widest text-gray-700">Negotiations / Notes</label>
                                <Textarea
                                    id="negotiations"
                                    value={applicationForm.negotiations}
                                    onChange={(e) => setApplicationForm(prev => ({ ...prev, negotiations: e.target.value }))}
                                    placeholder="Any negotiation terms or additional notes..."
                                    className="p-6 text-lg border-gray-300 focus:ring-yellow-500 focus:border-yellow-500 min-h-[150px]"
                                />
                            </div>

                            <Button type="submit" className="w-full py-8 text-xl font-bold uppercase tracking-widest bg-heritage-600 hover:bg-heritage-700 text-white rounded-lg shadow-md" disabled={isApplying}>
                                {isApplying ? (
                                    <>
                                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Proposal'
                                )}
                            </Button>
                        </form>
                    </div>
                )}

                <div className="mt-12 text-sm text-gray-500 font-medium italic text-center">
                    * Now you can click on apply and fill a form in which you will submit your proposals like cost, availability of items, negotiations, etc.
                </div>
            </div>
        </div>
    );
}
