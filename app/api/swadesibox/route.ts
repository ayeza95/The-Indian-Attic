import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import SwadesiBox from '@/models/SwadesiBox';

export async function GET(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'buyer') {
            return NextResponse.json({ subscription: null });
        }

        await connectDB();

        let subscription = await SwadesiBox.findOne({
            subscriber: session.user.id,
            status: 'active',
        }).lean();

        if (subscription) {
            // Fallbacks for legacy records
            const tierPrices = { basic: 2999, premium: 4999, deluxe: 7999 };
            subscription = {
                ...subscription,
                amount: subscription.amount || (tierPrices[subscription.tier as keyof typeof tierPrices] || 2999),
                startDate: subscription.startDate || subscription.createdAt,
                nextBillingDate: subscription.nextBillingDate || new Date(new Date(subscription.createdAt).getTime() + 90 * 24 * 60 * 60 * 1000),
                renewalCycle: subscription.renewalCycle || 'quarterly'
            };
        }

        return NextResponse.json({ subscription });
    } catch (error: any) {
        console.error('Fetch subscription error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch subscription' },
            { status: 500 }
        );
    }
}
