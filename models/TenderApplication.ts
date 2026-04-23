import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITenderApplication extends Document {
    tender: mongoose.Types.ObjectId;
    artisan: mongoose.Types.ObjectId;
    cost: string;
    availability: string;
    negotiations?: string; // Optional message/details
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    createdAt: Date;
    updatedAt: Date;
}

const TenderApplicationSchema = new Schema<ITenderApplication>(
    {
        tender: {
            type: Schema.Types.ObjectId,
            ref: 'Tender',
            required: true,
        },
        artisan: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        cost: {
            type: String,
            required: true,
        },
        availability: {
            type: String,
            required: true,
        },
        negotiations: {
            type: String,
        },
        status: {
            type: String,
            enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
            default: 'PENDING',
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
TenderApplicationSchema.index({ tender: 1, artisan: 1 }, { unique: true }); // Prevent multiple applications from same artisan for one tender
TenderApplicationSchema.index({ tender: 1 });
TenderApplicationSchema.index({ artisan: 1 });

const TenderApplication: Model<ITenderApplication> = mongoose.models.TenderApplication || mongoose.model<ITenderApplication>('TenderApplication', TenderApplicationSchema);

export default TenderApplication;
