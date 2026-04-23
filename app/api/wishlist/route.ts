import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';
import User from '@/models/User';

// GET: Get user's wishlist
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

        let wishlist = await Wishlist.findOne({ user: currentUser._id })
            .populate({
                path: 'products',
                select: 'name price images slug isActive stockQuantity',
                model: 'Product'
            });

        if (!wishlist) {
            // Return empty wishlist instead of 404 for better UX
            return NextResponse.json({ products: [] });
        }

        return NextResponse.json(wishlist);
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
    }
}

// POST: Add product to wishlist
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const { productId } = await request.json();

        if (!productId) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        const currentUser = await User.findOne({ email: session.user.email });
        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        let wishlist = await Wishlist.findOne({ user: currentUser._id });

        if (!wishlist) {
            wishlist = new Wishlist({
                user: currentUser._id,
                products: [productId]
            });
        } else {
            // Check if product already exists
            const productExists = wishlist.products.some(
                (id) => id.toString() === productId
            );

            if (!productExists) {
                wishlist.products.push(productId);
            }
        }

        await wishlist.save();

        // Populate for immediate UI update
        await wishlist.populate({
            path: 'products',
            select: 'name price images slug isActive stockQuantity',
            model: 'Product'
        });

        return NextResponse.json(wishlist, { status: 201 });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
    }
}
