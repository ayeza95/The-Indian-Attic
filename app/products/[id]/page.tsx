import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Review from '@/models/Review';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Truck, ShieldCheck, Heart } from 'lucide-react';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewForm from '@/components/reviews/ReviewForm';
import AddToCartButton from '@/components/products/AddToCartButton';
import { auth } from '@/lib/auth';
import WishlistButton from "@/components/wishlist/WishlistButton";

// Force dynamic rendering since we are fetching data based on params and session
export const dynamic = 'force-dynamic';

async function getProductAndReviews(id: string) {
    await connectDB();
    const product = await Product.findById(id).populate('seller', 'name').lean();
    if (!product) return null;

    const reviews = await Review.find({ product: id, isApproved: true })
        .populate('buyer', 'name image')
        .sort({ createdAt: -1 })
        .lean();

    return {
        product: JSON.parse(JSON.stringify(product)),
        reviews: JSON.parse(JSON.stringify(reviews))
    };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = await getProductAndReviews(id);
    const session = await auth();

    if (!data) return notFound();

    const { product, reviews } = data;

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc: number, r: any) => acc + r.overallRating, 0) / reviews.length).toFixed(1)
        : '0.0';

    return (
        <div className="min-h-screen bg-heritage-50 pb-20 pt-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    {/* Image Gallery (Simplified for now to show main image) */}
                    <div className="space-y-4">
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-lg border border-heritage-100">
                            {product.images?.[0] ? (
                                <>
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    <div className="absolute top-4 right-4 z-10">
                                        <WishlistButton
                                            product={{
                                                _id: product._id,
                                                name: product.name,
                                                price: product.price,
                                                images: product.images,
                                                slug: product.slug || '',
                                                isActive: product.isActive,
                                                stockQuantity: product.stockQuantity || 0
                                            }}
                                            className="bg-white/90 backdrop-blur shadow-sm"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="h-full w-full flex items-center justify-center bg-heritage-100 text-heritage-400">
                                    No Image Available
                                </div>
                            )}
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {product.images?.map((img: string, idx: number) => (
                                <div key={idx} className="relative h-20 w-20 rounded-lg overflow-hidden border border-heritage-200 shrink-0 cursor-pointer hover:border-heritage-400">
                                    <Image src={img} alt={`${product.name} view ${idx}`} fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="heading-display text-4xl text-heritage-900 mb-2">{product.name}</h1>
                                    <div className="flex items-center gap-2 text-sm text-heritage-600">
                                        <span className="flex items-center text-terracotta-500 font-bold">
                                            {averageRating} <Star className="h-4 w-4 fill-terracotta-500 ml-1" />
                                        </span>
                                        <span>• {reviews.length} Reviews</span>
                                        <span>• By {product.seller?.name || 'Local Artisan'}</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-heritage-900 mt-6">₹{product.price}</p>
                        </div>

                        <div className="prose prose-stone max-w-none text-heritage-700">
                            <p>{product.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white rounded-xl border border-heritage-100 flex items-center gap-3">
                                <Truck className="h-6 w-6 text-heritage-600" />
                                <div>
                                    <p className="font-bold text-heritage-900">Fast Shipping</p>
                                    <p className="text-xs text-heritage-500">Global delivery available</p>
                                </div>
                            </div>
                            <div className="p-4 bg-white rounded-xl border border-heritage-100 flex items-center gap-3">
                                <ShieldCheck className="h-6 w-6 text-heritage-600" />
                                <div>
                                    <p className="font-bold text-heritage-900">Authentic 100%</p>
                                    <p className="text-xs text-heritage-500">Verified Artisan Sourced</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <AddToCartButton
                                product={{
                                    id: product._id,
                                    name: product.name,
                                    price: product.price,
                                    image: product.images?.[0] || '',
                                    maxStock: product.stockQuantity || 0,
                                    availabilityType: product.availabilityType
                                }}
                            />
                            {/* <Button size="icon" variant="outline" className="h-14 w-14 border-heritage-200">
                                <Heart className="h-6 w-6 text-heritage-600" />
                            </Button> */}
                        </div>
                    </div>
                </div>

                {/* Story Section */}
                <section className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-16 border border-heritage-100">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <span className="text-heritage-500 font-medium tracking-wider uppercase text-sm">The Story Behind The Craft</span>
                        <h2 className="heading-section text-3xl md:text-4xl text-heritage-900">A Tradition Preserved</h2>
                        <p className="text-story text-lg leading-relaxed text-heritage-700">
                            {product.story}
                        </p>
                        <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                            {product.authenticityTags?.map((tag: string, i: number) => (
                                <div key={i} className="bg-heritage-50 py-3 px-4 rounded-lg font-medium text-heritage-800 capitalize">
                                    {tag.replace(/_/g, ' ')}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Reviews Section */}
                <section id="reviews" className="max-w-4xl mx-auto">
                    <h2 className="heading-section text-3xl mb-8">Customer Reviews</h2>
                    <div className="grid gap-12">
                        <ReviewList reviews={reviews} />

                        {session ? (
                            <div className="mt-8">
                                <ReviewForm productId={product._id} />
                                {/* Note: In a real app we'd trigger a re-fetch or use router.refresh() which is handled in the form */}
                            </div>
                        ) : (
                            <div className="bg-heritage-100 p-8 rounded-xl text-center">
                                <p className="text-heritage-800 mb-4">Please sign in to write a review</p>
                                <Link href="/auth/login">
                                    <Button variant="outline">Sign In</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
