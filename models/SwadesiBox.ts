import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISwadesiBox extends Document {
    subscriber: mongoose.Types.ObjectId;

    // Subscription details
    tier: 'basic' | 'premium' | 'deluxe';
    status: 'active' | 'paused' | 'cancelled';

    // Quarterly box details
    currentQuarter: {
        theme: string;
        regionalFocus: string;
        products: mongoose.Types.ObjectId[];
        storyCards: {
            product: mongoose.Types.ObjectId;
            story: string;
            culturalContext: string;
        }[];
    };

    // Preferences
    preferences: {
        avoidCategories?: string[];
        preferredRegions?: string[];
        dietaryRestrictions?: string[];
    };

    // Delivery
    deliveryAddress: {
        fullName: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        phone: string;
    };

    nextDeliveryDate?: Date;
    startDate: Date;
    nextBillingDate: Date;
    amount: number;
    renewalCycle: 'monthly' | 'quarterly' | 'yearly';

    createdAt: Date;
    updatedAt: Date;
}

const SwadesiBoxSchema = new Schema<ISwadesiBox>(
    {
        subscriber: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        tier: {
            type: String,
            enum: ['basic', 'premium', 'deluxe'],
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'paused', 'cancelled'],
            default: 'active',
        },

        currentQuarter: {
            theme: String,
            regionalFocus: String,
            products: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                },
            ],
            storyCards: [
                {
                    product: {
                        type: Schema.Types.ObjectId,
                        ref: 'Product',
                    },
                    story: String,
                    culturalContext: String,
                },
            ],
        },

        preferences: {
            avoidCategories: [String],
            preferredRegions: [String],
            dietaryRestrictions: [String],
        },

        deliveryAddress: {
            fullName: String,
            addressLine1: String,
            addressLine2: String,
            city: String,
            state: String,
            postalCode: String,
            country: String,
            phone: String,
        },

        nextDeliveryDate: Date,
        startDate: {
            type: Date,
            default: Date.now,
        },
        nextBillingDate: Date,
        amount: {
            type: Number,
            required: true,
        },
        renewalCycle: {
            type: String,
            enum: ['monthly', 'quarterly', 'yearly'],
            default: 'quarterly',
        },
    },
    {
        timestamps: true,
    }
);

SwadesiBoxSchema.index({ subscriber: 1 });
SwadesiBoxSchema.index({ status: 1 });

const SwadesiBox: Model<ISwadesiBox> = mongoose.models.SwadesiBox || mongoose.model<ISwadesiBox>('SwadesiBox', SwadesiBoxSchema);

export default SwadesiBox;
