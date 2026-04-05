"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
    product: {
        _id: string;
        name: string;
        price: number;
        images: string[];
        slug: string;
        isActive: boolean;
        stockQuantity?: number;
    };
    className?: string;
}

export default function WishlistButton({ product, className }: WishlistButtonProps) {
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        if (product?._id) {
            setIsWishlisted(isInWishlist(product._id));
        }
    }, [isInWishlist, product?._id]);

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!product?._id) return;

        if (isWishlisted) {
            await removeFromWishlist(product._id);
        } else {
            await addToWishlist(product);
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn("rounded-full hover:bg-red-50 hover:text-red-500", className)}
            onClick={toggleWishlist}
        >
            <Heart
                className={cn("transition-colors", {
                    "fill-red-500 text-red-500": isWishlisted,
                    "text-heritage-400": !isWishlisted,
                })}
            />
        </Button>
    );
}
