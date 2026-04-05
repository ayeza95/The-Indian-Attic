import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ artisanId: string }> }
) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        await connectDB();

        const { artisanId } = await params;

        const artisan = await User.findByIdAndUpdate(
            artisanId,
            {
                verificationStatus: 'rejected',
                isActive: false
            },
            { new: true }
        );

        if (!artisan) {
            return NextResponse.json(
                { error: 'Artisan not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Artisan rejected',
        }, { status: 200 });
    } catch (error: any) {
        console.error('Reject artisan error:', error);
        return NextResponse.json(
            { error: 'Failed to reject artisan' },
            { status: 500 }
        );
    }
}
