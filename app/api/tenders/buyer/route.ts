import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Tender from '@/models/Tender';

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

        const tenders = await Tender.find({ createdBy: session.user.id })
            .sort({ createdAt: -1 });

        return NextResponse.json({ tenders }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching buyer tenders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tenders' },
            { status: 500 }
        );
    }
}
