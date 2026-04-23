import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Cart from '@/models/Cart';
import User from '@/models/User';

// PUT: Update cart item quantity
export async function PUT(
    request: NextRequest,
    props: { params: Promise<{ itemId: string }> }
) {
    const params = await props.params;
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const { quantity } = await request.json();

        if (!quantity || quantity < 1) {
            return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
        }

        const currentUser = await User.findOne({ email: session.user.email });
        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const cart = await Cart.findOne({ user: currentUser._id });
        if (!cart) {
            return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
        }

        const itemIndex = cart.items.findIndex(
            item => item._id?.toString() === params.itemId
        );

        if (itemIndex === -1) {
            return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        await cart.populate({
            path: 'items.product',
            select: 'name price images isActive state seller',
            populate: [
                { path: 'state', select: 'name' },

                { path: 'seller', select: 'name businessName' }
            ]
        });

        return NextResponse.json({ cart, message: 'Quantity updated' });
    } catch (error) {
        console.error('Error updating cart item:', error);
        return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 });
    }
}

// DELETE: Remove item from cart
export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ itemId: string }> }
) {
    const params = await props.params;
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

        const cart = await Cart.findOne({ user: currentUser._id });
        if (!cart) {
            return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
        }

        cart.items = cart.items.filter(
            item => item._id?.toString() !== params.itemId
        );

        await cart.save();

        await cart.populate({
            path: 'items.product',
            select: 'name price images isActive state seller',
            populate: [
                { path: 'state', select: 'name' },

                { path: 'seller', select: 'name businessName' }
            ]
        });

        return NextResponse.json({ cart, message: 'Item removed from cart' });
    } catch (error) {
        console.error('Error removing cart item:', error);
        return NextResponse.json({ error: 'Failed to remove cart item' }, { status: 500 });
    }
}
