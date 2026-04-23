import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import Order from '@/models/Order';
import User from '@/models/User';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (session.user.role !== 'buyer') {
            return NextResponse.json({ error: 'Only buyers can submit reviews' }, { status: 403 });
        }

        const body = await req.json();
        const { productId, rating, title, review, images } = body;

        if (!productId || !rating || !title || !review) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await connectDB();

        // Check if user is restricted
        const currentUser = await User.findById(session.user.id);
        if (currentUser?.isRestricted) {
            return NextResponse.json({ error: 'Your account is restricted. You cannot submit reviews.' }, { status: 403 });
        }

        // 1. Check if user bought the product
        const order = await Order.findOne({
            buyer: session.user.id,
            'items.product': productId,
            status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] } // minimal status
        });

        if (!order) {
            return NextResponse.json({ error: 'You can only review products you have purchased' }, { status: 403 });
        }

        // 2. Check if already reviewed
        const existingReview = await Review.findOne({
            product: productId,
            buyer: session.user.id,
        });

        if (existingReview) {
            return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 400 });
        }

        // Create the review
        const newReview = await Review.create({
            product: productId,
            buyer: session.user.id,
            order: order._id,
            overallRating: rating,
            authenticityRating: rating,
            qualityRating: rating,
            sellerCommunicationRating: rating,
            title,
            review,
            images,
            verifiedPurchase: true,
        });

        return NextResponse.json(newReview, { status: 201 });
    } catch (error) {
        console.error('Error submitting review:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { reviewId, rating, title, review, images } = body;

        if (!reviewId || !rating || !title || !review) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await connectDB();

        // Check if user is restricted
        const currentUser = await User.findById(session.user.id);
        if (currentUser?.isRestricted) {
            return NextResponse.json({ error: 'Your account is restricted. You cannot update reviews.' }, { status: 403 });
        }

        const existingReview = await Review.findOne({
            _id: reviewId,
            buyer: session.user.id,
        });

        if (!existingReview) {
            return NextResponse.json({ error: 'Review not found or unauthorized' }, { status: 404 });
        }

        existingReview.overallRating = rating;
        existingReview.authenticityRating = rating;
        existingReview.qualityRating = rating;
        existingReview.sellerCommunicationRating = rating;
        existingReview.title = title;
        existingReview.review = review;
        if (images) existingReview.images = images;

        await existingReview.save();

        return NextResponse.json(existingReview);
    } catch (error) {
        console.error('Error updating review:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get('productId');
        const checkEligibility = searchParams.get('checkEligibility');

        await connectDB();

        // Check eligibility mode for current user
        if (checkEligibility === 'true' && productId) {
            const session = await auth();
            if (!session?.user) {
                return NextResponse.json({ canReview: false, reason: 'not_logged_in' });
            }
            if (session.user.role !== 'buyer') {
                return NextResponse.json({ canReview: false, reason: 'role_mismatch' });
            }

            // Check if user is restricted
            const currentUser = await User.findById(session.user.id);
            if (currentUser?.isRestricted) {
                return NextResponse.json({ canReview: false, reason: 'account_restricted' });
            }

            // Check purchase
            const order = await Order.findOne({
                buyer: session.user.id,
                'items.product': productId,
                status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
            });

            if (!order) {
                return NextResponse.json({ canReview: false, reason: 'no_purchase' });
            }

            // Check existing review
            const existingReview = await Review.findOne({
                product: productId,
                buyer: session.user.id,
            });

            if (existingReview) {
                return NextResponse.json({
                    canReview: true,
                    isEdit: true,
                    existingReview
                });
            }

            return NextResponse.json({ canReview: true, isEdit: false });
        }

        if (!productId) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        const reviews = await Review.find({ product: productId, isApproved: true })
            .populate('buyer', 'name image')
            .sort({ createdAt: -1 });

        return NextResponse.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}