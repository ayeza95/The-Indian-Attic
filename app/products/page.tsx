import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import ProductsGrid from '@/components/products/ProductsGrid';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// Register models before population
import '@/models/State';
import '@/models/User';

async function getProducts() {
    await connectDB();
    const products = await Product.find({ isActive: true, isHidden: { $ne: true } })
        .populate('state', 'name slug')

        .populate('seller', 'name businessName')
        .sort({ createdAt: -1 })
        .limit(20)
    // Sanitize for Client Component transfer (handling ObjectIds, Dates, and legacy buffer types like district)
    return JSON.parse(JSON.stringify(products));
}

export default async function ProductsPage() {
    const products = await getProducts();

    return (
        <div className="min-h-screen bg-heritage-50">
            {/* Header */}
            <div className="bg-heritage-900 text-gold-50 py-16 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="heading-display text-4xl md:text-5xl mb-4 text-gold-300">Discover Treasures</h1>
                    <p className="text-xl font-light text-heritage-200 max-w-2xl mx-auto">
                        Authentic Indian crafts, handpicked from skilled artisans across the nation.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 -mt-8">
                {products.length === 0 ? (
                    <Card className="bg-white/80 backdrop-blur shadow-lg">
                        <CardContent className="py-16 text-center">
                            <p className="text-heritage-600 mb-4 text-xl font-display">No products available yet.</p>
                            <p className="text-heritage-500">
                                Our artisans are crafting new masterpieces. Check back soon.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <ProductsGrid products={products} />
                )}
            </div>
        </div>
    );
}
