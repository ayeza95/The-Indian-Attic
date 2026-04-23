import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import District from '@/models/District';

export async function GET(
    req: NextRequest,
    { params }: { params: { stateId: string } }
) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const featured = searchParams.get('featured');

        const query: any = { state: params.stateId };
        if (featured === 'true') {
            query.featured = true;
        }

        const districts = await District.find(query)
            .populate('state', 'name slug')
            .sort({ name: 1 });

        return NextResponse.json({ districts }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching districts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch districts' },
            { status: 500 }
        );
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: { stateId: string } }
) {
    try {
        // TODO: Add admin authentication check
        await connectDB();

        const body = await req.json();
        const district = await District.create({
            ...body,
            state: params.stateId,
        });

        return NextResponse.json({ district }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating district:', error);
        return NextResponse.json(
            { error: 'Failed to create district' },
            { status: 500 }
        );
    }
}
