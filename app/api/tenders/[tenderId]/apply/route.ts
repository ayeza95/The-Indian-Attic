import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import TenderApplication from '@/models/TenderApplication';
import Tender from '@/models/Tender';

export async function POST(req: NextRequest, { params }: { params: Promise<{ tenderId: string }> }) {
    const { tenderId } = await params;
    try {
        const session = await auth();

        if (!session || session.user.role !== 'artisan') {
            return NextResponse.json(
                { error: 'Unauthorized. Only artisans can apply for tenders.' },
                { status: 403 }
            );
        }

        await connectDB();
        const body = await req.json();

        // Check if tender exists and is OPEN
        const tender = await Tender.findById(tenderId);
        if (!tender) {
            return NextResponse.json({ error: 'Tender not found' }, { status: 404 });
        }
        if (tender.status !== 'OPEN') {
            return NextResponse.json({ error: 'This tender is no longer accepting applications.' }, { status: 400 });
        }

        // Check if already applied
        const existingApplication = await TenderApplication.findOne({
            tender: tenderId,
            artisan: session.user.id,
        });

        if (existingApplication) {
            return NextResponse.json(
                { error: 'You have already applied for this tender.' },
                { status: 400 }
            );
        }

        const application = await TenderApplication.create({
            tender: tenderId,
            artisan: session.user.id,
            ...body,
        });

        return NextResponse.json({ application }, { status: 201 });
    } catch (error: any) {
        console.error('Error submitting application:', error);
        return NextResponse.json(
            { error: 'Failed to submit application' },
            { status: 500 }
        );
    }
}
