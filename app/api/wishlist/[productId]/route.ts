import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';
import User from '@/models/User';

// DELETE: Remove product from wishlist
export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ productId: string }> }
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

        const wishlist = await Wishlist.findOne({ user: currentUser._id });

        if (!wishlist) {
            return NextResponse.json({ error: 'Wishlist not found' }, { status: 404 });
        }

        // Remove the product
        wishlist.products = wishlist.products.filter(
            (id) => id.toString() !== params.productId
        );

        await wishlist.save();

        await wishlist.populate({
            path: 'products',
            select: 'name price images slug isActive',
            model: 'Product'
        });

        return NextResponse.json({ wishlist, message: 'Item removed from wishlist' });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
    }
}
