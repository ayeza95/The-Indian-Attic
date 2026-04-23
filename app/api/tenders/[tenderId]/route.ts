import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Tender from '@/models/Tender';
import TenderApplication from '@/models/TenderApplication';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ tenderId: string }> }) {
    try {
        await connectDB();
        const { tenderId } = await params;
        const tender = await Tender.findById(tenderId).populate('createdBy', 'name email');

        if (!tender) {
            return NextResponse.json(
                { error: 'Tender not found' },
                { status: 404 }
            );
        }

        // Check if current user is an artisan and has already applied
        let hasApplied = false;
        const session = await auth();
        if (session?.user?.role === 'artisan') {
            const application = await TenderApplication.findOne({
                tender: tenderId,
                artisan: session.user.id
            });
            hasApplied = !!application;
        }

        return NextResponse.json({ tender, hasApplied }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching tender:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tender' },
            { status: 500 }
        );
    }
}
