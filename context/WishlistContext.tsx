"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface Product {
    _id: string;
    name: string;
    price: number;
    images: string[];
    slug: string;
    isActive: boolean;
    stockQuantity?: number;
}

interface WishlistContextType {
    wishlist: Product[];
    addToWishlist: (product: Product) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();

    useEffect(() => {
        if (session?.user) {
            fetchWishlist();
        } else {
            setLoading(false);
            setWishlist([]);
        }
    }, [session]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/wishlist");
            if (res.ok) {
                const data = await res.json();
                setWishlist(data.products || []);
            }
        } catch (error) {
            console.error("Failed to fetch wishlist", error);
        } finally {
            setLoading(false);
        }
    };

    const addToWishlist = async (product: Product) => {
        if (!session) {
            toast.error("Please sign in to add to wishlist");
            return;
        }

        if (session.user.role !== 'buyer') {
            toast.error("Only buyers can use the wishlist");
            return;
        }

        // Optimistic update
        const prevWishlist = [...wishlist];
        if (!isInWishlist(product._id)) {
            setWishlist([...wishlist, product]);
        }

        try {
            const res = await fetch("/api/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product._id }),
            });

            if (!res.ok) {
                throw new Error("Failed to add to wishlist");
            }

            toast.success("Added to wishlist");
        } catch (error) {
            setWishlist(prevWishlist); // Revert
            toast.error("Failed to add to wishlist");
        }
    };

    const removeFromWishlist = async (productId: string) => {
        if (!session) return;

        // Optimistic update
        const prevWishlist = [...wishlist];
        setWishlist(wishlist.filter((p) => p._id !== productId));

        try {
            const res = await fetch(`/api/wishlist/${productId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to remove from wishlist");
            }

            toast.success("Removed from wishlist");
        } catch (error) {
            setWishlist(prevWishlist); // Revert
            toast.error("Failed to remove from wishlist");
        }
    };

    const isInWishlist = (productId: string) => {
        return wishlist.some((p) => p._id === productId);
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                loading,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}
