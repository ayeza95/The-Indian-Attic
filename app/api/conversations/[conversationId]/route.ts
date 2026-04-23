import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import User from '@/models/User';

// GET: Fetch a specific conversation with messages
export async function GET(
    request: NextRequest,
    props: { params: Promise<{ conversationId: string }> }
) {
    const params = await props.params;
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

        const conversation = await Conversation.findById(params.conversationId)
            .populate('buyer', 'name email avatar')
            .populate('seller', 'name email avatar businessName')
            .populate('product', 'name images')
            .lean();

        if (!conversation) {
            return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }

        // Verify user is part of this conversation
        const isBuyer = conversation.buyer._id.toString() === currentUser._id.toString();
        const isSeller = conversation.seller._id.toString() === currentUser._id.toString();

        if (!isBuyer && !isSeller) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json({ conversation });
    } catch (error) {
        console.error('Error fetching conversation:', error);
        return NextResponse.json(
            { error: 'Failed to fetch conversation' },
            { status: 500 }
        );
    }
}

// PUT: Mark messages as read
export async function PUT(
    request: NextRequest,
    props: { params: Promise<{ conversationId: string }> }
) {
    const params = await props.params;
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

        const conversation = await Conversation.findById(params.conversationId);

        if (!conversation) {
            return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }

        // Verify user is part of this conversation
        const isBuyer = conversation.buyer.toString() === currentUser._id.toString();
        const isSeller = conversation.seller.toString() === currentUser._id.toString();

        if (!isBuyer && !isSeller) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Mark all messages from the other user as read
        conversation.messages.forEach((message: any) => {
            if (message.sender.toString() !== currentUser._id.toString()) {
                message.read = true;
            }
        });

        await conversation.save();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error marking messages as read:', error);
        return NextResponse.json(
            { error: 'Failed to mark messages as read' },
            { status: 500 }
        );
    }
}
