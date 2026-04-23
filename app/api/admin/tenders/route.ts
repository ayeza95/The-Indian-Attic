import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Tender from '@/models/Tender';
import User from '@/models/User';

export async function GET(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized. Only admins can access this.' },
                { status: 403 }
            );
        }

        await connectDB();

        const tenders = await Tender.find({})
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name email');

        return NextResponse.json({ tenders }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching admin tenders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tenders' },
            { status: 500 }
        );
    }
}
