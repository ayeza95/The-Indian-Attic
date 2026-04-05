'use client';

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/components/providers/CartProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AddToCartButton from "@/components/products/AddToCartButton";

export default function WishlistPage() {
    const { wishlist, loading, removeFromWishlist } = useWishlist();
    const router = useRouter();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading your wishlist...</p>
            </div>
        );
    }

    if (wishlist.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12">
                <Button
                    variant="ghost"
                    className="mb-8 pl-0 hover:pl-2 transition-all"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
                </Button>

                <div className="text-center py-16">
                    <div className="w-24 h-24 bg-heritage-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Heart className="h-10 w-10 text-heritage-400" />
                    </div>
                    <h1 className="heading-section text-3xl mb-4">Your Wishlist is Empty</h1>
                    <p className="text-heritage-600 mb-8 max-w-md mx-auto">
                        Save items you love to your wishlist to revisit them later.
                    </p>
                    <Link href="/products">
                        <Button size="lg" className="bg-heritage-800 text-white hover:bg-heritage-900">
                            Explore Products
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-heritage-50/50 pb-20">
            <div className="container mx-auto px-4 py-12">
                <Button
                    variant="ghost"
                    className="mb-8 pl-0 hover:pl-2 transition-all"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
                </Button>

                <div className="flex items-center gap-3 mb-8">
                    <Heart className="h-8 w-8 text-heritage-600 fill-heritage-100" />
                    <h1 className="heading-section text-3xl">My Wishlist</h1>
                    <span className="bg-heritage-100 text-heritage-800 px-3 py-1 rounded-full text-sm font-medium">
                        {wishlist.length} Items
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlist.map((product) => (
                        <Card key={product._id} className="group overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                            <div className="relative aspect-square overflow-hidden bg-gray-100">
                                <Image
                                    src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-product.jpg'}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <button
                                    onClick={() => removeFromWishlist(product._id)}
                                    className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur rounded-full text-heritage-400 hover:text-red-500 hover:bg-white transition-colors shadow-sm"
                                    title="Remove from wishlist"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>

                            <CardContent className="p-4 flex-1">
                                <Link href={`/products/${product.slug || product._id}`}>
                                    <h3 className="font-display text-lg font-semibold text-heritage-900 line-clamp-2 mb-2 group-hover:text-heritage-700 transition-colors">
                                        {product.name}
                                    </h3>
                                </Link>
                                <p className="text-xl font-bold text-heritage-900">
                                    {formatPrice(product.price)}
                                </p>
                            </CardContent>

                            <CardFooter className="p-4 pt-0">
                                <AddToCartButton
                                    product={{
                                        id: product._id,
                                        name: product.name,
                                        price: product.price,
                                        image: product.images?.[0] || '',
                                        maxStock: product.stockQuantity || 0,
                                        availabilityType: product.availabilityType || 'in_stock'
                                    }}
                                />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
