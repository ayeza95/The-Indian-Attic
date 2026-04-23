import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, isSubscription } = await request.json();

        // Verify the signature
        const secret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body.toString())
            .digest('hex');

        const isSignatureValid = expectedSignature === razorpay_signature;

        if (isSignatureValid) {
            await dbConnect();
            
            if (isSubscription) {
                const SwadesiBox = (await import('@/models/SwadesiBox')).default;
                const subscription = await SwadesiBox.findOneAndUpdate(
                    { razorpayOrderId: razorpay_order_id },
                    {
                        status: 'active',
                        paymentStatus: 'completed',
                        razorpayPaymentId: razorpay_payment_id,
                        razorpaySignature: razorpay_signature,
                    },
                    { new: true }
                );

                if (!subscription) {
                    return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
                }

                return NextResponse.json({ message: 'Subscription verified successfully', subscription });
            } else {
                // Update order status
                const order = await Order.findOneAndUpdate(
                    { razorpayOrderId: razorpay_order_id },
                    {
                        paymentStatus: 'completed',
                        razorpayPaymentId: razorpay_payment_id,
                        razorpaySignature: razorpay_signature,
                        status: 'confirmed'
                    },
                    { new: true }
                );

                if (!order) {
                    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
                }

                return NextResponse.json({ message: 'Payment verified successfully', order });
            }
        } else {
            return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
        }
    } catch (error: any) {
        console.error('Error verifying payment:', error);
        return NextResponse.json({ error: 'Verification failed', details: error.message }, { status: 500 });
    }
}
