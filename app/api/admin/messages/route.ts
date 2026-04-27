import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import User from '@/models/User'; // Ensure User model is registered

export async function GET(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        await connectDB();

        // Fetch all conversations, populate buyer and seller details
        const conversations = await Conversation.find({})
            .populate('buyer', 'name email image role')
            .populate('seller', 'name email image role businessName')
            .sort({ lastMessageAt: -1 })
            .lean();

        const processedConversations = conversations.map((conv: any) => ({
            ...conv,
            buyer: conv.buyer?.role === 'admin' ? { ...conv.buyer, name: 'Admin' } : conv.buyer,
            seller: conv.seller?.role === 'admin' ? { ...conv.seller, name: 'Admin' } : conv.seller,
        }));

        return NextResponse.json({
            conversations: processedConversations
        }, { status: 200 });
    } catch (error: any) {
        console.error('Fetch conversations error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch conversations' },
            { status: 500 }
        );
    }
}
