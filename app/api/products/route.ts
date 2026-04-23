import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search');
        const state = searchParams.get('state');
        const craftStatus = searchParams.get('craftStatus');
        const culturalUsage = searchParams.get('culturalUsage');
        const locallyRare = searchParams.get('locallyRare');
        const featured = searchParams.get('featured');
        const seller = searchParams.get('seller');
        const sort = searchParams.get('sort') || 'createdAt';
        const limit = parseInt(searchParams.get('limit') || '20');
        const page = parseInt(searchParams.get('page') || '1');

        const query: any = {};

        // If not filtering by seller, only show active products
        if (!seller) {
            query.isActive = true;
            query.isHidden = { $ne: true };
        } else {
            query.seller = seller;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { story: { $regex: search, $options: 'i' } },
            ];
        }

        if (state) query.state = state;
        if (craftStatus) query.craftStatus = craftStatus;
        if (culturalUsage) query.culturalUsage = { $in: [culturalUsage] };
        if (locallyRare === 'true') query.locallyFamousGloballyRare = true;
        if (featured === 'true') query.isFeatured = true;

        const sortOptions: any = {};
        if (sort === 'price_asc') sortOptions.price = 1;
        else if (sort === 'price_desc') sortOptions.price = -1;
        else if (sort === 'newest') sortOptions.createdAt = -1;
        else sortOptions.createdAt = -1;

        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            Product.find(query)
                .populate('state', 'name slug')
                .populate('seller', 'name businessName')
                .sort(sortOptions)
                .limit(limit)
                .skip(skip),
            Product.countDocuments(query),
        ]);

        return NextResponse.json({
            products,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'artisan') {
            return NextResponse.json(
                { error: 'Unauthorized. Only verified artisans can create products.' },
                { status: 403 }
            );
        }

        await connectDB();

        // Check if user is restricted
        const User = (await import('@/models/User')).default;
        const user = await User.findById(session.user.id);
        if (user?.isRestricted) {
            return NextResponse.json(
                { error: 'Your account is currently restricted from posting new products. Please contact support.' },
                { status: 403 }
            );
        }

        const body = await req.json();
        const product = await Product.create({
            ...body,
            seller: session.user.id,
        });

        return NextResponse.json({ product }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { error: 'Failed to create product' },
            { status: 500 }
        );
    }
}
