
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import User from '@/models/User';

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ userId: string }> }
) {
    const params = await props.params;
    try {
        const session = await auth();
        if (!session?.user?.email || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();

        const { action } = await request.json(); // action: 'hide_all' | 'unhide_all'

        if (!['hide_all', 'unhide_all'].includes(action)) {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        const isHidden = action === 'hide_all';

        // Update all products for this seller
        const result = await Product.updateMany(
            { seller: params.userId },
            { $set: { isHidden: isHidden } }
        );

        return NextResponse.json({
            message: `Successfully ${isHidden ? 'hidden' : 'unhidden'} ${result.modifiedCount} products`,
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        console.error('Error updating products:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
