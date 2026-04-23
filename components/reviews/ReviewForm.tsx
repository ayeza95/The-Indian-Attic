'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function ReviewForm({ productId, onReviewSubmitted }: { productId: string, onReviewSubmitted?: () => void }) {
    const { data: session } = useSession();
    const router = useRouter();

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [title, setTitle] = useState('');
    const [review, setReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Eligibility check
    const [checkingEligibility, setCheckingEligibility] = useState(true);
    const [canReview, setCanReview] = useState(false);
    const [eligibilityReason, setEligibilityReason] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [reviewId, setReviewId] = useState('');

    useEffect(() => {
        const checkEligibility = async () => {
            try {
                const res = await fetch(`/api/reviews?productId=${productId}&checkEligibility=true`);
                if (res.ok) {
                    const data = await res.json();
                    setCanReview(data.canReview);
                    setEligibilityReason(data.reason); // 'not_logged_in', 'role_mismatch', 'no_purchase'

                    if (data.isEdit && data.existingReview) {
                        setIsEditMode(true);
                        setReviewId(data.existingReview._id);
                        setRating(data.existingReview.overallRating);
                        setTitle(data.existingReview.title);
                        setReview(data.existingReview.review);
                    }
                }
            } catch (err) {
                console.error("Failed to check eligibility", err);
            } finally {
                setCheckingEligibility(false);
            }
        };

        if (productId) {
            checkEligibility();
        }
    }, [productId, session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (rating === 0) {
            setError('Please select a rating');
            setIsSubmitting(false);
            return;
        }

        try {
            const method = isEditMode ? 'PUT' : 'POST';
            const body = isEditMode
                ? { reviewId, rating, title, review }
                : { productId, rating, title, review };

            const res = await fetch('/api/reviews', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to submit review');
            }

            toast.success(isEditMode ? "Review updated successfully" : "Review submitted successfully");

            if (onReviewSubmitted) {
                onReviewSubmitted();
            }
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (checkingEligibility) {
        return <div className="p-6 text-center text-heritage-500">Loading review status...</div>;
    }

    if (!canReview) {
        if (eligibilityReason === 'not_logged_in') {
            return (
                <div className="bg-heritage-50 p-6 rounded-xl border border-heritage-100 text-center">
                    <p className="text-heritage-700 mb-4">Please sign in to write a review.</p>
                    <Link href="/auth/login">
                        <Button variant="outline" className="border-heritage-300 text-heritage-800">
                            Sign In
                        </Button>
                    </Link>
                </div>
            );
        }
        if (eligibilityReason === 'role_mismatch') {
            return null; // Don't show anything for sellers/admins
        }
        if (eligibilityReason === 'no_purchase') {
            return (
                <div className="bg-heritage-50 p-6 rounded-xl border border-heritage-100 text-center">
                    <p className="text-heritage-700">You can only review products you have purchased.</p>
                </div>
            );
        }
        // Fallback
        return null;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-heritage-50 p-6 rounded-xl border border-heritage-100">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-heritage-900">
                    {isEditMode ? 'Edit Your Review' : 'Write a Review'}
                </h3>
                {isEditMode && <span className="text-xs text-heritage-500 bg-heritage-100 px-2 py-1 rounded">Editing</span>}
            </div>

            {/* Star Rating */}
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className="focus:outline-none transition-transform hover:scale-110"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                    >
                        <Star
                            className={`h-8 w-8 ${(hoverRating || rating) >= star
                                ? 'fill-terracotta-500 text-terracotta-500'
                                : 'text-heritage-300'
                                }`}
                        />
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-heritage-700 mb-1">Title</label>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Summary of your experience"
                        required
                        className="bg-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-heritage-700 mb-1">Review</label>
                    <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Tell us more about the product quality and authenticity..."
                        className="w-full min-h-[100px] p-3 rounded-md border border-input bg-white text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                    />
                </div>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <Button type="submit" disabled={isSubmitting} className="bg-heritage-800 text-white hover:bg-heritage-900">
                {isSubmitting ? 'Submitting...' : (isEditMode ? 'Update Review' : 'Submit Review')}
            </Button>
        </form>
    );
}
