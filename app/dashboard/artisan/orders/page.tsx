'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Image from 'next/image';
import { Package, Truck, CheckCircle, XCircle } from 'lucide-react';

interface OrderItem {
    product: {
        _id: string;
        name: string;
        images: string[];
    };
    productName: string;
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    orderNumber: string;
    buyer: {
        name: string;
        email: string;
    };
    items: OrderItem[];
    total: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
    deliveryAddress: {
        fullName: string;
        city: string;
        state: string;
    };
    shippingMethod?: string;
    tax?: number;
}

export default function ArtisanOrders() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        } else if (status === 'authenticated') {
            fetchOrders();
        }
    }, [status, router]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/orders?role=artisan');
            if (response.ok) {
                const data = await response.json();
                setOrders(data.orders || []);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId: string, newStatus: string, newPaymentStatus?: string) => {
        try {
            // We'll need a PUT endpoint or similar for order status updates
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: newStatus,
                    paymentStatus: newPaymentStatus
                }),
            });

            if (response.ok) {
                toast.success(`Order ${newStatus === 'cancelled' ? 'declined and refund triggered' : 'updated successfully'}`);
                fetchOrders();
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to update order');
            }
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    const handleSetManufactureDate = async (orderId: string, itemId: string, date: string) => {
        try {
            const response = await fetch(`/api/orders/${orderId}/manufacture/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId, date }),
            });

            if (response.ok) {
                toast.success('Manufacture date set and buyer notified');
                fetchOrders();
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to set date');
            }
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    const handleVerifyPayment = async (orderId: string, itemId: string, verified: boolean) => {
        try {
            const response = await fetch(`/api/orders/${orderId}/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId, verified }),
            });

            if (response.ok) {
                toast.success(`Payment ${verified ? 'verified' : 'unverified'}`);
                fetchOrders();
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to update verification status');
            }
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    if (status === 'loading' || loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!session) return null;

    const pendingOrders = orders.filter(o => ['pending', 'confirmed', 'processing'].includes(o.status));
    const completedOrders = orders.filter(o => ['shipped', 'delivered', 'cancelled'].includes(o.status));

    const OrderCard = ({ order }: { order: Order }) => (
        <Card key={order._id} className="border-heritage-100 mb-4 overflow-hidden">
            <div className="bg-heritage-50 px-4 py-2 border-b border-heritage-100 flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-heritage-600">{order.orderNumber}</span>
                <Badge variant={order.status === 'pending' ? 'outline' : 'default'} className="capitalize">
                    {order.status}
                </Badge>
            </div>
            <CardContent className="p-4">
                <div className="flex justify-between mb-4">
                    <div>
                        <p className="text-sm font-semibold">{order.buyer.name}</p>
                        <p className="text-xs text-gray-500">{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
                        <p className="text-xs text-gray-400 mt-1">Shipping: <span className="uppercase font-semibold">{order.shippingMethod}</span></p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-heritage-800">₹{order.total.toLocaleString()}</p>
                        <p className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                        {order.tax === 0 && <Badge variant="secondary" className="text-[10px] scale-90 origin-right">Tax Exempt</Badge>}
                    </div>
                </div>

                <div className="space-y-4 mb-4">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="relative h-10 w-10 flex-shrink-0">
                                    <Image
                                        src={item.product?.images?.[0] || '/placeholder.jpg'}
                                        alt={item.productName}
                                        fill
                                        className="object-cover rounded"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate">{item.productName}</p>
                                    <p className="text-[10px] text-gray-500">Qty: {item.quantity}</p>
                                    {/* Payment Verification */}
                                    <div className="mt-1">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={!!(item as any).paymentVerified}
                                                onChange={(e) => handleVerifyPayment(order._id, (item as any)._id, e.target.checked)}
                                                className="w-3 h-3 rounded border-gray-300 text-heritage-600 focus:ring-heritage-500"
                                            />
                                            <span className={`text-[10px] ${(item as any).paymentVerified ? 'text-green-600 font-bold' : 'text-gray-500'}`}>
                                                {(item as any).paymentVerified ? 'Payment Verified' : 'Verify Payment'}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Pre-order Logic */}
                            {/* Note: In a real app we'd need item._id here. Assuming item has _id from backend even if interface missed it */}
                            {(item.product as any).availabilityType === 'pre_order' && (
                                <div className="bg-blue-50 p-2 rounded text-xs border border-blue-100">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-semibold text-blue-800">Pre-Order Item</span>
                                        {/* Assuming item has manufactureDate if set */}
                                        {(item as any).manufactureDate ? (
                                            <span className="text-green-600 font-bold">
                                                Mfg: {new Date((item as any).manufactureDate).toLocaleDateString()}
                                            </span>
                                        ) : (
                                            <Badge variant="outline" className="text-blue-600 border-blue-200">Pending Date</Badge>
                                        )}
                                    </div>
                                    {!(item as any).manufactureDate && ['pending', 'confirmed', 'processing'].includes(order.status) && (
                                        <div className="flex gap-2 items-center mt-2">
                                            <input
                                                type="date"
                                                className="border rounded px-2 py-1 text-xs w-full"
                                                onChange={(e) => {
                                                    const dateVal = e.target.value;
                                                    toast(`Set manufacture date to ${dateVal}? This will notify the buyer.`, {
                                                        action: {
                                                            label: 'Set Date',
                                                            onClick: () => handleSetManufactureDate(order._id, (item as any)._id, dateVal)
                                                        },
                                                        cancel: { label: 'Cancel', onClick: () => {} }
                                                    });
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {['pending', 'confirmed', 'processing'].includes(order.status) && (
                    <div className="flex gap-2">
                        {order.status === 'pending' && (
                            <Button
                                size="sm"
                                className="flex-1 bg-heritage-600 hover:bg-heritage-700 text-xs"
                                onClick={() => handleUpdateStatus(order._id, 'confirmed')}
                            >
                                <CheckCircle className="h-3 w-3 mr-1" /> Confirm
                            </Button>
                        )}
                        {order.status === 'confirmed' && (
                            <Button
                                size="sm"
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs"
                                onClick={() => handleUpdateStatus(order._id, 'processing')}
                            >
                                <Package className="h-3 w-3 mr-1" /> Process
                            </Button>
                        )}
                        {order.status === 'processing' && (
                            <Button
                                size="sm"
                                className="flex-1 bg-orange-600 hover:bg-orange-700 text-xs"
                                onClick={() => handleUpdateStatus(order._id, 'shipped')}
                            >
                                <Truck className="h-3 w-3 mr-1" /> Ship
                            </Button>
                        )}
                        <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-red-600 border-red-200 hover:bg-red-50 text-xs"
                            onClick={() => {
                                                toast('Are you sure you want to decline this order? A refund will be triggered.', {
                                                    action: {
                                                        label: 'Decline Order',
                                                        onClick: () => handleUpdateStatus(order._id, 'cancelled', 'refunded')
                                                    },
                                                    cancel: { label: 'Cancel', onClick: () => {} }
                                                });
                            }}
                        >
                            <XCircle className="h-3 w-3 mr-1" /> Decline
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-heritage-50 to-white">
            <div className="container mx-auto px-4 py-8">
                <h1 className="heading-section mb-8">Customer Orders Dashboard</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Pending Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-display font-bold flex items-center gap-2">
                                <Package className="h-5 w-5 text-heritage-600" />
                                Pending Fulfillments
                            </h2>
                            <Badge variant="secondary">{pendingOrders.length}</Badge>
                        </div>

                        {pendingOrders.length === 0 ? (
                            <Card className="border-dashed border-2 border-heritage-100 bg-transparent">
                                <CardContent className="py-12 text-center text-heritage-400">
                                    <p>No active orders to fulfill</p>
                                </CardContent>
                            </Card>
                        ) : (
                            pendingOrders.map(order => <OrderCard key={order._id} order={order} />)
                        )}
                    </div>

                    {/* Completed Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-display font-bold flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-gray-400" />
                                Order History
                            </h2>
                            <Badge variant="outline">{completedOrders.length}</Badge>
                        </div>

                        {completedOrders.length === 0 ? (
                            <Card className="border-dashed border-2 border-gray-100 bg-transparent">
                                <CardContent className="py-12 text-center text-gray-400">
                                    <p>No completed or cancelled orders</p>
                                </CardContent>
                            </Card>
                        ) : (
                            completedOrders.map(order => <OrderCard key={order._id} order={order} />)
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
