import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import User from '@/models/User';

// POST: Send a new message
export async function POST(
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

        const { content, image } = await request.json();

        if (!content && !image) {
            return NextResponse.json({ error: 'Message content or image is required' }, { status: 400 });
        }

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

        // Create new message
        const newMessage: any = {
            sender: currentUser._id,
            timestamp: new Date(),
            read: false
        };

        if (content) {
            newMessage.content = content.trim();
        }

        if (image) {
            newMessage.image = image;
        }

        conversation.messages.push(newMessage);
        conversation.lastMessageAt = new Date();

        await conversation.save();

        // Get the created message with its ID
        const createdMessage = conversation.messages[conversation.messages.length - 1];

        // Note: Real-time updates will be handled by client polling

        return NextResponse.json({
            message: {
                _id: (createdMessage as any)._id?.toString() || '',
                sender: currentUser._id.toString(),
                content: createdMessage.content || '',
                image: createdMessage.image,
                timestamp: createdMessage.timestamp,
                read: createdMessage.read
            }
        }, { status: 201 });
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        );
    }
}
