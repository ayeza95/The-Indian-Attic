import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import User from '@/models/User';

export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const currentUser = await User.findOne({ email: session.user.email });
        if (!currentUser || currentUser.role !== 'artisan') {
            return NextResponse.json({ error: 'Unauthorized artisan access' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        // 1. Fetch all products for the artisan
        const artisanProducts = await Product.find({ seller: currentUser._id });
        const productIds = artisanProducts.map(p => p._id);
        
        const totalProducts = artisanProducts.length;
        const activeProducts = artisanProducts.filter(p => p.isActive && !p.isHidden).length;

        // 2. Build query for orders
        const orderQuery: any = {
            'items.product': { $in: productIds },
            status: 'delivered',
            paymentStatus: 'completed'
        };

        if (startDate || endDate) {
            orderQuery.createdAt = {};
            if (startDate) orderQuery.createdAt.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                orderQuery.createdAt.$lte = end;
            }
        }

        const relevantOrders = await Order.find(orderQuery);

        // 3. Compute Analytics
        let totalUnitsSold = 0;
        let totalRevenue = 0;
        
        // Track sales per product to find top performer
        const productSales: Record<string, { name: string, units: number, revenue: number }> = {};

        artisanProducts.forEach(product => {
            productSales[product._id.toString()] = {
                name: product.name,
                units: 0,
                revenue: 0
            };
        });

        relevantOrders.forEach(order => {
            order.items.forEach(item => {
                const itemProductId = item.product.toString();
                if (productSales[itemProductId]) {
                    totalUnitsSold += item.quantity;
                    const itemRevenue = item.price * item.quantity;
                    totalRevenue += itemRevenue;

                    productSales[itemProductId].units += item.quantity;
                    productSales[itemProductId].revenue += itemRevenue;
                }
            });
        });

        // 4. Find Top Product
        let topProduct = null;
        let maxUnits = 0;

        for (const [id, data] of Object.entries(productSales)) {
            if (data.units > maxUnits) {
                maxUnits = data.units;
                topProduct = data.name;
            }
        }

        return NextResponse.json({
            analytics: {
                totalProducts,
                activeProducts,
                totalUnitsSold,
                totalRevenue,
                topProduct: topProduct || 'N/A'
            }
        });

    } catch (error) {
        console.error('Error fetching artisan product analytics:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
