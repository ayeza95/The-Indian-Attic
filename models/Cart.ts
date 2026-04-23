import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICartItem {
    _id?: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;
    quantity: number;
    priceAtAdd: number; // Price snapshot when added to cart
}

export interface ICart extends Document {
    user: mongoose.Types.ObjectId;
    items: ICartItem[];
    createdAt: Date;
    updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    priceAtAdd: {
        type: Number,
        required: true,
    },
});

const CartSchema = new Schema<ICart>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true, // One cart per user
        },
        items: [CartItemSchema],
    },
    {
        timestamps: true,
    }
);

const Cart: Model<ICart> = mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);

export default Cart;
