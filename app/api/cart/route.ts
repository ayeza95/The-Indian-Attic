import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import User from '@/models/User';

// GET: Fetch user's cart
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const currentUser = await User.findOne({ email: session.user.email });
        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        let cart = await Cart.findOne({ user: currentUser._id })
            .populate({
                path: 'items.product',
                select: 'name price images isActive state seller womenDominatedUnit availabilityType',
                populate: [
                    { path: 'state', select: 'name' },

                    { path: 'seller', select: 'name businessName' }
                ]
            });

        if (!cart) {
            // Create empty cart if doesn't exist
            cart = await Cart.create({ user: currentUser._id, items: [] });
        }

        return NextResponse.json({ cart });
    } catch (error) {
        console.error('Error fetching cart:', error);
        return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
    }
}

// POST: Add item to cart
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const { productId, quantity = 1 } = await request.json();

        if (!productId) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        const currentUser = await User.findOne({ email: session.user.email });
        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Get product details
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        if (!product.isActive) {
            return NextResponse.json({ error: 'Product is not available' }, { status: 400 });
        }

        // Find or create cart
        let cart = await Cart.findOne({ user: currentUser._id });

        if (!cart) {
            cart = new Cart({ user: currentUser._id, items: [] });
        }

        // Check if product already in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (existingItemIndex > -1) {
            // Update quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({
                product: productId,
                quantity,
                priceAtAdd: product.price,
            });
        }

        await cart.save();

        // Populate and return
        await cart.populate({
            path: 'items.product',
            select: 'name price images isActive state seller womenDominatedUnit availabilityType',
            populate: [
                { path: 'state', select: 'name' },

                { path: 'seller', select: 'name businessName' }
            ]
        });

        return NextResponse.json({ cart, message: 'Item added to cart' });
    } catch (error) {
        console.error('Error adding to cart:', error);
        return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
    }
}

// DELETE: Clear cart
export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const currentUser = await User.findOne({ email: session.user.email });
        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        await Cart.findOneAndUpdate(
            { user: currentUser._id },
            { items: [] }
        );

        return NextResponse.json({ message: 'Cart cleared' });
    } catch (error) {
        console.error('Error clearing cart:', error);
        return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 });
    }
}
