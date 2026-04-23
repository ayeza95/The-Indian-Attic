import mongoose, { Schema, Document, Model } from 'mongoose';

export type CulturalUsage = 'festival' | 'ritual' | 'daily_life' | 'wedding' | 'housewarming' | 'religious' | 'decorative' | 'functional';
export type AuthenticityTag = 'handmade' | 'gi_tagged' | 'natural' | 'direct_from_artisan' | 'organic' | 'traditional_method';
export type CraftStatus = 'stable' | 'declining' | 'endangered' | 'critically_rare';
export type AvailabilityType = 'in_stock' | 'seasonal' | 'pre_order';

export interface IProduct extends Document {
    name: string;
    slug: string;
    description: string;
    story: string;

    // Pricing
    price: number;
    currency: string;
    bulkDiscounts?: {
        minQuantity: number;
        discountPercent: number;
    }[];

    // Geographic
    state: mongoose.Types.ObjectId;


    // Cultural metadata
    culturalUsage: CulturalUsage[];
    culturalContext: string;

    // Artisan info
    seller: mongoose.Types.ObjectId;
    artisanLineage: string;
    generationalCraft: boolean;
    yearsOfTradition?: number;

    // Authenticity
    authenticityTags: AuthenticityTag[];
    giRegistration?: string;

    // Craft preservation
    craftStatus: CraftStatus;
    craftStatusExplanation: string;

    // Indicators
    locallyFamousGloballyRare: boolean;
    womenDominatedUnit: boolean;

    // Availability
    availabilityType: AvailabilityType;
    stockQuantity?: number;
    seasonalAvailability?: string;
    customOrderLeadTime?: number;

    // Media
    images: string[];
    videos?: string[];

    // Logistics
    weight?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
    exportSuitable: boolean;

    // Status
    isActive: boolean;
    isFeatured: boolean;
    isHidden?: boolean;

    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: true,
        },
        story: {
            type: String,
            required: true,
        },

        // Pricing
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            default: 'INR',
        },
        bulkDiscounts: [
            {
                minQuantity: Number,
                discountPercent: Number,
            },
        ],

        // Geographic
        state: {
            type: Schema.Types.ObjectId,
            ref: 'State',
            required: true,
        },


        // Cultural metadata
        culturalUsage: {
            type: [String],
            enum: ['festival', 'ritual', 'daily_life', 'wedding', 'housewarming', 'religious', 'decorative', 'functional'],
            required: true,
        },
        culturalContext: {
            type: String,
            required: true,
        },

        // Artisan info
        seller: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        artisanLineage: {
            type: String,
            required: true,
        },
        generationalCraft: {
            type: Boolean,
            default: false,
        },
        yearsOfTradition: Number,

        // Authenticity
        authenticityTags: {
            type: [String],
            enum: ['handmade', 'gi_tagged', 'natural', 'direct_from_artisan', 'organic', 'traditional_method'],
            default: [],
        },
        giRegistration: String,

        // Craft preservation
        craftStatus: {
            type: String,
            enum: ['stable', 'declining', 'endangered', 'critically_rare'],
            required: true,
        },
        craftStatusExplanation: {
            type: String,
            required: true,
        },

        // Indicators
        locallyFamousGloballyRare: {
            type: Boolean,
            default: false,
        },
        womenDominatedUnit: {
            type: Boolean,
            default: false,
        },

        // Availability
        availabilityType: {
            type: String,
            enum: ['in_stock', 'seasonal', 'pre_order'],
            required: true,
        },
        stockQuantity: Number,
        seasonalAvailability: String,


        // Media
        images: {
            type: [String],
            required: true,
            validate: {
                validator: (v: string[]) => v.length > 0,
                message: 'At least one image is required',
            },
        },
        videos: [String],

        // Logistics
        weight: Number,
        dimensions: {
            length: Number,
            width: Number,
            height: Number,
        },
        exportSuitable: {
            type: Boolean,
            default: true,
        },

        // Status
        isActive: {
            type: Boolean,
            default: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isHidden: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
ProductSchema.index({ state: 1 });
ProductSchema.index({ seller: 1 });
ProductSchema.index({ craftStatus: 1 });
ProductSchema.index({ locallyFamousGloballyRare: 1 });
ProductSchema.index({ isActive: 1, isFeatured: 1 });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
