'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Download, Filter, FileText, Calendar, IndianRupee, TrendingUp } from 'lucide-react';

interface ReportStats {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
}

export default function ArtisanReports() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [stats, setStats] = useState<ReportStats | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        } else if (status === 'authenticated') {
            fetchStats();
        }
    }, [status]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const query = new URLSearchParams();
            if (startDate) query.append('startDate', startDate);
            if (endDate) query.append('endDate', endDate);

            const res = await fetch(`/api/artisan/analytics/products?${query.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setStats({
                    totalRevenue: data.analytics.totalRevenue,
                    totalOrders: data.analytics.totalUnitsSold,
                    avgOrderValue: data.analytics.totalUnitsSold > 0 ? data.analytics.totalRevenue / data.analytics.totalUnitsSold : 0
                });
            }
        } catch (error) {
            toast.error('Failed to fetch stats');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        const query = new URLSearchParams();
        if (startDate) query.append('startDate', startDate);
        if (endDate) query.append('endDate', endDate);
        
        window.location.href = `/api/artisan/reports/download?${query.toString()}`;
        toast.success('Report generation started');
    };

    if (status === 'loading') return <div>Loading...</div>;
    if (!session) return null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-heritage-50 to-white">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="heading-section">Financial Reports</h1>
                        <p className="text-heritage-600 mt-1">Track your earnings and export transaction history</p>
                    </div>
                    <Button 
                        onClick={handleDownload}
                        className="bg-heritage-600 hover:bg-heritage-700 flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" /> Export to CSV
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="border-heritage-100">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-heritage-600" />
                                    Filter Report
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start">Start Date</Label>
                                    <Input 
                                        id="start" 
                                        type="date" 
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end">End Date</Label>
                                    <Input 
                                        id="end" 
                                        type="date" 
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                                <Button 
                                    className="w-full mt-2" 
                                    onClick={fetchStats}
                                    variant="outline"
                                    disabled={loading}
                                >
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Apply Filter
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Stats & Preview */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="bg-heritage-50 border-heritage-200">
                                <CardContent className="pt-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-medium text-heritage-600">Total Revenue</p>
                                            <h3 className="text-2xl font-bold text-heritage-900 mt-1">
                                                ₹{stats?.totalRevenue.toLocaleString() || 0}
                                            </h3>
                                        </div>
                                        <div className="p-2 bg-heritage-100 rounded-lg">
                                            <IndianRupee className="h-5 w-5 text-heritage-700" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-blue-50 border-blue-200">
                                <CardContent className="pt-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-medium text-blue-700">Units Sold</p>
                                            <h3 className="text-2xl font-bold text-blue-900 mt-1">
                                                {stats?.totalOrders || 0}
                                            </h3>
                                        </div>
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <FileText className="h-5 w-5 text-blue-700" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-green-50 border-green-200">
                                <CardContent className="pt-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-medium text-green-700">Avg. Order Value</p>
                                            <h3 className="text-2xl font-bold text-green-900 mt-1">
                                                ₹{Math.round(stats?.avgOrderValue || 0).toLocaleString()}
                                            </h3>
                                        </div>
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <TrendingUp className="h-5 w-5 text-green-700" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="border-heritage-100 min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                            <div className="bg-heritage-50 p-6 rounded-full mb-4">
                                <Download className="h-12 w-12 text-heritage-300" />
                            </div>
                            <h3 className="text-xl font-bold text-heritage-900 mb-2">Ready to Export</h3>
                            <p className="text-heritage-600 max-w-sm mb-6">
                                Select a date range to filter your transaction history. You can then download a complete CSV report for your accounting.
                            </p>
                            <Button 
                                size="lg"
                                onClick={handleDownload}
                                className="bg-heritage-800 hover:bg-heritage-950"
                            >
                                <Download className="h-5 w-5 mr-2" /> Download Report
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
