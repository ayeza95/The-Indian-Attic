'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Script from 'next/script';

const tiers = [
    { value: 'basic', label: 'Basic', price: 2999 },
    { value: 'premium', label: 'Premium', price: 4999 },
    { value: 'deluxe', label: 'Deluxe', price: 7999 },
];

export default function SubscribePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [selectedTier, setSelectedTier] = useState('premium');
    const [address, setAddress] = useState({
        fullName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        phone: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        }
        if (session?.user) {
            setAddress(prev => ({
                ...prev,
                fullName: session.user.name || '',
            }));
        }
    }, [status, session, router]);

    const handleRazorpayPayment = async (orderData: any) => {
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
            amount: orderData.totalAmount * 100,
            currency: 'INR',
            name: 'The Indian Attic',
            description: `SwadesiBox ${selectedTier} Subscription`,
            order_id: orderData.razorpayOrderId,
            handler: async (response: any) => {
                try {
                    // Update: reusing the same verify endpoint
                    const verifyRes = await fetch('/api/payments/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            isSubscription: true // Hint for verify route to update SwadesiBox model
                        }),
                    });

                    if (verifyRes.ok) {
                        toast.success('Subscription active! Welcome to SwadesiBox.');
                        router.push('/dashboard/buyer');
                    } else {
                        toast.error('Payment verification failed');
                    }
                } catch (err) {
                    toast.error('Error verifying payment');
                }
            },
            prefill: {
                name: address.fullName,
                contact: address.phone,
            },
            theme: {
                color: '#7c2d12',
            },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/swadesibox/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tier: selectedTier,
                    deliveryAddress: address,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                handleRazorpayPayment(data);
            } else {
                toast.error(data.error || 'Failed to create subscription');
            }
        } catch (err) {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!session) {
        return null;
    }

    const selectedTierData = tiers.find(t => t.value === selectedTier);

    return (
        <div className="min-h-screen bg-gradient-to-b from-heritage-50 to-white">
            <div className="container mx-auto px-4 py-12 max-w-3xl">
                <h1 className="heading-section mb-8">Subscribe to SwadesiBox</h1>

                {message && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Select Your Tier</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {tiers.map((tier) => (
                                <label
                                    key={tier.value}
                                    className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-colors ${selectedTier === tier.value
                                            ? 'border-heritage-600 bg-heritage-50'
                                            : 'border-heritage-200 hover:border-heritage-400'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            name="tier"
                                            value={tier.value}
                                            checked={selectedTier === tier.value}
                                            onChange={(e) => setSelectedTier(e.target.value)}
                                            className="mr-3"
                                        />
                                        <div>
                                            <div className="font-semibold text-heritage-900">{tier.label}</div>
                                            <div className="text-sm text-heritage-600">
                                                Rs {tier.price.toLocaleString('en-IN')} / quarter
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Delivery Address</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Full Name</label>
                                    <Input
                                        value={address.fullName}
                                        onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone</label>
                                    <Input
                                        value={address.phone}
                                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Address Line 1</label>
                                <Input
                                    value={address.addressLine1}
                                    onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Address Line 2</label>
                                <Input
                                    value={address.addressLine2}
                                    onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">City</label>
                                    <Input
                                        value={address.city}
                                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">State</label>
                                    <Input
                                        value={address.state}
                                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Postal Code</label>
                                    <Input
                                        value={address.postalCode}
                                        onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Country</label>
                                <Input
                                    value={address.country}
                                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-semibold">Total (Quarterly)</span>
                                <span className="text-2xl font-bold text-heritage-900">
                                    Rs {selectedTierData?.price.toLocaleString('en-IN')}
                                </span>
                            </div>
                            <Button type="submit" className="w-full" size="lg" disabled={loading}>
                                {loading ? 'Processing...' : 'Subscribe Now'}
                            </Button>
                        </CardContent>
                    </Card>
                </form>
            </div>
            <Script
                id="razorpay-checkout"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />
        </div>
    );
}
