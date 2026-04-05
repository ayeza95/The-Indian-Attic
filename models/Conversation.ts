import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage {
    sender: mongoose.Types.ObjectId;
    content: string;
    image?: string; // Cloudinary image URL
    timestamp: Date;
    read: boolean;
}

export interface IConversation extends Document {
    buyer: mongoose.Types.ObjectId;
    seller: mongoose.Types.ObjectId;
    product?: mongoose.Types.ObjectId;

    messages: IMessage[];

    lastMessageAt: Date;

    createdAt: Date;
    updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
    {
        buyer: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        seller: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
        },

        messages: [
            {
                sender: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                content: {
                    type: String,
                    required: false,
                },
                image: {
                    type: String,
                    required: false,
                },
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
                read: {
                    type: Boolean,
                    default: false,
                },
            },
        ],

        lastMessageAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

ConversationSchema.index({ buyer: 1, seller: 1 });
ConversationSchema.index({ lastMessageAt: -1 });

const Conversation: Model<IConversation> = mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema);

export default Conversation;
