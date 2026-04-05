'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { formatPrice } from '@/lib/utils';
import { ChevronLeft, Package, MapPin, Truck, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function BuyerOrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = use(params);
    const { data: session, status } = useSession();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user && orderId) {
            fetchOrder();
        }
    }, [session, orderId]);

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/orders/${orderId}`);
            if (res.ok) {
                const data = await res.json();
                setOrder(data.order);
            } else {
                toast.error('Failed to fetch order details');
                router.push('/dashboard/buyer/transactions');
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-heritage-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heritage-600"></div>
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="min-h-screen bg-heritage-50 pb-12">
            <div className="container mx-auto px-4 py-8">
                <Button
                    variant="ghost"
                    className="mb-6 hover:bg-heritage-100 text-heritage-800"
                    onClick={() => router.back()}
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Transactions
                </Button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-heritage-900">
                            Order #{order.orderNumber}
                        </h1>
                        <p className="text-heritage-600 mt-1">
                            Placed on {format(new Date(order.createdAt), 'PPP')}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Badge variant="outline" className="text-lg py-1 px-4 border-heritage-300">
                            Status: <span className="font-bold ml-2 uppercase text-heritage-800">{order.status}</span>
                        </Badge>
                        <Badge className={`${order.paymentStatus === 'completed' ? 'bg-green-600' : 'bg-heritage-600'
                            } text-lg py-1 px-4 text-white`}>
                            Payment: <span className="font-bold ml-2 uppercase">{order.paymentStatus}</span>
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="w-5 h-5 text-heritage-600" />
                                    Order Items
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {order.items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex flex-col sm:flex-row gap-4 py-4 border-b last:border-0">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-heritage-900">{item.productName}</h3>
                                            <p className="text-heritage-600 text-sm mb-2">Sold by: {item.product?.seller?.businessName || 'Artisan'}</p>
                                            <div className="flex items-center gap-4 text-sm mt-2">
                                                <Badge variant="secondary">Qty: {item.quantity}</Badge>
                                                <span className="font-mono">{formatPrice(item.price)} each</span>
                                            </div>
                                            {item.artisanTip > 0 && (
                                                <p className="text-gold-600 text-sm mt-2 font-medium">
                                                    + {formatPrice(item.artisanTip)} tip to artisan
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right min-w-[120px]">
                                            <p className="font-bold text-xl text-heritage-900">
                                                {formatPrice((item.price * item.quantity) + (item.artisanTip || 0))}
                                            </p>
                                            {/* Payment verification status for this item */}
                                            <div className="mt-2 flex justify-end">
                                                {item.paymentVerified ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        Verified
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                                                        <Clock className="w-3 h-3" />
                                                        Pending Verification
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Order Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between text-heritage-700">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-heritage-700">
                                    <span>Shipping</span>
                                    <span>{formatPrice(order.shippingCost)}</span>
                                </div>
                                <div className="flex justify-between text-heritage-700">
                                    <span>Tax</span>
                                    <span>{formatPrice(order.tax)}</span>
                                </div>
                                {order.artisanTips > 0 && (
                                    <div className="flex justify-between text-gold-600 font-medium">
                                        <span>Artisan Tips</span>
                                        <span>{formatPrice(order.artisanTips)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-heritage-700 border-t pt-3 mt-3">
                                    <span className="font-bold text-lg">Total</span>
                                    <span className="font-bold text-lg text-heritage-900">{formatPrice(order.total)}</span>
                                </div>
                                <p className="text-[10px] text-heritage-400 mt-4 text-center">
                                    By placing this order, you agreed to our <a href="/terms" className="text-gold-600 font-medium underline hover:text-gold-700 transition-colors">Terms and Conditions</a>.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <MapPin className="w-4 h-4 text-heritage-600" />
                                    Delivery Address
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-heritage-600 space-y-1">
                                <p className="font-bold text-heritage-900">{order.deliveryAddress.fullName}</p>
                                <p>{order.deliveryAddress.addressLine1}</p>
                                {order.deliveryAddress.addressLine2 && <p>{order.deliveryAddress.addressLine2}</p>}
                                <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.postalCode}</p>
                                <p>{order.deliveryAddress.country}</p>
                                <p className="mt-2">{order.deliveryAddress.phone}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Truck className="w-4 h-4 text-heritage-600" />
                                    Shipping Info
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-heritage-600 space-y-2">
                                <p>
                                    <span className="font-semibold">Method:</span>{' '}
                                    <span className="capitalize">{order.shippingMethod}</span>
                                </p>
                                <p>
                                    <span className="font-semibold">Estimated Delivery:</span>{' '}
                                    {order.estimatedDelivery?.minDays}-{order.estimatedDelivery?.maxDays} days
                                </p>
                                {order.trackingNumber && (
                                    <div className="bg-heritage-50 p-3 rounded-md mt-2">
                                        <p className="text-xs font-semibold text-heritage-500 uppercase">Tracking Number</p>
                                        <p className="font-mono text-heritage-900">{order.trackingNumber}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
