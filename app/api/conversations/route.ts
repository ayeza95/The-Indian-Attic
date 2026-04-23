import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import User from '@/models/User';

// GET: Fetch all conversations for the current user
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Find the current user
        const currentUser = await User.findOne({ email: session.user.email });
        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Fetch conversations where user is either buyer or seller
        const conversations = await Conversation.find({
            $or: [
                { buyer: currentUser._id },
                { seller: currentUser._id }
            ]
        })
            .populate('buyer', 'name email avatar')
            .populate('seller', 'name email avatar businessName')
            .populate('product', 'name images')
            .sort({ lastMessageAt: -1 })
            .lean();

        // Add unread count and other user info
        const conversationsWithDetails = conversations.map(conv => {
            const otherUserId = conv.buyer._id.toString() === currentUser._id.toString()
                ? conv.seller._id
                : conv.buyer._id;

            const otherUser = conv.buyer._id.toString() === currentUser._id.toString()
                ? conv.seller
                : conv.buyer;

            const unreadCount = conv.messages.filter(
                (msg: any) => msg.sender.toString() !== currentUser._id.toString() && !msg.read
            ).length;

            return {
                ...conv,
                otherUser,
                unreadCount
            };
        });

        return NextResponse.json({ conversations: conversationsWithDetails });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        return NextResponse.json(
            { error: 'Failed to fetch conversations' },
            { status: 500 }
        );
    }
}

// POST: Create a new conversation
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const { otherUserId, productId } = await request.json();

        if (!otherUserId) {
            return NextResponse.json({ error: 'Other user ID is required' }, { status: 400 });
        }

        // Find the current user
        const currentUser = await User.findOne({ email: session.user.email });
        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Find the other user
        const otherUser = await User.findById(otherUserId);
        if (!otherUser) {
            return NextResponse.json({ error: 'Other user not found' }, { status: 404 });
        }

        // Determine buyer and seller based on roles
        let buyerId, sellerId;
        if (currentUser.role === 'buyer') {
            buyerId = currentUser._id;
            sellerId = otherUser._id;
        } else {
            buyerId = otherUser._id;
            sellerId = currentUser._id;
        }

        // Check if conversation already exists
        let conversation = await Conversation.findOne({
            buyer: buyerId,
            seller: sellerId,
            ...(productId && { product: productId })
        });

        if (conversation) {
            // Populate and return existing conversation
            conversation = await Conversation.findById(conversation._id)
                .populate('buyer', 'name email avatar')
                .populate('seller', 'name email avatar businessName')
                .populate('product', 'name images')
                .lean();

            return NextResponse.json({ conversation });
        }

        // Create new conversation
        conversation = await Conversation.create({
            buyer: buyerId,
            seller: sellerId,
            ...(productId && { product: productId }),
            messages: [],
            lastMessageAt: new Date()
        });

        // Populate before returning
        conversation = await Conversation.findById(conversation._id)
            .populate('buyer', 'name email avatar')
            .populate('seller', 'name email avatar businessName')
            .populate('product', 'name images')
            .lean();

        return NextResponse.json({ conversation }, { status: 201 });
    } catch (error) {
        console.error('Error creating conversation:', error);
        return NextResponse.json(
            { error: 'Failed to create conversation' },
            { status: 500 }
        );
    }
}
