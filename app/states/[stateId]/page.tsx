import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import State from '@/models/State';
import Product from '@/models/Product';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';

async function getState(id: string) {
    await connectDB();
    const state = await State.findById(id).lean();
    if (!state) return null;
    return {
        ...state,
        _id: state._id.toString(),
    };
}

async function getProductsByState(stateId: string) {
    await connectDB();

    const products = await Product.find({ state: stateId, isActive: true })
        .populate('state', 'name slug')

        .sort({ createdAt: -1 })
        .lean();

    // Sanitize for Client Component transfer (handling ObjectIds, Dates, and buffer types)
    return JSON.parse(JSON.stringify(products));
}

export default async function StateDetailsPage({
    params
}: {
    params: Promise<{ stateId: string }>
}) {
    const { stateId } = await params;
    const [state, products] = await Promise.all([
        getState(stateId),
        getProductsByState(stateId)
    ]);

    if (!state) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-heritage-50 pb-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full">
                <Image
                    src={state.image}
                    alt={state.name}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-5xl md:text-7xl font-display text-white drop-shadow-lg">
                        {state.name}
                    </h1>
                </div>

                <Link href="/states" className="absolute top-8 left-8 z-10">
                    <Button variant="outline" className="bg-white/20 backdrop-blur text-white border-white/40 hover:bg-white/40">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Map
                    </Button>
                </Link>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 md:p-12 shadow-sm -mt-20 relative z-10 mb-16">
                    <h2 className="text-3xl font-display text-heritage-900 mb-6">About the Region</h2>
                    <p className="text-lg text-heritage-700 leading-relaxed whitespace-pre-wrap">
                        {state.description}
                    </p>
                </div>

                {/* Products Section */}
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-display text-heritage-900">Crafts of {state.name}</h2>
                            <p className="text-heritage-600 mt-2">Authentic treasures from this region</p>
                        </div>
                        <Link href="/products">
                            <Button variant="ghost" className="text-heritage-600 hover:text-heritage-900">
                                View All Products →
                            </Button>
                        </Link>
                    </div>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product: any) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                            <div className="text-5xl mb-4">🏺</div>
                            <h3 className="text-xl font-semibold text-heritage-900 mb-2">No products found yet</h3>
                            <p className="text-heritage-600">
                                We're currently working with artisans from {state.name} to bring their crafts to you.
                                Check back soon!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
