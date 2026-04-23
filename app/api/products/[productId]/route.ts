import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import User from '@/models/User';

export async function GET(
    req: NextRequest,
    props: { params: Promise<{ productId: string }> }
) {
    const params = await props.params;
    try {
        await connectDB();

        const product = await Product.findById(params.productId)
            .populate('state', 'name slug')

            .populate('seller', 'name businessName artisanLineage generationalCraft');

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ product }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { error: 'Failed to fetch product' },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    props: { params: Promise<{ productId: string }> }
) {
    const params = await props.params;
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const product = await Product.findById(params.productId);

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Check if user is restricted
        if (session.user.role === 'artisan') {
            const currentUser = await User.findById(session.user.id);
            if (currentUser?.isRestricted) {
                return NextResponse.json(
                    { error: 'Your account is restricted. You cannot update products.' },
                    { status: 403 }
                );
            }
        }

        // Check if user is the seller or admin
        if (
            session.user.role !== 'admin' &&
            product.seller.toString() !== session.user.id
        ) {
            return NextResponse.json(
                { error: 'Forbidden. You can only edit your own products.' },
                { status: 403 }
            );
        }

        const body = await req.json();
        const updatedProduct = await Product.findByIdAndUpdate(
            params.productId,
            body,
            { new: true, runValidators: true }
        )
            .populate('state', 'name slug')

            .populate('seller', 'name businessName');

        return NextResponse.json({ product: updatedProduct }, { status: 200 });
    } catch (error: any) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { error: 'Failed to update product' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    props: { params: Promise<{ productId: string }> }
) {
    const params = await props.params;
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const product = await Product.findById(params.productId);

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Check if user is restricted
        if (session.user.role === 'artisan') {
            const currentUser = await User.findById(session.user.id);
            if (currentUser?.isRestricted) {
                return NextResponse.json(
                    { error: 'Your account is restricted. You cannot delete products.' },
                    { status: 403 }
                );
            }
        }

        // Check if user is the seller or admin
        if (
            session.user.role !== 'admin' &&
            product.seller.toString() !== session.user.id
        ) {
            return NextResponse.json(
                { error: 'Forbidden. You can only delete your own products.' },
                { status: 403 }
            );
        }

        // Soft delete by setting isActive to false
        await Product.findByIdAndUpdate(params.productId, { isActive: false });

        return NextResponse.json(
            { message: 'Product deleted successfully' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        );
    }
}
