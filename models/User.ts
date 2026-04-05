import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password: string;
    role: 'buyer' | 'artisan' | 'admin';
    name: string;
    phone?: string;

    // Buyer-specific fields
    originState?: mongoose.Types.ObjectId;
    culturalPreferences?: {
        festivals: string[];
        interests: string[];
    };
    deliveryCountry?: string;

    // Artisan-specific fields
    businessName?: string;
    craftSpecialization?: string[];
    verificationStatus?: 'pending' | 'verified' | 'rejected';
    verificationDocuments?: string[];
    artisanLineage?: string;
    generationalCraft?: boolean;
    yearsOfExperience?: number;

    // Common fields
    avatar?: string;
    isActive: boolean;
    warningCount: number;
    isRestricted: boolean;
    isBanned: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['buyer', 'artisan', 'admin'],
            required: true,
            default: 'buyer',
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },

        // Buyer fields
        originState: {
            type: Schema.Types.ObjectId,
            ref: 'State',
        },
        culturalPreferences: {
            festivals: [String],
            interests: [String],
        },
        deliveryCountry: String,

        // Artisan fields
        businessName: String,
        craftSpecialization: [String],
        verificationStatus: {
            type: String,
            enum: ['pending', 'verified', 'rejected'],
            default: 'pending',
        },
        verificationDocuments: [String],
        artisanLineage: String,
        generationalCraft: Boolean,
        yearsOfExperience: Number,

        // Common
        avatar: String,
        isActive: {
            type: Boolean,
            default: true,
        },
        warningCount: {
            type: Number,
            default: 0,
        },
        isRestricted: {
            type: Boolean,
            default: false,
        },
        isBanned: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
// UserSchema.index({ email: 1 }); // Already indexed by unique: true
UserSchema.index({ role: 1, verificationStatus: 1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
