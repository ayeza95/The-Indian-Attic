import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
    product: mongoose.Types.ObjectId;
    buyer: mongoose.Types.ObjectId;
    order: mongoose.Types.ObjectId;

    // Ratings (1-5)
    overallRating: number;
    authenticityRating: number;
    qualityRating: number;
    sellerCommunicationRating: number;

    // Review content
    title: string;
    review: string;
    images?: string[];

    // Verification
    verifiedPurchase: boolean;

    // Engagement
    helpfulVotes: number;

    // Status
    isApproved: boolean;

    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        buyer: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        order: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: false, // Changed to false for easier testing/demo
        },

        // Ratings
        overallRating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        authenticityRating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        qualityRating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        sellerCommunicationRating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        // Review content
        title: {
            type: String,
            required: true,
            trim: true,
        },
        review: {
            type: String,
            required: true,
        },
        images: [String],

        // Verification
        verifiedPurchase: {
            type: Boolean,
            default: true,
        },

        // Engagement
        helpfulVotes: {
            type: Number,
            default: 0,
        },

        // Status
        isApproved: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

ReviewSchema.index({ product: 1, createdAt: -1 });
ReviewSchema.index({ buyer: 1 });

const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
