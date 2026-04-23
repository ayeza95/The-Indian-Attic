import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import District from '@/models/District';

export async function GET(
    req: NextRequest,
    { params }: { params: { districtId: string } }
) {
    try {
        await connectDB();

        const district = await District.findById(params.districtId)
            .populate('state', 'name slug');

        if (!district) {
            return NextResponse.json(
                { error: 'District not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ district }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching district:', error);
        return NextResponse.json(
            { error: 'Failed to fetch district' },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { districtId: string } }
) {
    try {
        // TODO: Add admin authentication check
        await connectDB();

        const body = await req.json();
        const district = await District.findByIdAndUpdate(
            params.districtId,
            body,
            { new: true, runValidators: true }
        ).populate('state', 'name slug');

        if (!district) {
            return NextResponse.json(
                { error: 'District not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ district }, { status: 200 });
    } catch (error: any) {
        console.error('Error updating district:', error);
        return NextResponse.json(
            { error: 'Failed to update district' },
            { status: 500 }
        );
    }
}
