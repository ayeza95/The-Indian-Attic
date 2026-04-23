import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IState extends Document {
    name: string;
    slug: string;
    description: string;
    culturalSignificance: string;
    image: string;
    history: string;
    famousFor: string[];
    arts: string[];
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const StateSchema = new Schema<IState>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
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
        culturalSignificance: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        history: {
            type: String,
            default: '',
        },
        famousFor: {
            type: [String],
            default: [],
        },
        arts: {
            type: [String],
            default: [],
        },
        featured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

StateSchema.index({ featured: 1 });

const State: Model<IState> = mongoose.models.State || mongoose.model<IState>('State', StateSchema);

export default State;
