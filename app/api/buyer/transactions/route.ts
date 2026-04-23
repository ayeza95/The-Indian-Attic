import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import SwadesiBox from '@/models/SwadesiBox';

export async function GET(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'buyer') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        await connectDB();

        // Fetch Orders
        const orders = await Order.find({ buyer: session.user.id })
            .select('orderNumber total status createdAt paymentStatus')
            .sort({ createdAt: -1 })
            .lean();

        // Fetch Subscriptions (serving as transaction records here)
        const subscriptions = await SwadesiBox.find({ subscriber: session.user.id })
            .select('tier amount status startDate createdAt')
            .sort({ createdAt: -1 })
            .lean();

        // Combine and Normalize
        const transactions = [
            ...orders.map((o: any) => ({
                id: o._id,
                orderId: o._id,
                type: 'Product Order',
                reference: o.orderNumber,
                amount: Number(o.total) || 0,
                status: o.status,
                paymentStatus: o.paymentStatus || 'unknown',
                date: o.createdAt,
            })),
            ...subscriptions.map((s: any) => ({
                id: s._id,
                subscriptionId: s._id,
                type: 'SwadesiBox Subscription',
                reference: `${(s.tier || 'basic').toUpperCase()} Plan`,
                amount: Number(s.amount) || (s.tier === 'premium' ? 4999 : s.tier === 'deluxe' ? 7999 : 2999),
                status: s.status,
                paymentStatus: 'completed',
                date: s.startDate || s.createdAt,
            })),
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return NextResponse.json({ transactions });
    } catch (error: any) {
        console.error('Transactions fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch transactions' },
            { status: 500 }
        );
    }
}
