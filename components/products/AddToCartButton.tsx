'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { toast } from 'sonner';

interface AddToCartButtonProps {
    product: {
        id: string;
        name: string;
        price: number;
        image: string;
        maxStock: number;
        availabilityType: 'in_stock' | 'seasonal' | 'pre_order';
    };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        if (product.availabilityType === 'seasonal') {
            // For seasonal, we'll add to wishlist as a "Notify Me" action
            try {
                const response = await fetch('/api/wishlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId: product.id }),
                });

                if (response.ok) {
                    toast.success('We will notify you when this is available!', {
                        description: `${product.name} added to your wishlist`,
                    });
                } else {
                    const data = await response.json();
                    toast.error(data.error || 'Failed to set notification');
                }
            } catch (error) {
                toast.error('An error occurred');
            }
            return;
        }

        setIsAdding(true);
        const success = await addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            maxStock: product.maxStock,
            quantity: 1,
        });

        if (success) {
            toast.success(`Added ${product.name} to cart`, {
                description: "Check your cart to checkout",
                duration: 2000,
                icon: <ShoppingCart className="h-4 w-4" />,
            });
        }

        setTimeout(() => setIsAdding(false), 500);
    };

    const getButtonText = () => {
        if (isAdding) return 'Adding...';

        // Stock check only applies to in_stock items
        if (product.availabilityType === 'in_stock' && product.maxStock <= 0) {
            return 'Out of Stock';
        }

        switch (product.availabilityType) {
            case 'pre_order':
                return 'Pre-Order Now';
            case 'seasonal':
                return 'Notify Me';

            case 'in_stock':
            default:
                return 'Add to Cart';
        }
    };

    const isButtonDisabled =
        isAdding ||
        (product.availabilityType === 'in_stock' && product.maxStock <= 0);

    return (
        <Button
            size="lg"
            className={`flex-1 ${product.availabilityType === 'seasonal' ? 'bg-heritage-600 hover:bg-heritage-700' : 'bg-heritage-800 hover:bg-heritage-900'} h-14 text-lg gap-2`}
            onClick={handleAddToCart}
            disabled={isButtonDisabled}
        >
            <ShoppingCart className="h-5 w-5" />
            {getButtonText()}
        </Button>
    );
}
