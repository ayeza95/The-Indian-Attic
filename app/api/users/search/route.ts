import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// GET: Search for users to start conversations with
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const currentUser = await User.findOne({ email: session.user.email });
        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q') || '';

        // Determine which role to search for
        const targetRole = currentUser.role === 'buyer' ? 'artisan' : 'buyer';

        // Build search query
        const searchQuery: any = {
            _id: { $ne: currentUser._id }, // Exclude current user
            role: targetRole,
            isActive: true
        };

        if (query.trim()) {
            searchQuery.$or = [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { businessName: { $regex: query, $options: 'i' } }
            ];
        }

        // For artisans, only show verified ones to buyers
        if (targetRole === 'artisan') {
            searchQuery.verificationStatus = 'verified';
        }

        const users = await User.find(searchQuery)
            .select('name email role avatar businessName craftSpecialization')
            .limit(20)
            .lean();

        return NextResponse.json({ users });
    } catch (error) {
        console.error('Error searching users:', error);
        return NextResponse.json(
            { error: 'Failed to search users' },
            { status: 500 }
        );
    }
}
