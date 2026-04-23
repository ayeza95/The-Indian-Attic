import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import SwadesiBox from '@/models/SwadesiBox';

export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'buyer') {
            return NextResponse.json(
                { error: 'Unauthorized. Only buyers can subscribe.' },
                { status: 403 }
            );
        }

        await connectDB();

        const body = await req.json();
        const { tier, deliveryAddress } = body;

        const existingSubscription = await SwadesiBox.findOne({
            subscriber: session.user.id,
            status: 'active',
        });

        if (existingSubscription) {
            return NextResponse.json(
                { error: 'You already have an active subscription' },
                { status: 400 }
            );
        }

        const tierPrices = {
            basic: 2999,
            premium: 4999,
            deluxe: 7999
        };

        const amount = tierPrices[tier as keyof typeof tierPrices] || 0;

        let razorpayOrder = null;
        try {
            const { razorpay } = await import('@/lib/razorpay');
            razorpayOrder = await razorpay.orders.create({
                amount: amount * 100,
                currency: 'INR',
                receipt: `SUB-${session.user.id}-${Date.now()}`,
            });
        } catch (err) {
            console.error('Razorpay sub error:', err);
            return NextResponse.json({ error: 'Payment initialization failed' }, { status: 500 });
        }

        const subscription = await SwadesiBox.create({
            subscriber: session.user.id,
            tier,
            status: 'paused', // Active only after payment
            amount,
            deliveryAddress,
            startDate: new Date(),
            nextBillingDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            renewalCycle: 'quarterly',
            nextDeliveryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            paymentStatus: 'pending',
            paymentMethod: 'online',
            razorpayOrderId: razorpayOrder.id,
        });

        return NextResponse.json({ 
            subscription,
            razorpayOrderId: razorpayOrder.id,
            totalAmount: amount
        }, { status: 201 });
    } catch (error: any) {
        console.error('Subscription error:', error);
        return NextResponse.json(
            { error: 'Failed to create subscription' },
            { status: 500 }
        );
    }
}
