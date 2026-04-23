'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Truck, CheckCircle, Clock, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface OrderItem {
    productName: string;
    quantity: number;
    price: number;
    product: {
        images: string[];
    };
}

interface Order {
    _id: string;
    orderNumber: string;
    total: number;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: string;
    createdAt: string;
    items: OrderItem[];
    estimatedDelivery: {
        minDays: number;
        maxDays: number;
    };
}

export default function BuyerOrders() {
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
            const response = await fetch('/api/orders?role=buyer');
            if (response.ok) {
                const data = await response.json();
                setOrders(data.orders || []);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="h-5 w-5 text-orange-500" />;
            case 'confirmed': return <Package className="h-5 w-5 text-blue-500" />;
            case 'processing': return <div className="h-5 w-5 rounded-full border-2 border-heritage-600 border-t-transparent animate-spin" />;
            case 'shipped': return <Truck className="h-5 w-5 text-purple-500" />;
            case 'delivered': return <CheckCircle className="h-5 w-5 text-green-500" />;
            default: return <Clock className="h-5 w-5 text-gray-500" />;
        }
    };

    const getStatusStep = (status: string) => {
        const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
        return steps.indexOf(status);
    };

    if (status === 'loading' || loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!session) return null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-heritage-50 to-white pb-12">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="heading-section">My Orders</h1>
                    <Link href="/products">
                        <Button variant="outline" className="flex items-center gap-2">
                            <ShoppingBag className="h-4 w-4" /> Continue Shopping
                        </Button>
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <Card className="border-dashed border-2 py-12">
                        <CardContent className="text-center">
                            <div className="bg-heritage-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShoppingBag className="h-8 w-8 text-heritage-300" />
                            </div>
                            <h3 className="text-xl font-bold text-heritage-900 mb-2">No orders found</h3>
                            <p className="text-heritage-600 mb-6">Looks like you haven't placed any orders yet.</p>
                            <Link href="/products">
                                <Button className="bg-heritage-600">Start Exploring Crafts</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <Card key={order._id} className="overflow-hidden border-heritage-100 hover:shadow-md transition-shadow">
                                <div className="bg-heritage-50 px-6 py-4 flex flex-wrap justify-between items-center border-b border-heritage-100 gap-4">
                                    <div className="flex gap-8">
                                        <div>
                                            <p className="text-xs text-heritage-500 uppercase font-bold tracking-wider">Order Number</p>
                                            <p className="text-sm font-mono font-bold text-heritage-900">{order.orderNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-heritage-500 uppercase font-bold tracking-wider">Placed On</p>
                                            <p className="text-sm font-bold text-heritage-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-heritage-500 uppercase font-bold tracking-wider">Total Amount</p>
                                            <p className="text-sm font-bold text-heritage-900">₹{order.total.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <Badge className={`${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-heritage-100 text-heritage-700'} capitalize px-4 py-1`}>
                                        {order.status}
                                    </Badge>
                                </div>

                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                                        {/* Status Tracker */}
                                        <div className="lg:col-span-3 space-y-8">
                                            <div className="relative pt-2">
                                                <div className="flex justify-between mb-2">
                                                    {['Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => (
                                                        <div key={idx} className="flex flex-col items-center gap-2 z-10">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${getStatusStep(order.status) >= idx ? 'bg-heritage-600 border-heritage-600 text-white' : 'bg-white border-gray-200 text-gray-300'}`}>
                                                                {getStatusStep(order.status) > idx ? <CheckCircle className="h-5 w-5" /> : idx + 1}
                                                            </div>
                                                            <span className={`text-[10px] font-bold ${getStatusStep(order.status) >= idx ? 'text-heritage-900' : 'text-gray-400'}`}>
                                                                {step}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="absolute top-[26px] left-[5%] right-[5%] h-0.5 bg-gray-100 -z-0">
                                                    <div 
                                                        className="h-full bg-heritage-600 transition-all duration-500" 
                                                        style={{ width: `${Math.min(100, getStatusStep(order.status) * 25)}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex gap-4 items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                        <div className="relative h-16 w-16 shrink-0 rounded overflow-hidden">
                                                            <Image 
                                                                src={item.product?.images?.[0] || '/placeholder.jpg'} 
                                                                alt={item.productName}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-bold truncate">{item.productName}</h4>
                                                            <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-bold text-heritage-600">₹{item.price.toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Status Summary */}
                                        <div className="lg:col-span-1 space-y-4 pt-2">
                                            <div className="bg-heritage-50 p-4 rounded-xl border border-heritage-100">
                                                <div className="flex items-center gap-3 mb-4">
                                                    {getStatusIcon(order.status)}
                                                    <h3 className="font-bold text-heritage-900 capitalize">{order.status}</h3>
                                                </div>
                                                <p className="text-xs text-heritage-600 mb-4 leading-relaxed">
                                                    {order.status === 'pending' && "Your order is placed and waiting for artisan confirmation."}
                                                    {order.status === 'confirmed' && "Artisan has confirmed your order. Materials are being gathered."}
                                                    {order.status === 'processing' && "Your heritage artifact is being meticulously handcrafted."}
                                                    {order.status === 'shipped' && "Your items are on their way to your doorstep!"}
                                                    {order.status === 'delivered' && "Order delivered. We hope you cherish your new heritage piece."}
                                                </p>
                                                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                                    <div className="bg-white p-3 rounded border border-heritage-100">
                                                        <p className="text-[10px] text-heritage-400 uppercase font-bold tracking-widest mb-1">Estimated Delivery</p>
                                                        <p className="text-sm font-bold text-heritage-900">
                                                            {new Date(new Date(order.createdAt).getTime() + order.estimatedDelivery.minDays * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                                            {' - '}
                                                            {new Date(new Date(order.createdAt).getTime() + order.estimatedDelivery.maxDays * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            <Link href={`/dashboard/buyer/messages`} className="block">
                                                <Button variant="outline" className="w-full text-xs">Help & Support</Button>
                                            </Link>
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
