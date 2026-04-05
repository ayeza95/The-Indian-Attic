import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import Conversation from '@/models/Conversation';
import mongoose from 'mongoose';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Handle await params for Next.js 15+ if needed, though usually params is accessible or awaited in recent versions?
        // In the previous fix I had to await params. Let's do that to be safe.
        const { orderId } = await params;

        const currentUser = await User.findOne({ email: session.user.email });

        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (currentUser.role !== 'artisan') {
            return NextResponse.json({ error: 'Only artisans can set manufacture dates' }, { status: 403 });
        }

        const { itemId, date } = await request.json();

        if (!itemId || !date) {
            return NextResponse.json({ error: 'Item ID and Date are required' }, { status: 400 });
        }

        const order = await Order.findById(orderId).populate('buyer', 'name');
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Find the item and verify ownership
        // The order item doesn't explicitly store seller ID on the item subdocument in Schema...
        // But the productId ref points to Product which has seller.
        // We need to verify if this artisan owns the product of this item.
        // So we might need to populate items.product.
        await order.populate('items.product');

        const item = order.items.find((i: any) => i._id.toString() === itemId);
        if (!item) {
            return NextResponse.json({ error: 'Item not found in order' }, { status: 404 });
        }

        const product = item.product as any;
        if (product.seller.toString() !== currentUser._id.toString()) {
            return NextResponse.json({ error: 'You do not have permission for this product' }, { status: 403 });
        }

        // Update manufacture date
        // Since item is a subdocument found via array search, modifying it and saving parent should work
        item.manufactureDate = new Date(date);
        await order.save();

        // Send Message
        try {
            const deliveryDays = order.estimatedDelivery ? `${order.estimatedDelivery.minDays}-${order.estimatedDelivery.maxDays}` : "7-14";

            // Find or create conversation
            let conversation = await Conversation.findOne({
                buyer: order.buyer._id,
                seller: currentUser._id
            });

            if (!conversation) {
                conversation = new Conversation({
                    buyer: order.buyer._id,
                    seller: currentUser._id,
                    messages: []
                });
            }

            const formattedDate = new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

            conversation.messages.push({
                sender: currentUser._id,
                content: `Update for Order #${order.orderNumber}: Your pre-order item "${product.name}" is scheduled for manufacture on ${formattedDate}. Delivery will commence shortly after, taking approximately ${deliveryDays} days.`,
                timestamp: new Date(),
                read: false
            } as any);

            conversation.lastMessageAt = new Date();
            await conversation.save();

        } catch (msgError) {
            console.error('Error sending message:', msgError);
        }

        return NextResponse.json({ message: 'Manufacture date set and buyer notified', order });

    } catch (error) {
        console.error('Error setting manufacture date:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
