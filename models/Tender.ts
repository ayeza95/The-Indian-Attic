import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITender extends Document {
    title: string;
    description: string;
    eligibility: string;
    demands: string;
    timeline: string;
    deliveryAddress: string;
    budget: string;
    createdBy: mongoose.Types.ObjectId;
    status: 'OPEN' | 'CLOSED' | 'COMPLETED';
    createdAt: Date;
    updatedAt: Date;
}

const TenderSchema = new Schema<ITender>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        eligibility: {
            type: String,
            required: true,
        },
        demands: {
            type: String,
            required: true,
        },
        timeline: {
            type: String,
            required: true,
        },
        deliveryAddress: {
            type: String,
            required: true,
        },
        budget: {
            type: String,
            required: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ['OPEN', 'CLOSED', 'COMPLETED'],
            default: 'OPEN',
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
TenderSchema.index({ createdBy: 1 });
TenderSchema.index({ status: 1 });
TenderSchema.index({ createdAt: -1 });

const Tender: Model<ITender> = mongoose.models.Tender || mongoose.model<ITender>('Tender', TenderSchema);

export default Tender;
