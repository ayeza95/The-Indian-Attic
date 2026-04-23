import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(
    req: NextRequest,
    { params }: { params: { districtId: string } }
) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const craftStatus = searchParams.get('craftStatus');
        const culturalUsage = searchParams.get('culturalUsage');
        const locallyRare = searchParams.get('locallyRare');
        const sort = searchParams.get('sort') || 'createdAt';

        const query: any = {
            district: params.districtId,
            isActive: true,
        };

        if (craftStatus) {
            query.craftStatus = craftStatus;
        }

        if (culturalUsage) {
            query.culturalUsage = { $in: [culturalUsage] };
        }

        if (locallyRare === 'true') {
            query.locallyFamousGloballyRare = true;
        }

        const sortOptions: any = {};
        if (sort === 'price_asc') sortOptions.price = 1;
        else if (sort === 'price_desc') sortOptions.price = -1;
        else if (sort === 'newest') sortOptions.createdAt = -1;
        else sortOptions.createdAt = -1;

        const products = await Product.find(query)
            .populate('state', 'name slug')
            .populate('district', 'name slug')
            .populate('seller', 'name businessName')
            .sort(sortOptions);

        return NextResponse.json({ products }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}
