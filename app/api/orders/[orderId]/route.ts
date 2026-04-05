import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';

// GET: Get specific order
export async function GET(
    request: NextRequest,
    props: { params: Promise<{ orderId: string }> }
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

        const order = await Order.findById(params.orderId)
            .populate('buyer', 'name email')
            .populate('items.product', 'name images seller');

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Check authorization
        const isBuyer = order.buyer._id.toString() === currentUser._id.toString();
        const isArtisan = currentUser.role === 'artisan'; // Artisans can see orders with their products

        if (!isBuyer && !isArtisan) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json({ order });
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
    }
}

// PATCH: Update order status (artisan only)
export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ orderId: string }> }
) {
    const params = await props.params;
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const currentUser = await User.findOne({ email: session.user.email });
        if (!currentUser || currentUser.role !== 'artisan') {
            return NextResponse.json({ error: 'Only artisans can update order status' }, { status: 403 });
        }

        const { status, trackingNumber, paymentStatus } = await request.json();

        const order = await Order.findById(params.orderId).populate('items.product');
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Verify that at least one product in the order belongs to this artisan
        const belongsToArtisan = order.items.some((item: any) =>
            item.product.seller.toString() === currentUser._id.toString()
        );

        if (!belongsToArtisan) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        if (status) {
            order.status = status;
        }

        if (trackingNumber) {
            order.trackingNumber = trackingNumber;
        }

        if (paymentStatus) {
            order.paymentStatus = paymentStatus;
        }

        await order.save();

        return NextResponse.json({ order, message: 'Order updated successfully' });
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
