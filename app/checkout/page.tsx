'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

interface CartItem {
    _id: string;
    product: {
        _id: string;
        name: string;
        price: number;
        images: string[];
    };
    quantity: number;
}

import { useCart } from '@/components/providers/CartProvider';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, cartTotal, clearCart, isLoading } = useCart();
    const [submitting, setSubmitting] = useState(false);
    const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
    const [zone, setZone] = useState<number>(3); // 1: NA, 2: EU, 3: ROW

    const [shippingAddress, setShippingAddress] = useState({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
    });

    useEffect(() => {
        if (!isLoading && items.length === 0) {
            router.push('/cart');
        }

        // Load preferred country from localStorage
        const preferred = localStorage.getItem('preferred_country');
        if (preferred) {
            setShippingAddress(prev => ({ ...prev, country: preferred }));
        }
    }, [items, isLoading, router]);

    // Update Zone based on Country
    useEffect(() => {
        const country = shippingAddress.country.toLowerCase();
        if (['united states', 'usa', 'us', 'canada', 'mexico'].includes(country)) {
            setZone(1);
        } else if (['uk', 'united kingdom', 'germany', 'france', 'italy', 'spain', 'netherlands', 'europe', 'belgium', 'sweden', 'norway', 'denmark'].includes(country)) {
            setZone(2);
        } else {
            setZone(3);
        }
    }, [shippingAddress.country]);

    const calculateTax = () => {
        return items.reduce((acc, item) => {
            // 0% tax for Women Dominated Units, 12% for others
            const taxRate = item.womenDominatedUnit ? 0 : 0.12;
            return acc + (item.price * item.quantity * taxRate);
        }, 0);
    };

    const calculateShipping = () => {
        if (items.length === 0) return 0;

        // Free shipping for India
        if (shippingAddress.country.toLowerCase() === 'india') {
            return 0;
        }

        // Prices in INR (Approx conversion from USD/EUR on Shipping Page)
        switch (zone) {
            case 1: // NA
                return shippingMethod === 'standard' ? 1300 : 3000;
            case 2: // EU
                return shippingMethod === 'standard' ? 1300 : 3000;
            case 3: // ROW
                return shippingMethod === 'standard' ? 1800 : 4000;
            default:
                return 1800;
        }
    };

    const calculateTotal = () => {
        return cartTotal + calculateTax() + calculateShipping();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (items.length === 0) {
            alert('Your cart is empty');
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shippingAddress,
                    paymentMethod: 'cod',
                    shippingMethod,
                    zone
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Order placed successfully!');
                await clearCart();
                router.push(`/dashboard/buyer/orders`);
            } else {
                alert(`Failed to place order: ${data.error || 'Unknown error'}${data.details ? ` (${data.details})` : ''}`);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('An error occurred while placing your order');
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (items.length === 0) {
        return null;
    }

    const taxAmount = calculateTax();
    const shippingAmount = calculateShipping();

    return (
        <div className="min-h-screen bg-gradient-to-b from-heritage-50 to-white">
            <div className="container mx-auto px-4 py-8">
                <h1 className="heading-section mb-8">Checkout</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Shipping Address</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 space-y-2">
                                            <Label>Full Name *</Label>
                                            <Input
                                                value={shippingAddress.fullName}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="col-span-2 space-y-2">
                                            <Label>Phone Number *</Label>
                                            <Input
                                                type="tel"
                                                value={shippingAddress.phone}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="col-span-2 space-y-2">
                                            <Label>Address Line 1 *</Label>
                                            <Input
                                                value={shippingAddress.addressLine1}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="col-span-2 space-y-2">
                                            <Label>Address Line 2</Label>
                                            <Input
                                                value={shippingAddress.addressLine2}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>City *</Label>
                                            <Input
                                                value={shippingAddress.city}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>State *</Label>
                                            <Input
                                                value={shippingAddress.state}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Pincode *</Label>
                                            <Input
                                                value={shippingAddress.pincode}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Country *</Label>
                                            <Input
                                                value={shippingAddress.country}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                                                required
                                                placeholder="e.g. USA, UK, India"
                                                disabled={!!(typeof window !== 'undefined' && localStorage.getItem('preferred_country'))}
                                            />
                                            {(typeof window !== 'undefined' && localStorage.getItem('preferred_country')) && (
                                                <p className="text-[10px] text-heritage-400">Region locked from shipping selection. Clear preference to change.</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Shipping Method */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Shipping Method</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div
                                        className={`p-4 rounded-lg border-2 cursor-pointer flex justify-between items-center ${shippingMethod === 'standard' ? 'border-heritage-600 bg-heritage-50' : 'border-gray-200 hover:border-heritage-300'}`}
                                        onClick={() => setShippingMethod('standard')}
                                    >
                                        <div>
                                            <div className="font-semibold text-heritage-900">Standard Shipping</div>
                                            <div className="text-sm text-gray-600">
                                                {zone === 1 ? '10-15 Days' : zone === 2 ? '7-12 Days' : '12-20 Days'} • Normal Handling
                                            </div>
                                        </div>
                                        <div className="font-semibold text-heritage-900">
                                            ₹{(zone === 3 ? 1800 : 1300).toLocaleString()}
                                        </div>
                                    </div>

                                    <div
                                        className={`p-4 rounded-lg border-2 cursor-pointer flex justify-between items-center ${shippingMethod === 'express' ? 'border-gold-500 bg-gold-50' : 'border-gray-200 hover:border-gold-300'}`}
                                        onClick={() => setShippingMethod('express')}
                                    >
                                        <div>
                                            <div className="font-semibold text-heritage-900 flex items-center gap-2">
                                                Express Shipping <span className="text-xs bg-gold-200 text-gold-900 px-2 py-0.5 rounded-full">FAST</span>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {zone === 1 ? '5-7 Days' : zone === 2 ? '3-5 Days' : '7-10 Days'} • Priority Handling
                                            </div>
                                        </div>
                                        <div className="font-semibold text-gold-700">
                                            ₹{(zone === 3 ? 4000 : 3000).toLocaleString()}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Payment Method</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="p-4 bg-heritage-50 rounded-lg border-2 border-heritage-200">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                id="cod"
                                                name="payment"
                                                checked
                                                readOnly
                                                className="h-4 w-4"
                                            />
                                            <label htmlFor="cod" className="font-medium">
                                                Cash on Delivery (COD)
                                            </label>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2 ml-7">
                                            Pay when you receive your order
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-4">
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Items */}
                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex gap-3">
                                                <div className="relative w-16 h-16 flex-shrink-0">
                                                    <Image
                                                        src={item.image || '/placeholder.jpg'}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover rounded"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium line-clamp-1">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Qty: {item.quantity}
                                                    </p>
                                                    {item.womenDominatedUnit && (
                                                        <span className="text-[10px] bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded">
                                                            Tax Exempt
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-semibold">
                                                        ₹{(item.price * item.quantity).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t pt-4 space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-semibold">
                                                ₹{cartTotal.toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tax {taxAmount === 0 ? '(Exempt)' : '(12%)'}</span>
                                            <span className="font-semibold">
                                                ₹{taxAmount.toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Shipping ({shippingMethod})</span>
                                            <span className="font-semibold">
                                                ₹{shippingAmount.toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="border-t pt-2">
                                            <div className="flex justify-between text-lg">
                                                <span className="font-semibold">Total</span>
                                                <span className="font-bold text-heritage-600">
                                                    ₹{(cartTotal + taxAmount + shippingAmount).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        size="lg"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Placing Order...' : 'Place Order'}
                                    </Button>

                                    <p className="text-xs text-gray-500 text-center">
                                        By placing your order, you agree to our <a href="/terms" className="text-gold-600 font-medium underline hover:text-gold-700 transition-colors">Terms and Conditions</a>
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
