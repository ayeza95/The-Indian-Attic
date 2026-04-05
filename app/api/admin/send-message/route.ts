import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        await connectDB();

        const body = await req.json();
        const { userId, message, image } = body;

        const targetUserId = new mongoose.Types.ObjectId(userId);
        let adminId: mongoose.Types.ObjectId;

        if (mongoose.isValidObjectId(session.user.id)) {
            adminId = new mongoose.Types.ObjectId(session.user.id);
        } else if (session.user.id.startsWith('admin-')) {
            // Legacy session fallback: Find the admin in DB by email
            const email = session.user.id.replace('admin-', '');
            const dbAdmin = await User.findOne({ email });
            if (!dbAdmin) {
                return NextResponse.json({ error: 'Admin record not found in database' }, { status: 404 });
            }
            adminId = dbAdmin._id as mongoose.Types.ObjectId;
        } else {
            return NextResponse.json({ error: 'Invalid Admin ID format' }, { status: 400 });
        }

        const conversation = await Conversation.findOne({
            $or: [
                { buyer: targetUserId, seller: adminId },
                { buyer: adminId, seller: targetUserId },
            ],
        });

        const newMessage: any = {
            sender: adminId as any,
            timestamp: new Date(),
            read: false,
        };

        if (message && message.trim()) {
            newMessage.content = message.trim();
        }

        if (image) {
            newMessage.image = image;
        }

        if (conversation) {
            conversation.messages.push(newMessage);
            conversation.lastMessageAt = new Date();
            await conversation.save();
        } else {
            await Conversation.create({
                buyer: targetUserId,
                seller: adminId,
                messages: [newMessage],
                lastMessageAt: new Date(),
            });
        }

        return NextResponse.json({
            message: 'Message sent successfully',
        }, { status: 200 });
    } catch (error: any) {
        console.error('Send message error:', error);
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        );
    }
}
