'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { toast } from 'sonner';
import { BarChart3, IndianRupee, PackageCheck, TrendingUp } from 'lucide-react';

interface Analytics {
    totalProducts: number;
    activeProducts: number;
    totalUnitsSold: number;
    totalRevenue: number;
    topProduct: string;
}

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    isActive: boolean;
    craftStatus: string;
    state: { name: string };

}

export default function ArtisanProducts() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        }
        if (status === 'authenticated') {
            fetchProducts();
            fetchAnalytics();
        }
    }, [status, router]);

    const fetchAnalytics = async () => {
        try {
            const response = await fetch('/api/artisan/analytics/products');
            if (response.ok) {
                const data = await response.json();
                setAnalytics(data.analytics);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products?seller=' + session?.user?.id);
            if (response.ok) {
                const data = await response.json();
                setProducts(data.products || []);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId: string) => {
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                toast.success('Product deleted successfully');
                fetchProducts();
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to delete product');
            }
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    if (status === 'loading' || loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-heritage-50 to-white">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="heading-section">My Products</h1>
                    <Link href="/dashboard/artisan/products/new">
                        <Button>Add New Product</Button>
                    </Link>
                </div>

                {/* Analytics Dashboard */}
                {analytics && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <Card className="bg-heritage-50 border-heritage-200 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6 flex flex-col justify-center h-full">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-sm font-medium text-heritage-600">Total Products</div>
                                    <div className="p-2 bg-heritage-100 rounded-lg"><PackageCheck className="w-5 h-5 text-heritage-700" /></div>
                                </div>
                                <div className="text-3xl font-black text-heritage-900">{analytics.totalProducts}</div>
                                <div className="text-xs text-heritage-500 mt-2 font-medium">{analytics.activeProducts} Active Listings</div>
                            </CardContent>
                        </Card>
                        
                        <Card className="bg-green-50 border-green-200 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6 flex flex-col justify-center h-full">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-sm font-medium text-green-700">Total Revenue</div>
                                    <div className="p-2 bg-green-100 rounded-lg"><IndianRupee className="w-5 h-5 text-green-700" /></div>
                                </div>
                                <div className="text-3xl font-black text-green-900">₹{analytics.totalRevenue.toLocaleString('en-IN')}</div>
                                <div className="text-xs text-green-600 mt-2 font-medium">Lifetime Earnings</div>
                            </CardContent>
                        </Card>
                        
                        <Card className="bg-blue-50 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6 flex flex-col justify-center h-full">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-sm font-medium text-blue-700">Units Sold</div>
                                    <div className="p-2 bg-blue-100 rounded-lg"><BarChart3 className="w-5 h-5 text-blue-700" /></div>
                                </div>
                                <div className="text-3xl font-black text-blue-900">{analytics.totalUnitsSold}</div>
                                <div className="text-xs text-blue-600 mt-2 font-medium">Units shipped & pending</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-yellow-50 border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6 flex flex-col justify-center h-full">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-sm font-medium text-yellow-700">Top Product</div>
                                    <div className="p-2 bg-yellow-100 rounded-lg"><TrendingUp className="w-5 h-5 text-yellow-700" /></div>
                                </div>
                                <div className="text-lg font-bold text-yellow-900 leading-tight line-clamp-2">{analytics.topProduct}</div>
                                <div className="text-xs text-yellow-600 mt-2 font-medium">By sales volume</div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {products.length === 0 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Product Listings</CardTitle>
                        </CardHeader>
                        <CardContent className="py-12 text-center">
                            <p className="text-heritage-600 mb-4">No products listed yet</p>
                            <p className="text-sm text-heritage-500 mb-4">
                                Start by adding your first product to showcase your crafts
                            </p>
                            <Link href="/dashboard/artisan/products/new">
                                <Button>Add Your First Product</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <Card key={product._id} className="overflow-hidden flex flex-col">
                                <div className="relative h-48 w-full">
                                    <Image
                                        src={product.images[0] || '/placeholder.jpg'}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                                        {!product.isActive && (
                                            <div className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                                                Inactive
                                            </div>
                                        )}
                                        {(product as any).isHidden && (
                                            <div className="bg-gray-800 text-white px-2 py-1 rounded text-xs">
                                                Hidden by Admin
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-lg">{product.name}</CardTitle>
                                    <p className="text-sm text-gray-500">
                                        {product.state?.name}
                                    </p>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col">
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {product.description}
                                    </p>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-lg font-semibold text-heritage-600">
                                            ₹{product.price.toLocaleString()}
                                        </span>
                                        <span className="text-xs bg-heritage-100 text-heritage-700 px-2 py-1 rounded">
                                            {product.craftStatus}
                                        </span>
                                    </div>
                                    <div className="mt-auto flex flex-col gap-2">
                                        <div className="flex gap-2">
                                            <Link href={`/dashboard/artisan/products/${product._id}/edit`} className="flex-1">
                                                <Button variant="outline" className="w-full" size="sm">
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    toast('Are you sure you want to delete this product?', {
                                                        action: {
                                                            label: 'Delete',
                                                            onClick: () => handleDelete(product._id)
                                                        },
                                                        cancel: { label: 'Cancel', onClick: () => {} }
                                                    });
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                        {(product as any).availabilityType === 'seasonal' && (
                                            <Button
                                                className="w-full bg-heritage-600 hover:bg-heritage-700 text-xs"
                                                size="sm"
                                                onClick={async () => {
                                                    const season = prompt("Enter the season (e.g., Summer, Winter) for availability:");
                                                    if (!season) return;

                                                    const response = await fetch(`/api/products/${product._id}/notify`, {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ season })
                                                    });
                                                    if (response.ok) {
                                                        const data = await response.json();
                                                        toast.success(data.message || 'Notification sent!');
                                                    } else {
                                                        toast.error('Failed to send notification');
                                                    }
                                                }}
                                            >
                                                Notify Interested Buyers
                                            </Button>
                                        )}
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
