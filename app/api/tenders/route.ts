import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Tender from '@/models/Tender';

export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'buyer') {
            return NextResponse.json(
                { error: 'Unauthorized. Only buyers can create tenders.' },
                { status: 403 }
            );
        }

        await connectDB();
        const body = await req.json();

        const tender = await Tender.create({
            ...body,
            createdBy: session.user.id,
        });

        return NextResponse.json({ tender }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating tender:', error);
        return NextResponse.json(
            { error: 'Failed to create tender' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);

        // Add filters if needed, e.g. status=OPEN
        const query: any = { status: 'OPEN' };

        const tenders = await Tender.find(query)
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name');

        return NextResponse.json({ tenders }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching tenders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tenders' },
            { status: 500 }
        );
    }
}
