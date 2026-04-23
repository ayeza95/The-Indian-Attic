import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';
import Order from '@/models/Order';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        await connectDB();

        const { userId } = await params;

        if (!mongoose.isValidObjectId(userId)) {
            return NextResponse.json(
                { error: 'Invalid User ID format' },
                { status: 400 }
            );
        }

        const user = await User.findById(userId)
            .populate('originState', 'name')
            .select('-password')
            .lean();

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        let additionalData: any = {};

        if (user.role === 'artisan') {
            try {
                const products = await Product.find({ seller: new mongoose.Types.ObjectId(userId) })
                    .populate('state', 'name')
                    .sort({ createdAt: -1 });
                additionalData.products = products;
            } catch (prodError) {
                console.error('Error fetching products:', prodError);
            }
        } else if (user.role === 'buyer') {
            try {
                const orders = await Order.find({ buyer: userId })
                    .populate('items.product', 'name images')
                    .sort({ createdAt: -1 });
                additionalData.orders = orders;
            } catch (orderError) {
                console.error('Error fetching orders:', orderError);
            }
        }

        // Ensure all data is serializable (Dates to strings, etc.)
        const plainUser = JSON.parse(JSON.stringify({
            ...user,
            _id: user._id.toString(),
            ...additionalData
        }));

        return NextResponse.json({
            user: plainUser,
        }, { status: 200 });
    } catch (error: any) {
        console.error('Fetch user error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        await connectDB();

        const { userId } = await params;
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'User deleted successfully',
        }, { status: 200 });
    } catch (error: any) {
        console.error('Delete user error:', error);
        return NextResponse.json(
            { error: 'Failed to delete user' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        await connectDB();

        const body = await req.json();
        const { userId } = await params;
        const { isActive, isRestricted, isBanned, action } = body;

        let updateData: any = {};
        if (isActive !== undefined) updateData.isActive = isActive;
        if (isRestricted !== undefined) updateData.isRestricted = isRestricted;

        if (isBanned) {
            updateData.isBanned = true;
            updateData.isActive = false; // Banned users are also inactive
            // Delete all products related to this account
            await Product.deleteMany({ seller: userId });
        }

        if (action === 'warn') {
            const userBefore = await User.findById(userId);
            if (userBefore && userBefore.warningCount < 3) {
                updateData.warningCount = (userBefore.warningCount || 0) + 1;
            } else if (userBefore && userBefore.warningCount >= 3) {
                return NextResponse.json(
                    { error: 'User already has maximum warnings' },
                    { status: 400 }
                );
            }
        }

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select('-password');

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'User updated successfully',
            user,
        }, { status: 200 });
    } catch (error: any) {
        console.error('Update user error:', error);
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        );
    }
}
