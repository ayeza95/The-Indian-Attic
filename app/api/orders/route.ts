import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import User from '@/models/User';
import Product from '@/models/Product';
import Conversation from '@/models/Conversation';
import mongoose from 'mongoose';

// GET: Fetch user's orders
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const currentUser = await User.findOne({ email: session.user.email });
        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role'); // 'buyer' or 'artisan'

        let orders;

        if (role === 'artisan' && currentUser.role === 'artisan') {
            // Get orders containing artisan's products
            const artisanProducts = await Product.find({ seller: currentUser._id }).select('_id');
            const productIds = artisanProducts.map(p => p._id);

            orders = await Order.find({
                'items.product': { $in: productIds }
            })
                .populate('buyer', 'name email')
                .populate('items.product', 'name images seller availabilityType')
                .sort({ createdAt: -1 });
        } else {
            // Get buyer's orders
            orders = await Order.find({ buyer: currentUser._id })
                .populate('items.product', 'name images seller availabilityType')
                .sort({ createdAt: -1 });
        }

        return NextResponse.json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

// POST: Create new order from cart
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const currentUser = await User.findOne({ email: session.user.email });
        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (currentUser.isRestricted) {
            return NextResponse.json(
                { error: 'Your account is currently restricted. You cannot place new orders.' },
                { status: 403 }
            );
        }

        const { shippingAddress, paymentMethod = 'cod', shippingMethod = 'standard', zone = 3 } = await request.json();

        if (!shippingAddress) {
            return NextResponse.json({ error: 'Shipping address is required' }, { status: 400 });
        }

        // Get cart with seller info
        const cart = await Cart.findOne({ user: currentUser._id }).populate({
            path: 'items.product',
            select: 'name price images isActive state seller womenDominatedUnit availabilityType',
            populate: { path: 'seller', select: 'isRestricted name' }
        });

        if (!cart || cart.items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        // Check for restricted artisans
        for (const item of cart.items) {
            const product = item.product as any;
            if (product.seller?.isRestricted) {
                return NextResponse.json({
                    error: `The artisan for "${product.name}" is currently restricted. Please remove this item from your cart to proceed.`
                }, { status: 403 });
            }
        }

        // Prepare order items
        const orderItems = cart.items.map((item: any) => ({
            product: item.product._id,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.price, // Use current price
        }));

        // Calculate Tax
        const tax = cart.items.reduce((sum, item: any) => {
            const taxRate = item.product.womenDominatedUnit ? 0 : 0.12;
            return sum + (item.product.price * item.quantity * taxRate);
        }, 0);

        // Calculate Shipping Cost
        let shippingCost = 1800; // Default ROW Standard
        if (zone === 1) { // NA
            shippingCost = shippingMethod === 'standard' ? 1300 : 3000;
        } else if (zone === 2) { // EU
            shippingCost = shippingMethod === 'standard' ? 1300 : 3000;
        } else if (zone === 3) { // ROW
            shippingCost = shippingMethod === 'standard' ? 1800 : 4000;
        }

        // Calculate totals
        const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const total = subtotal + tax + shippingCost;

        const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        let razorpayOrder = null;
        if (paymentMethod === 'online') {
            try {
                const { razorpay } = await import('@/lib/razorpay');
                razorpayOrder = await razorpay.orders.create({
                    amount: Math.round(total * 100), // Razorpay expects amount in paise
                    currency: 'INR',
                    receipt: orderNumber,
                });
            } catch (err) {
                console.error('Error creating Razorpay order:', err);
                return NextResponse.json({ error: 'Failed to initialize payment gateway' }, { status: 500 });
            }
        }

        const order = await Order.create({
            orderNumber,
            buyer: currentUser._id,
            items: orderItems,
            subtotal,
            tax,
            shippingCost,
            shippingMethod,
            artisanTips: 0,
            total,
            currency: 'INR',
            deliveryCountry: shippingAddress.country || 'India',
            deliveryAddress: {
                fullName: shippingAddress.fullName,
                addressLine1: shippingAddress.addressLine1,
                addressLine2: shippingAddress.addressLine2,
                city: shippingAddress.city,
                state: shippingAddress.state,
                postalCode: shippingAddress.pincode || shippingAddress.postalCode,
                country: shippingAddress.country || 'India',
                phone: shippingAddress.phone,
            },
            estimatedDelivery: {
                minDays: shippingMethod === 'express' ? 3 : 7,
                maxDays: shippingMethod === 'express' ? 7 : 15,
            },
            paymentMethod,
            paymentStatus: 'pending',
            status: 'pending',
            razorpayOrderId: razorpayOrder ? razorpayOrder.id : undefined,
        });

        console.log('Order created successfully:', order._id);

        // --- Automated Messaging ---
        try {
            const sellersMap = new Map();

            // Group items by seller
            cart.items.forEach((item: any) => {
                const sellerId = item.product.seller._id.toString();
                if (!sellersMap.has(sellerId)) {
                    sellersMap.set(sellerId, {
                        items: [],
                        hasInStock: false
                    });
                }
                const group = sellersMap.get(sellerId);
                group.items.push(item);
                if (item.product.availabilityType === 'in_stock') {
                    group.hasInStock = true;
                }
            });

            // Iterate through each seller in the order
            for (const [sellerId, data] of sellersMap) {
                if (data.hasInStock) {
                    // Find or create conversation
                    let conversation = await Conversation.findOne({
                        buyer: currentUser._id,
                        seller: sellerId
                    });

                    if (!conversation) {
                        conversation = new Conversation({
                            buyer: currentUser._id,
                            seller: sellerId,
                            messages: []
                        });
                    }

                    // Determine delivery days string
                    let deliveryDays = "12-20";
                    if (zone === 1) deliveryDays = shippingMethod === 'standard' ? "10-15" : "5-7";
                    else if (zone === 2) deliveryDays = shippingMethod === 'standard' ? "7-12" : "3-5";
                    else if (zone === 3) deliveryDays = shippingMethod === 'standard' ? "12-20" : "7-10";

                    // Add automated message
                    conversation.messages.push({
                        sender: new mongoose.Types.ObjectId(sellerId), // Sending FROM seller
                        content: `Thank you for your order #${orderNumber}! Your in-stock item(s) are being prepared and will be delivered in ${deliveryDays} days via ${shippingMethod === 'standard' ? 'Standard' : 'Express'} shipping.`,
                        timestamp: new Date(),
                        read: false
                    } as any);

                    conversation.lastMessageAt = new Date();
                    await conversation.save();
                }
            }
        } catch (msgError) {
            console.error('Error sending automated messages:', msgError);
            // Don't fail the order if messaging fails
        }
        // ---------------------------

        // Clear cart after order
        cart.items = [];
        await cart.save();

        // Populate order before returning
        await order.populate('items.product', 'name images');

        return NextResponse.json({
            order,
            message: 'Order placed successfully'
        }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating order! Full details:', error);
        if (error.errors) {
            console.error('Mongoose validation errors:', JSON.stringify(error.errors, null, 2));
        }
        return NextResponse.json({
            error: 'Failed to create order',
            details: error.message,
            validationErrors: error.errors
        }, { status: 500 });
    }
}
