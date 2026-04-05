import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
    product: mongoose.Types.ObjectId;
    productName: string;
    quantity: number;
    price: number;
    artisanTip?: number;
    manufactureDate?: Date;
}

export interface IOrder extends Document {
    orderNumber: string;
    buyer: mongoose.Types.ObjectId;
    items: IOrderItem[];

    // Pricing
    subtotal: number;
    tax: number;
    shippingCost: number;
    shippingMethod: string;
    artisanTips: number;
    craftDonation?: number;
    total: number;
    currency: string;

    // International logistics
    deliveryCountry: string;
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
    estimatedDelivery: {
        minDays: number;
        maxDays: number;
    };
    customsInfo?: {
        dutyEstimate: number;
        taxInfo: string;
    };

    // Gift options
    isGift: boolean;
    giftWrapping?: boolean;
    giftMessage?: string;

    // Status
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    trackingNumber?: string;

    // Payment
    paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
    paymentMethod?: string;

    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true,
        },
        buyer: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                productName: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                },
                artisanTip: {
                    type: Number,
                    default: 0,
                },
                manufactureDate: Date,
                paymentVerified: {
                    type: Boolean,
                    default: false,
                },
            },
        ],

        // Pricing
        subtotal: {
            type: Number,
            required: true,
        },
        tax: {
            type: Number,
            default: 0,
        },
        shippingCost: {
            type: Number,
            required: true,
        },
        shippingMethod: {
            type: String, // 'standard' | 'express'
            required: true,
            default: 'standard'
        },
        artisanTips: {
            type: Number,
            default: 0,
        },
        craftDonation: {
            type: Number,
            default: 0,
        },
        total: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: 'INR',
        },

        // International logistics
        deliveryCountry: {
            type: String,
            required: true,
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
        estimatedDelivery: {
            minDays: Number,
            maxDays: Number,
        },
        customsInfo: {
            dutyEstimate: Number,
            taxInfo: String,
        },

        // Gift options
        isGift: {
            type: Boolean,
            default: false,
        },
        giftWrapping: Boolean,
        giftMessage: String,

        // Status
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
        },
        trackingNumber: String,

        // Payment
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending',
        },
        paymentMethod: String,
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
// orderNumber is already indexed via unique: true
OrderSchema.index({ buyer: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
