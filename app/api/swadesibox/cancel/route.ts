import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import SwadesiBox from '@/models/SwadesiBox';

export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'buyer') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        await connectDB();

        const subscription = await SwadesiBox.findOneAndUpdate(
            {
                subscriber: session.user.id,
                status: 'active'
            },
            {
                status: 'cancelled',
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!subscription) {
            return NextResponse.json(
                { error: 'No active subscription found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Subscription cancelled successfully' });
    } catch (error: any) {
        console.error('Cancellation error:', error);
        return NextResponse.json(
            { error: 'Failed to cancel subscription' },
            { status: 500 }
        );
    }
}
