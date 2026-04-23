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

        const { searchParams } = new URL(req.url);
        const role = searchParams.get('role');

        const filter: any = {
            role: { $ne: 'admin' },
            $or: [
                { role: { $ne: 'artisan' } },
                { role: 'artisan', verificationStatus: 'verified' }
            ]
        };

        if (role && role !== 'all') {
            // If specific role is requested, we need to merge it with our base filter
            if (role === 'artisan') {
                // If asking for artisans, they MUST be verified
                delete filter.$or; // Clear the $or
                filter.role = 'artisan';
                filter.verificationStatus = 'verified';
            } else {
                // If asking for buyers/admins, the "not artisan" part of $or is implicitly satisfied by role=buyer/admin
                // But to be safe and clean:
                delete filter.$or;
                filter.role = role;
            }
        }

        const users = await User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            users: users.map(user => ({
                ...user,
                _id: user._id.toString(),
            })),
        }, { status: 200 });
    } catch (error: any) {
        console.error('Fetch users error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}