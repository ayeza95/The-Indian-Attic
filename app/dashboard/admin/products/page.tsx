'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Package } from 'lucide-react';
import Image from 'next/image';

interface Product {
    _id: string;
    name: string;
    price: number;
    images: string[];
    isActive: boolean;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products?limit=100'); // Fetch more for admin
            const data = await res.json();
            setProducts(data.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8">Loading products...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="heading-section mb-8">Product Management</h1>
            <div className="grid grid-cols-1 gap-4">
                {products.map((product) => (
                    <Card key={product._id} className="flex flex-row items-center p-4">
                        <div className="relative w-16 h-16 mr-4">
                            {product.images[0] && (
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover rounded"
                                />
                            )}
                        </div>
                        <div className="flex-grow">
                            <h3 className="font-bold">{product.name}</h3>
                            <p className="text-sm text-gray-500">₹{product.price}</p>
                        </div>
                        <div>
                            <span className={`px-2 py-1 rounded text-xs ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {product.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
