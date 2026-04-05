import { Star, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';

interface Review {
    _id: string;
    buyer: {
        name: string;
        image?: string;
    };
    overallRating: number;
    title: string;
    review: string;
    createdAt: string;
}

export default function ReviewList({ reviews }: { reviews: Review[] }) {
    if (reviews.length === 0) {
        return (
            <div className="text-center py-10 bg-white rounded-xl border border-dashed border-heritage-200">
                <p className="text-heritage-500">No reviews yet. Be the first to share your experience!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <Card key={review._id} className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-heritage-100 flex items-center justify-center overflow-hidden">
                                    {review.buyer.image ? (
                                        <img src={review.buyer.image} alt={review.buyer.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <User className="h-5 w-5 text-heritage-600" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-heritage-900">{review.buyer.name}</h4>
                                    <p className="text-xs text-heritage-500">
                                        {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`h-4 w-4 ${review.overallRating >= star ? 'fill-terracotta-500 text-terracotta-500' : 'text-heritage-200'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="mt-4">
                            <h5 className="font-semibold text-heritage-800">{review.title}</h5>
                            <p className="text-heritage-600 mt-2 text-sm leading-relaxed">
                                {review.review}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
