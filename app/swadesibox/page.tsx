'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Calendar, CreditCard, Clock, Activity } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { format } from 'date-fns';

const subscriptionTiers = [
    {
        name: 'Basic',
        price: 6999,
        description: 'Perfect for exploring Indian heritage',
        features: [
            '1 curated handcrafted products',
            'Regional craft theme (one state / craft cluster)',
            'Printed story cards for each product',
            'Cultural context booklet (heritage, usage, care)',
            'Free shipping within India',
            'Early-access supporter badge',
        ],
    },
    {
        name: 'Premium',
        price: 9999,
        description: 'For the passionate heritage enthusiast',
        features: [
            '2 curated handcrafted products',
            'Premium regional themes',
            'Detailed story cards (artisan + craft background)',
            'Extended cultural guide',
            'Free international shipping',
            'Behind-the-scenes artisan notes (written)',
            'Priority email support',
        ],
        popular: true,
    },
    {
        name: 'Deluxe',
        price: 14999,
        description: 'Ultimate cultural journey experience',
        features: [
            '3 curated premium handcrafted products',
            'Rare & limited-production items',
            'Comprehensive story cards',
            'Collector-grade cultural guide',
            'Free worldwide shipping',
            'Exclusive artisan stories (written + images)',
            'Early access to future workshops (no guarantee date)',
            'Priority customer support',
        ],
    },
];

export default function SwadesiBoxPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [subscription, setSubscription] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscription = async () => {
            if (session?.user?.role === 'buyer') {
                try {
                    const res = await fetch('/api/swadesibox');
                    if (res.ok) {
                        const data = await res.json();
                        setSubscription(data.subscription);
                    }
                } catch (err) {
                    console.error('Failed to fetch subscription:', err);
                }
            }
            setLoading(false);
        };

        if (status !== 'loading') {
            fetchSubscription();
        }
    }, [session, status]);

    const performUnsubscribe = async () => {
        try {
            const res = await fetch('/api/swadesibox/cancel', { method: 'POST' });
            if (res.ok) {
                toast.success('Subscription cancelled successfully. Maya.');
                // Refresh subscription data
                const subRes = await fetch('/api/swadesibox');
                if (subRes.ok) {
                    const data = await subRes.json();
                    setSubscription(data.subscription);
                }
            } else {
                toast.error('Failed to cancel subscription. Maya.');
            }
        } catch (err) {
            console.error('Cancellation error:', err);
            toast.error('An error occurred. Maya.');
        }
    };

    const handleUnsubscribe = () => {
        toast('Are you sure you want to cancel your SwadesiBox subscription? Maya.', {
            action: {
                label: 'Cancel Subscription',
                onClick: () => performUnsubscribe()
            },
            cancel: { label: 'Go Back', onClick: () => {} }
        });
    };

    const handleSubscribe = () => {
        if (status === 'unauthenticated') {
            toast.error("Please sign in to subscribe");
            router.push('/auth/login');
            return;
        }

        if (session?.user?.role !== 'buyer') {
            toast.error("Subscriptions are exclusive to buyers");
            return;
        }

        if (subscription && subscription.status === 'active') {
            toast.info("You already have an active subscription");
            return;
        }

        router.push('/swadesibox/subscribe');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-heritage-50 to-white">
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-12 max-w-3xl mx-auto">
                    <h1 className="heading-display mb-4">SwadesiBox</h1>
                    <p className="text-story text-xl mb-2">
                        A Quarterly Cultural Journey
                    </p>
                    <p className="text-heritage-600">
                        Receive curated authentic Indian products with stories that connect you to your roots.
                        Each box is a themed exploration of regional heritage, crafts, and traditions.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heritage-600"></div>
                    </div>
                ) : subscription && subscription.status === 'active' && (
                    <div className="max-w-4xl mx-auto mb-16">
                        <Card className="border-2 border-heritage-200 shadow-lg overflow-hidden">
                            <CardHeader className="bg-heritage-900 text-white flex flex-row items-center justify-between py-6">
                                <div>
                                    <CardTitle className="text-2xl font-display text-gold-300">My Subscription</CardTitle>
                                    <CardDescription className="text-heritage-200 mt-1">Manage your quarterly cultural journey</CardDescription>
                                </div>
                                <div className="bg-green-500/20 text-green-300 px-4 py-1.5 rounded-full text-sm font-medium flex items-center border border-green-500/50">
                                    <Activity className="w-4 h-4 mr-2" />
                                    {subscription.status.toUpperCase()}
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-heritage-100">
                                    <div className="p-6 space-y-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="bg-heritage-50 p-2 rounded-lg">
                                                <Calendar className="w-5 h-5 text-heritage-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-heritage-400 uppercase tracking-wider">Plan Name</p>
                                                <p className="font-bold text-heritage-900 text-lg capitalize">{subscription.tier}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="bg-heritage-50 p-2 rounded-lg">
                                                <Clock className="w-5 h-5 text-heritage-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-heritage-400 uppercase tracking-wider">Start Date</p>
                                                <p className="font-medium text-heritage-700">
                                                    {subscription.startDate ? format(new Date(subscription.startDate), 'PPP') : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="bg-heritage-50 p-2 rounded-lg">
                                                <CreditCard className="w-5 h-5 text-heritage-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-heritage-400 uppercase tracking-wider">Next Billing Date</p>
                                                <p className="font-bold text-heritage-900">
                                                    {subscription.nextBillingDate ? format(new Date(subscription.nextBillingDate), 'PPP') : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <div className="bg-heritage-50 p-2 rounded-lg">
                                                <Activity className="w-5 h-5 text-heritage-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-heritage-400 uppercase tracking-wider">Renewal Cycle</p>
                                                <p className="font-medium text-heritage-700 capitalize">{subscription.renewalCycle}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-heritage-50/50 flex flex-col justify-center gap-3">
                                        <div className="mb-2">
                                            <p className="text-xs font-semibold text-heritage-400 uppercase tracking-wider">Amount</p>
                                            <p className="text-3xl font-black text-heritage-900">
                                                Rs {Number(subscription.amount)?.toLocaleString('en-IN') || '0'}
                                            </p>
                                            <p className="text-xs text-heritage-500">per {subscription.renewalCycle}</p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="w-full border-heritage-200 text-heritage-600 hover:bg-white"
                                            onClick={() => router.push('/dashboard/buyer/transactions')}
                                        >
                                            Manage Subscription
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                                            onClick={handleUnsubscribe}
                                        >
                                            Unsubscribe
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div className="grid px-10 grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {subscriptionTiers.map((tier) => (
                        <Card
                            key={tier.name}
                            className={`relative flex flex-col transition-all duration-300 hover:scale-105 hover:z-20 ${tier.popular ? 'z-10 border-2 border-heritage-600 shadow-xl' : 'z-0'}`}
                        >
                            {tier.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="bg-heritage-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                                        Most Popular
                                    </span>
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                                <CardDescription>{tier.description}</CardDescription>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold text-heritage-900">
                                        Rs {tier.price.toLocaleString('en-IN')}
                                    </span>
                                    <span className="text-heritage-600"> / quarter</span>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col flex-1">
                                <ul className="space-y-3 mb-6 flex-1">
                                    {tier.features.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <Check className="h-5 w-5 text-heritage-600 mr-2 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm text-heritage-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    className="w-full bg-heritage-600 hover:bg-heritage-700 text-white"
                                    onClick={handleSubscribe}
                                >
                                    Subscribe Now
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mt-16 pb-12">
                    <div className="space-y-6">
                        <span className="inline-block py-1 px-3 rounded-full bg-heritage-100 text-heritage-600 text-sm font-semibold tracking-wide border border-heritage-200">
                            Our quarterly journey
                        </span>
                        <h2 className="heading-section text-3xl md:text-4xl text-heritage-900 leading-tight">
                            A curated bridge to <br /><span className="text-gold-600">Indian Heritage</span>
                        </h2>
                        <p className="text-heritage-600 text-lg leading-relaxed">
                            SwadesiBox is more than just a subscription; it's a bridge to India's rich cultural tapestry.
                            Every quarter, we carefully select rare and beautiful items that tell a story of tradition,
                            skill, and passion. By subscribing, you're not just getting products—you're supporting
                            artisans and preserving centuries-old crafts.
                        </p>
                        <div className="bg-heritage-50 p-8 rounded-3xl border border-heritage-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-200/20 rounded-full -translate-y-16 translate-x-16 blur-3xl group-hover:bg-gold-300/30 transition-colors duration-500"></div>
                            <h4 className="font-display text-xl text-heritage-900 mb-3 relative z-10">Why join SwadesiBox?</h4>
                            <p className="text-heritage-600 relative z-10 leading-relaxed">
                                Join thousands of heritage lovers who are reconnecting with their roots through our
                                thoughtfully curated quarterly boxes. Each item is a piece of history, brought to life for the modern home.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 py-4 border-t border-heritage-100">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-heritage-200 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-heritage-500 font-medium">
                                Joined by 2,000+ heritage enthusiasts
                            </p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <Card className="border-heritage-100 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl font-display text-heritage-900">How SwadesiBox Works</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-heritage-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                        1
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-heritage-900 mb-0.5">Subscribe</h3>
                                        <p className="text-sm text-heritage-600">
                                            Choose your preferred tier and complete the subscription
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-heritage-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                        2
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-heritage-900 mb-0.5">Curated Selection</h3>
                                        <p className="text-sm text-heritage-600">
                                            Our team curates authentic products based on quarterly themes
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-heritage-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                        3
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-heritage-900 mb-0.5">Delivered to You</h3>
                                        <p className="text-sm text-heritage-600">
                                            Receive your box with products and story cards every quarter
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-heritage-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                        4
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-heritage-900 mb-0.5">Experience Heritage</h3>
                                        <p className="text-sm text-heritage-600">
                                            Learn about each item's cultural significance and artisan story
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-heritage-100 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl font-display text-heritage-900 flex items-center gap-2">
                                    <span role="img" aria-label="package">📦</span> Subscription FAQs
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-1" className="border-heritage-50">
                                        <AccordionTrigger className="text-heritage-900 font-semibold hover:no-underline py-4">
                                            How many boxes will I receive?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-heritage-600 leading-relaxed pb-4">
                                            You will receive one curated handcrafted box per quarter.
                                            Each box is thoughtfully themed and features authentic Indian crafts.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-2" className="border-heritage-50">
                                        <AccordionTrigger className="text-heritage-900 font-semibold hover:no-underline py-4">
                                            Are shipping charges included?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-heritage-600 leading-relaxed pb-4">
                                            Yes. All shipping charges are included in your subscription price.
                                            There are no additional delivery fees.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-3" className="border-heritage-50">
                                        <AccordionTrigger className="text-heritage-900 font-semibold hover:no-underline py-4">
                                            Are taxes included in the price?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-heritage-600 leading-relaxed pb-4">
                                            Yes. All applicable taxes are included in the displayed subscription price.
                                            What you see is what you pay.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-4" className="border-heritage-50">
                                        <AccordionTrigger className="text-heritage-900 font-semibold hover:no-underline py-4">
                                            When will my box be delivered?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-heritage-600 leading-relaxed pb-4">
                                            Your box will be delivered within 15–30 days from the theme announcement for that quarter.
                                            You will be notified once the box is ready for dispatch.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
