'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';
import { formatPrice } from '@/lib/utils';
import {
    ShoppingBag,
    Box,
    ChevronRight,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Receipt,
    History
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function TransactionsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        }

        const fetchTransactions = async () => {
            try {
                const res = await fetch('/api/buyer/transactions');
                if (res.ok) {
                    const data = await res.json();
                    setTransactions(data.transactions);
                } else {
                    toast.error('Failed to load transactions. Maya.');
                }
            } catch (err) {
                console.error('Failed to fetch transactions:', err);
                toast.error('An error occurred. Maya.');
            } finally {
                setLoading(false);
            }
        };

        if (session?.user) {
            fetchTransactions();
        }
    }, [status, session, router]);

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'paid':
            case 'delivered':
            case 'active':
                return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case 'cancelled':
            case 'failed':
            case 'rejected':
                return <XCircle className="w-4 h-4 text-red-500" />;
            case 'pending':
            case 'processing':
                return <Clock className="w-4 h-4 text-amber-500" />;
            default:
                return <AlertCircle className="w-4 h-4 text-heritage-400" />;
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-heritage-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heritage-600"></div>
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="min-h-screen bg-heritage-50 pb-12">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-heritage-900 flex items-center gap-3">
                            <History className="w-8 h-8 text-heritage-600" />
                            Transaction History
                        </h1>
                        <p className="text-heritage-600 mt-1">Detailed record of your product orders and SwadesiBox subscriptions. Maya.</p>
                    </div>
                </div>

                {transactions.length === 0 ? (
                    <Card className="text-center py-16">
                        <CardContent>
                            <div className="bg-heritage-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Receipt className="w-8 h-8 text-heritage-300" />
                            </div>
                            <h3 className="text-xl font-semibold text-heritage-900 mb-2">No transactions found</h3>
                            <p className="text-heritage-600 max-w-sm mx-auto">
                                Once you make a purchase or subscribe to SwadesiBox, your transaction history will appear here. Maya.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {transactions.map((tx: any) => (
                            <Card key={tx.id} className="hover:shadow-md transition-shadow group border-heritage-200">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row items-stretch p-6 gap-6">
                                        {/* Type Icon */}
                                        <div className={`p-4 rounded-xl flex-shrink-0 flex items-center justify-center ${tx.type === 'Product Order' ? 'bg-blue-50 text-blue-600' : 'bg-gold-50 text-gold-700'
                                            }`}>
                                            {tx.type === 'Product Order' ? <ShoppingBag className="w-6 h-6" /> : <Box className="w-6 h-6" />}
                                        </div>

                                        {/* Main Info */}
                                        <div className="flex-grow space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Badge variant="outline" className={`${tx.type === 'Product Order' ? 'bg-blue-50 text-blue-700' : 'bg-gold-50 text-gold-800'
                                                    } border-none font-bold uppercase tracking-wider text-[10px]`}>
                                                    {tx.type}
                                                </Badge>
                                                <span className="text-heritage-300">•</span>
                                                <span className="text-sm text-heritage-500 flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {format(new Date(tx.date), 'PPP p')}
                                                </span>
                                            </div>

                                            <h3 className="text-lg font-bold text-heritage-900 truncate">
                                                {tx.reference}
                                            </h3>

                                            <div className="flex flex-wrap gap-4 text-sm">
                                                <div className="bg-heritage-100/50 px-3 py-1 rounded-md">
                                                    <span className="text-heritage-400 text-xs font-semibold mr-2">ID:</span>
                                                    <code className="text-heritage-700 font-mono text-[11px]">
                                                        {tx.orderId || tx.subscriptionId || 'N/A'}
                                                    </code>
                                                </div>
                                                <div className="flex items-center gap-1.5 px-3 py-1">
                                                    <span className="text-heritage-400 text-xs font-semibold mr-1">PAYMENT:</span>
                                                    {getStatusIcon(tx.paymentStatus)}
                                                    <span className="text-heritage-700 font-medium capitalize">
                                                        {tx.paymentStatus}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price and Status */}
                                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 pt-4 md:pt-0 min-w-[120px]">
                                            <div className="text-2xl font-black text-heritage-900">
                                                {formatPrice(tx.amount)}
                                            </div>
                                            <div className="flex items-center gap-2 bg-heritage-50 px-3 py-1.5 rounded-full border border-heritage-100">
                                                {getStatusIcon(tx.status)}
                                                <span className="text-xs font-bold uppercase tracking-tighter text-heritage-700">
                                                    {tx.status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Icon */}
                                        <div className="hidden md:flex items-center text-heritage-300 group-hover:text-heritage-600 transition-colors ml-2 cursor-pointer"
                                            onClick={() => {
                                                if (tx.orderId) router.push(`/dashboard/buyer/orders/${tx.orderId}`);
                                            }}>
                                            <ChevronRight className="w-6 h-6" />
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
