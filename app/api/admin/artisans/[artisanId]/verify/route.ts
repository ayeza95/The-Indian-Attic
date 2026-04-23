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
            { verificationStatus: 'verified' },
            { new: true }
        );

        if (!artisan) {
            return NextResponse.json(
                { error: 'Artisan not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Artisan verified successfully',
            artisan: {
                id: artisan._id.toString(),
                name: artisan.name,
                email: artisan.email,
            },
        }, { status: 200 });
    } catch (error: any) {
        console.error('Verify artisan error:', error);
        return NextResponse.json(
            { error: 'Failed to verify artisan' },
            { status: 500 }
        );
    }
}
