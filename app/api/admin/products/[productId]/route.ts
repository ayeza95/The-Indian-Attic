
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ productId: string }> }
) {
    const params = await props.params;
    try {
        const session = await auth();
        if (!session?.user?.email || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await connectDB();

        const product = await Product.findByIdAndDelete(params.productId);

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Product permanently removed' });

    } catch (error) {
        console.error('Error removing product:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
