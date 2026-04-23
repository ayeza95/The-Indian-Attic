import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Wishlist from '@/models/Wishlist';
import Conversation from '@/models/Conversation';
import User from '@/models/User';

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ productId: string }> }
) {
    const params = await props.params;
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const currentUser = await User.findOne({ email: session.user.email });
        if (!currentUser || currentUser.role !== 'artisan') {
            return NextResponse.json({ error: 'Only artisans can send notifications' }, { status: 403 });
        }

        const product = await Product.findById(params.productId);
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        if (product.seller.toString() !== currentUser._id.toString()) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Find all users who have this product in their wishlist
        const wishlists = await Wishlist.find({ products: product._id }).populate('user');

        if (wishlists.length === 0) {
            return NextResponse.json({ message: 'No buyers to notify' });
        }

        const { season } = await request.json();

        const notificationContent = `[AVAILABLE IN ${season?.toUpperCase() || 'SEASON'}] Good news! The "${product.name}" is now available for the ${season || 'season'}! You can now proceed to purchase it.`;

        let notifyCount = 0;

        for (const wishlist of wishlists) {
            const buyerId = wishlist.user._id;

            // Find or create conversation
            let conversation = await Conversation.findOne({
                buyer: buyerId,
                seller: currentUser._id,
                product: product._id
            });

            if (!conversation) {
                conversation = new Conversation({
                    buyer: buyerId,
                    seller: currentUser._id,
                    product: product._id,
                    messages: []
                });
            }

            conversation.messages.push({
                sender: currentUser._id,
                content: notificationContent,
                timestamp: new Date(),
                read: false
            });

            conversation.lastMessageAt = new Date();
            await conversation.save();
            notifyCount++;
        }

        return NextResponse.json({
            message: `Successfully notified ${notifyCount} interested buyers`,
            count: notifyCount
        });

    } catch (error) {
        console.error('Error sending seasonal notification:', error);
        return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
    }
}
