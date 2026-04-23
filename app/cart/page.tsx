'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/components/providers/CartProvider';
import { useWishlist } from "@/context/WishlistContext";
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
    const router = useRouter();
    const { items, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const { addToWishlist } = useWishlist();

    const handleCheckout = () => {
        // TODO: Add your Auth check here
        // const { user } = useAuth();

        // 1. AUTH CHECK
        // if (!user) {
        //     toast.error("Please log in to checkout");
        //     router.push('/signin');
        //     return; // <--- CRITICAL: Stops execution.
        // }

        // 2. SUCCESS ACTION
        router.push('/checkout');
    };

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-24 text-center">
                <div className="w-24 h-24 bg-heritage-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag className="h-10 w-10 text-heritage-600" />
                </div>
                <h1 className="heading-section text-3xl mb-4">Your Cart is Empty</h1>
                <p className="text-heritage-600 mb-8 max-w-md mx-auto">
                    It looks like you haven't discovered our treasures yet. Explore our collection of authentic Indian heritage products.
                </p>
                <Link href="/products">
                    <Button size="lg" className="bg-heritage-800 text-white hover:bg-heritage-900">
                        Start Shopping
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="heading-section text-3xl mb-8">Shopping Cart ({items.length} items)</h1>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-6">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-6 p-6 bg-white rounded-xl border border-heritage-100 shadow-sm relative group">
                            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-heritage-200">
                                {item.image ? (
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center bg-heritage-50 text-xs text-heritage-400">
                                        No Image
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-heritage-900 text-lg">{item.name}</h3>
                                        <p className="text-heritage-500 text-sm">₹{item.price}</p>
                                    </div>
                                    <div className="flex flex-col gap-2 items-end">
                                        <button
                                            onClick={async () => await removeFromCart(item.id)}
                                            className="text-heritage-400 hover:text-red-500 transition-colors p-1 flex items-center gap-1 text-sm"
                                            aria-label="Remove item"
                                        >
                                            <Trash2 className="h-4 w-4" /> Remove
                                        </button>
                                        <button
                                            onClick={async () => {
                                                // TODO: Add Auth check here
                                                // const { user } = useAuth();
                                                // if (!user) {
                                                //     toast.error("Please log in to use wishlist");
                                                //     return; // <--- CRITICAL: Stops execution here
                                                // }

                                                await addToWishlist({
                                                    _id: item.id,
                                                    name: item.name,
                                                    price: item.price,
                                                    images: item.image ? [item.image] : [],
                                                    slug: "",
                                                    isActive: true
                                                });
                                                removeFromCart(item.id);
                                                // toast.success("Moved to wishlist");
                                            }}
                                            className="text-heritage-400 hover:text-heritage-700 transition-colors p-1 flex items-center gap-1 text-sm"
                                            aria-label="Move to wishlist"
                                        >
                                            <Heart className="h-4 w-4" /> Move to Wishlist
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 mt-4">
                                    <div className="flex items-center border border-heritage-200 rounded-lg overflow-hidden">
                                        <button
                                            onClick={async () => await updateQuantity(item.id, item.quantity - 1)}
                                            className="p-2 hover:bg-heritage-50 text-heritage-600 transition-colors disabled:opacity-50"
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="w-12 text-center font-medium text-heritage-900">{item.quantity}</span>
                                        <button
                                            onClick={async () => await updateQuantity(item.id, item.quantity + 1)}
                                            className="p-2 hover:bg-heritage-50 text-heritage-600 transition-colors"
                                            disabled={item.quantity >= item.maxStock}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="border-l border-heritage-200 pl-4 ml-auto">
                                        <span className="font-bold text-lg text-heritage-900">₹{(item.price || 0) * (item.quantity || 1)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <Button
                        variant="ghost"
                        onClick={clearCart}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                        Clear Cart
                    </Button>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-heritage-50 p-6 rounded-xl border border-heritage-200 sticky top-24">
                        <h2 className="font-display text-xl font-semibold mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-heritage-600">
                                <span>Subtotal</span>
                                <span>₹{cartTotal || 0}</span>
                            </div>
                            <div className="flex justify-between text-heritage-600">
                                <span>Shipping</span>
                                <span>Calculated at checkout</span>
                            </div>
                            <div className="border-t border-heritage-200 pt-4 flex justify-between items-center font-bold text-lg text-heritage-900">
                                <span>Total</span>
                                <span>₹{cartTotal || 0}</span>
                            </div>
                        </div>

                        <Button
                            size="lg"
                            className="w-full bg-heritage-800 hover:bg-heritage-900 py-6 text-lg shadow-lg shadow-heritage-900/10"
                            onClick={handleCheckout}
                        >
                            Proceed to Checkout
                        </Button>

                        <p className="text-xs text-heritage-400 text-center mt-4">
                            Secure Checkout powered by SwadesiBox
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
