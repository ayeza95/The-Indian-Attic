'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function InitiateTenderPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        eligibility: '',
        demands: '',
        timeline: '',
        deliveryAddress: '',
        budget: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/tenders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success('Tender initiated successfully!');
                router.push('/dashboard/buyer/tenders');
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to initiate tender');
            }
        } catch (error) {
            console.error('Error submitting tender:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-heritage-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <Link href="/dashboard/buyer/tenders" className="flex items-center text-heritage-600 mb-6 hover:text-heritage-800 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to My Tenders
                </Link>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-serif text-heritage-900">Initiate a Tender</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="title" className="text-sm font-medium text-gray-700">
                                    Title (Tender Topic)
                                </label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g., Authentic Madhubani Paintings for Museum Display"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="description" className="text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Provide detailed description of the project..."
                                    className="min-h-[100px]"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="eligibility" className="text-sm font-medium text-gray-700">
                                    Eligibility to Accept
                                </label>
                                <Textarea
                                    id="eligibility"
                                    name="eligibility"
                                    value={formData.eligibility}
                                    onChange={handleChange}
                                    placeholder="Who can apply? (e.g., Verified Artisans, Groups, etc.)"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="demands" className="text-sm font-medium text-gray-700">
                                    Demands
                                </label>
                                <Textarea
                                    id="demands"
                                    name="demands"
                                    value={formData.demands}
                                    onChange={handleChange}
                                    placeholder="Specific requirements, quality standards, materials..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="timeline" className="text-sm font-medium text-gray-700">
                                        Time (Duration/Deadline)
                                    </label>
                                    <Input
                                        id="timeline"
                                        name="timeline"
                                        value={formData.timeline}
                                        onChange={handleChange}
                                        placeholder="e.g., 3 months, By Dec 2025"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="budget" className="text-sm font-medium text-gray-700">
                                        Budget (Approximate)
                                    </label>
                                    <Input
                                        id="budget"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        placeholder="e.g., ₹50,000 - ₹1,00,000"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="deliveryAddress" className="text-sm font-medium text-gray-700">
                                    Delivery Address
                                </label>
                                <Textarea
                                    id="deliveryAddress"
                                    name="deliveryAddress"
                                    value={formData.deliveryAddress}
                                    onChange={handleChange}
                                    placeholder="Full delivery address for the items..."
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full bg-heritage-600 hover:bg-heritage-700 text-white" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Initiating...
                                    </>
                                ) : (
                                    'Initiate Tender'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
