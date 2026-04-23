
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ orderId: string }> }
) {
    const params = await props.params;
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const currentUser = await User.findOne({ email: session.user.email });

        if (!currentUser || currentUser.role !== 'artisan') {
            return NextResponse.json({ error: 'Only artisans can verify payments' }, { status: 403 });
        }

        const { itemId, verified } = await request.json();

        if (!itemId) {
            return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
        }

        const order = await Order.findById(params.orderId).populate('items.product');

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        const itemIndex = order.items.findIndex((i: any) => i._id.toString() === itemId);
        if (itemIndex === -1) {
            return NextResponse.json({ error: 'Item not found in order' }, { status: 404 });
        }

        // Verify ownership
        const product = order.items[itemIndex].product as any;
        if (!currentUser || product.seller.toString() !== currentUser._id.toString()) {
            return NextResponse.json({ error: 'You do not have permission for this product' }, { status: 403 });
        }

        // Prevent unverifying if already verified
        if (!verified && (order.items[itemIndex] as any).paymentVerified) {
            return NextResponse.json({ error: 'Payment cannot be unverified once it has been verified' }, { status: 400 });
        }

        // Update verification status
        (order.items[itemIndex] as any).paymentVerified = verified;

        // Check if all items are verified
        const allVerified = order.items.every((item: any) => item.paymentVerified);
        order.paymentStatus = allVerified ? 'completed' : 'pending';
        // If payment is completed, also confirm the order if it was pending
        if (allVerified && order.status === 'pending') {
            order.status = 'confirmed';
        }

        await order.save();

        return NextResponse.json({
            message: `Payment ${verified ? 'verified' : 'unverified'}`,
            order
        });

    } catch (error) {
        console.error('Error verifying payment:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
