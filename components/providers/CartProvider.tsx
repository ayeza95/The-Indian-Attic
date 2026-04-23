'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

interface CartItem {
  id: string;          // Product ID
  cartItemId?: string;  // Database Item ID
  name: string;
  price: number;
  quantity: number;
  image?: string;
  maxStock: number;
  womenDominatedUnit: boolean;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => Promise<boolean>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  cartTotal: number;
  clearCart: () => Promise<void>;
  isLoading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();

  const refreshCart = useCallback(async () => {
    if (status !== 'authenticated') {
      setItems([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        if (data.cart && data.cart.items) {
          const mappedItems: CartItem[] = data.cart.items.map((item: any) => ({
            id: item.product._id,
            cartItemId: item._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.images?.[0],
            maxStock: 100, // Default or fetch from product if available
            womenDominatedUnit: item.product.womenDominatedUnit || false,
          }));
          setItems(mappedItems);
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (item: CartItem): Promise<boolean> => {
    if (status !== 'authenticated') {
      toast.error('Please sign in to add items to cart');
      return false;
    }

    const userRole = (session?.user as any).role;
    if (userRole !== 'buyer') {
      toast.error('Only buyers can add items to cart');
      return false;
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: item.id, quantity: 1 }),
      });

      if (response.ok) {
        await refreshCart();
        return true;
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to add to cart');
        return false;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('An error occurred');
      return false;
    }
  };

  const removeFromCart = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item?.cartItemId) return;

    try {
      const response = await fetch(`/api/cart/${item.cartItemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await refreshCart();
      } else {
        toast.error('Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(id);
      return;
    }

    const item = items.find(i => i.id === id);
    if (!item?.cartItemId) return;

    try {
      const response = await fetch(`/api/cart/${item.cartItemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });

      if (response.ok) {
        await refreshCart();
      } else {
        toast.error('Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
      });
      if (response.ok) {
        setItems([]);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const cartTotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartTotal,
        clearCart,
        isLoading,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
