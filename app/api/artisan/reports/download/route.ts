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
            return new NextResponse('Unauthorized', { status: 401 });
        }

        await dbConnect();

        const currentUser = await User.findOne({ email: session.user.email });
        if (!currentUser || currentUser.role !== 'artisan') {
            return new NextResponse('Unauthorized artisan access', { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        const artisanProducts = await Product.find({ seller: currentUser._id }).select('_id name');
        const productIds = artisanProducts.map(p => p._id);
        const productNames: Record<string, string> = {};
        artisanProducts.forEach(p => {
            productNames[p._id.toString()] = p.name;
        });

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

        const orders = await Order.find(orderQuery)
            .populate('buyer', 'name email')
            .sort({ createdAt: -1 });

        // Generate CSV content
        let csv = 'Order Number,Date,Customer,Product,Quantity,Price,Total\n';

        orders.forEach(order => {
            order.items.forEach(item => {
                const itemProductId = item.product.toString();
                if (productNames[itemProductId]) {
                    const row = [
                        order.orderNumber,
                        new Date(order.createdAt).toLocaleDateString(),
                        (order.buyer as any).name || 'Unknown',
                        item.productName,
                        item.quantity,
                        item.price,
                        item.price * item.quantity
                    ].join(',');
                    csv += row + '\n';
                }
            });
        });

        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename=transaction_report_${startDate || 'all'}_to_${endDate || 'now'}.csv`,
            },
        });

    } catch (error) {
        console.error('Error generating CSV report:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
