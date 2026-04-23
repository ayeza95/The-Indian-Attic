import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        await connectDB();

        const verifiedArtisans = await User.find({
            role: 'artisan',
            verificationStatus: 'verified',
        })
            .select('-password')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            artisans: verifiedArtisans.map(artisan => ({
                ...artisan,
                _id: artisan._id.toString(),
            })),
        }, { status: 200 });
    } catch (error: any) {
        console.error('Fetch verified artisans error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch verified artisans' },
            { status: 500 }
        );
    }
}
