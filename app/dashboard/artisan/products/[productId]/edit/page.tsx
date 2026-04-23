'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface State {
    _id: string;
    name: string;
}

export default function EditProductPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const productId = params.productId as string;

    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState<string[]>([]);
    const [states, setStates] = useState<State[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        story: '',
        price: '',
        state: '',
        culturalUsage: [] as string[],
        culturalContext: '',
        artisanLineage: '',
        generationalCraft: false,
        yearsOfTradition: '',
        authenticityTags: [] as string[],
        giRegistration: '',
        craftStatus: 'stable',
        craftStatusExplanation: '',
        locallyFamousGloballyRare: false,
        womenDominatedUnit: false,
        availabilityType: 'in_stock',
        stockQuantity: '',
        exportSuitable: true,
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        } else if (status === 'authenticated') {
            fetchStates();
            fetchProduct();
        }
    }, [status, session, router, productId]);

    const fetchStates = async () => {
        try {
            const response = await fetch('/api/states');
            if (response.ok) {
                const data = await response.json();
                setStates(data.states || []);
            }
        } catch (error) {
            console.error('Error fetching states:', error);
        }
    };

    const fetchProduct = async () => {
        try {
            const response = await fetch(`/api/products/${productId}`);
            if (response.ok) {
                const data = await response.json();
                const product = data.product;

                setFormData({
                    name: product.name,
                    description: product.description,
                    story: product.story,
                    price: product.price.toString(),
                    state: product.state?._id || product.state,
                    culturalUsage: product.culturalUsage || [],
                    culturalContext: product.culturalContext || '',
                    artisanLineage: product.artisanLineage || '',
                    generationalCraft: product.generationalCraft || false,
                    yearsOfTradition: product.yearsOfTradition?.toString() || '',
                    authenticityTags: product.authenticityTags || [],
                    giRegistration: product.giRegistration || '',
                    craftStatus: product.craftStatus || 'stable',
                    craftStatusExplanation: product.craftStatusExplanation || '',
                    locallyFamousGloballyRare: product.locallyFamousGloballyRare || false,
                    womenDominatedUnit: product.womenDominatedUnit || false,
                    availabilityType: product.availabilityType || 'in_stock',
                    stockQuantity: product.stockQuantity?.toString() || '',
                    exportSuitable: product.exportSuitable !== undefined ? product.exportSuitable : true,
                });
                setImages(product.images || []);
            } else {
                toast.error('Product not found');
                router.push('/dashboard/artisan/products');
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Error loading product');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        setUploading(true);
        const uploadedUrls: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const uploadFormData = new FormData();
            uploadFormData.append('file', files[i]);

            try {
                const response = await fetch('/api/upload/image', {
                    method: 'POST',
                    body: uploadFormData,
                });

                const data = await response.json();
                if (response.ok) {
                    uploadedUrls.push(data.url);
                } else {
                    toast.error(`Failed to upload image: ${data.error}`);
                }
            } catch (error) {
                toast.error('Upload failed. Please try again.');
            }
        }

        setImages([...images, ...uploadedUrls]);
        setUploading(false);
    };

    const toggleArrayField = (field: 'culturalUsage' | 'authenticityTags', value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(value)
                ? prev[field].filter(v => v !== value)
                : [...prev[field], value]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (images.length === 0) {
            toast.error('Please upload at least one product image');
            return;
        }

        setSubmitting(true);

        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                yearsOfTradition: formData.yearsOfTradition ? parseInt(formData.yearsOfTradition) : undefined,
                stockQuantity: formData.stockQuantity ? parseInt(formData.stockQuantity) : undefined,
                images: images,
            };

            const response = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });

            if (response.ok) {
                toast.success('Product updated successfully!');
                router.push('/dashboard/artisan/products');
            } else {
                const error = await response.json();
                toast.error(`Failed to update product: ${error.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred while updating the product');
        } finally {
            setSubmitting(false);
        }
    };

    if (status === 'loading' || loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    const culturalUsageOptions = [
        { value: 'festival', label: 'Festival' },
        { value: 'ritual', label: 'Ritual' },
        { value: 'daily_life', label: 'Daily Life' },
        { value: 'wedding', label: 'Wedding' },
        { value: 'housewarming', label: 'Housewarming' },
        { value: 'religious', label: 'Religious' },
        { value: 'decorative', label: 'Decorative' },
        { value: 'functional', label: 'Functional' },
    ];

    const authenticityTagOptions = [
        { value: 'handmade', label: 'Handmade' },
        { value: 'gi_tagged', label: 'GI Tagged' },
        { value: 'natural', label: 'Natural Materials' },
        { value: 'direct_from_artisan', label: 'Direct from Artisan' },
        { value: 'organic', label: 'Organic' },
        { value: 'traditional_method', label: 'Traditional Method' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-heritage-50 to-white">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="heading-section mb-8">Edit Product</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Images */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Images *</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Upload Photos</Label>
                                <Input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                                {uploading && <p className="text-sm text-heritage-600">Uploading...</p>}
                            </div>

                            {images.length > 0 && (
                                <div className="grid grid-cols-3 gap-4">
                                    {images.map((url, index) => (
                                        <div key={index} className="relative aspect-square group">
                                            <img
                                                src={url}
                                                alt={`Product ${index + 1}`}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setImages(images.filter((_, i) => i !== index))}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Basic Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Product Name *</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Description *</Label>
                                <textarea
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Product Story *</Label>
                                <textarea
                                    className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={formData.story}
                                    onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Price (₹) *</Label>
                                <Input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Geographic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Geographic Origin</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>State *</Label>
                                <select
                                    value={formData.state}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    required
                                >
                                    <option value="">Select State</option>
                                    {states.map(state => (
                                        <option key={state._id} value={state._id}>{state.name}</option>
                                    ))}
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Cultural Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Cultural Context</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Cultural Usage * (Select all that apply)</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {culturalUsageOptions.map(option => (
                                        <div key={option.value} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`usage-${option.value}`}
                                                checked={formData.culturalUsage.includes(option.value)}
                                                onCheckedChange={() => toggleArrayField('culturalUsage', option.value)}
                                            />
                                            <label htmlFor={`usage-${option.value}`} className="text-sm">
                                                {option.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Cultural Context *</Label>
                                <textarea
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    value={formData.culturalContext}
                                    onChange={(e) => setFormData({ ...formData, culturalContext: e.target.value })}
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Artisan Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Artisan Heritage</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Artisan Lineage *</Label>
                                <textarea
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    value={formData.artisanLineage}
                                    onChange={(e) => setFormData({ ...formData, artisanLineage: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="generationalCraft"
                                    checked={formData.generationalCraft}
                                    onCheckedChange={(checked) => setFormData({ ...formData, generationalCraft: checked as boolean })}
                                />
                                <label htmlFor="generationalCraft" className="text-sm font-medium">
                                    Generational craft passed down through family
                                </label>
                            </div>

                            {formData.generationalCraft && (
                                <div className="space-y-2">
                                    <Label>Years of Tradition</Label>
                                    <Input
                                        type="number"
                                        value={formData.yearsOfTradition}
                                        onChange={(e) => setFormData({ ...formData, yearsOfTradition: e.target.value })}
                                        min="0"
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Authenticity & Craft Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Authenticity & Craft Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Authenticity Tags (Select all that apply)</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {authenticityTagOptions.map(option => (
                                        <div key={option.value} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`auth-${option.value}`}
                                                checked={formData.authenticityTags.includes(option.value)}
                                                onCheckedChange={() => toggleArrayField('authenticityTags', option.value)}
                                            />
                                            <label htmlFor={`auth-${option.value}`} className="text-sm">
                                                {option.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Craft Status *</Label>
                                <select
                                    value={formData.craftStatus}
                                    onChange={(e) => setFormData({ ...formData, craftStatus: e.target.value })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    required
                                >
                                    <option value="stable">Stable</option>
                                    <option value="declining">Declining</option>
                                    <option value="endangered">Endangered</option>
                                    <option value="critically_rare">Critically Rare</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label>Craft Status Explanation *</Label>
                                <textarea
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    value={formData.craftStatusExplanation}
                                    onChange={(e) => setFormData({ ...formData, craftStatusExplanation: e.target.value })}
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Special Indicators */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Special Indicators</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="locallyRare"
                                    checked={formData.locallyFamousGloballyRare}
                                    onCheckedChange={(checked) => setFormData({ ...formData, locallyFamousGloballyRare: checked as boolean })}
                                />
                                <label htmlFor="locallyRare" className="text-sm">
                                    Locally Famous, Globally Rare
                                </label>
                            </div>

                            <div className="flex items-center space-x-2 p-4 bg-heritage-50 rounded-lg border-2 border-heritage-200">
                                <Checkbox
                                    id="womenDominated"
                                    checked={formData.womenDominatedUnit}
                                    onCheckedChange={(checked) => setFormData({ ...formData, womenDominatedUnit: checked as boolean })}
                                />
                                <div className="flex-1">
                                    <label htmlFor="womenDominated" className="text-sm font-medium block">
                                        Woman-Owned/Dominated Business
                                    </label>
                                    <p className="text-xs text-heritage-600 mt-1">
                                        ✓ Tariff-free benefits from Indian Government
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Availability</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Availability Type *</Label>
                                <select
                                    value={formData.availabilityType}
                                    onChange={(e) => setFormData({ ...formData, availabilityType: e.target.value as any })}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    required
                                >
                                    <option value="in_stock">In Stock</option>
                                    <option value="seasonal">Seasonal</option>
                                    <option value="pre_order">Pre-Order</option>
                                </select>
                            </div>

                            {formData.availabilityType === 'in_stock' && (
                                <div className="space-y-2">
                                    <Label>Stock Quantity</Label>
                                    <Input
                                        type="number"
                                        value={formData.stockQuantity}
                                        onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                                        min="0"
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex gap-4">
                        <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" size="lg" disabled={submitting || uploading}>
                            {submitting ? 'Updating Product...' : 'Update Product'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
