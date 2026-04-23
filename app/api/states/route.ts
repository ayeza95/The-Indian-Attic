import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import State from '@/models/State';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const featured = searchParams.get('featured');

        const query: any = {};
        if (featured === 'true') {
            query.featured = true;
        }

        const states = await State.find(query).sort({ name: 1 });

        return NextResponse.json({ states }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching states:', error);
        return NextResponse.json(
            { error: 'Failed to fetch states' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        // TODO: Add admin authentication check
        await connectDB();

        const body = await req.json();
        const state = await State.create(body);

        return NextResponse.json({ state }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating state:', error);
        return NextResponse.json(
            { error: 'Failed to create state' },
            { status: 500 }
        );
    }
}
