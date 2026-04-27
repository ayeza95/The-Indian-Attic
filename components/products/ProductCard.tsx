'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import CraftStatusBadge from './CraftStatusBadge';
import LocallyRareBadge from './LocallyRareBadge';
import { formatPrice } from '@/lib/utils';
import { IProduct } from '@/models/Product';

interface ProductCardProps {
    product: IProduct & {
        state: { name: string; slug: string };

    };
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Link href={`/products/${product._id}`} className="flex h-full">
            <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col w-full h-full">
                {/* Fixed-height image */}
                <div className="relative aspect-square overflow-hidden flex-shrink-0">
                    <Image
                        src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-product.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.locallyFamousGloballyRare && (
                        <div className="absolute top-2 right-2">
                            <LocallyRareBadge />
                        </div>
                    )}
                </div>

                {/* Content grows to fill remaining space */}
                <CardContent className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-display text-base font-semibold text-heritage-900 line-clamp-2 group-hover:text-heritage-700 transition-colors leading-snug flex-1 min-h-[2.8rem]">
                            {product.name}
                        </h3>
                        <CraftStatusBadge status={product.craftStatus} showIcon={false} />
                    </div>

                    <p className="text-sm text-heritage-600 mb-1">
                        {product.state?.name || 'Unknown State'}
                    </p>

                    {/* Description takes up remaining space */}
                    <p className="text-sm text-heritage-700 line-clamp-2 flex-1">
                        {product.description}
                    </p>
                </CardContent>

                {/* Footer always at bottom */}
                <CardFooter className="p-4 pt-0 flex-shrink-0">
                    <div className="flex items-center justify-between w-full">
                        <span className="text-xl font-bold text-heritage-900">
                            {formatPrice(product.price)}
                        </span>
                        {product.availabilityType !== 'in_stock' && (
                            <span className="text-xs text-heritage-600 capitalize bg-heritage-50 px-2 py-0.5 rounded">
                                {product.availabilityType === 'pre_order' ? 'Pre Order' : product.availabilityType.replace('_', ' ')}
                            </span>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
