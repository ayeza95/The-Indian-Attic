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
        <Link href={`/products/${product._id}`}>
            <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative aspect-square overflow-hidden">
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

                <CardContent className="p-4">
                    <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="font-display text-lg font-semibold text-heritage-900 line-clamp-2 group-hover:text-heritage-700 transition-colors">
                                {product.name}
                            </h3>
                            <CraftStatusBadge status={product.craftStatus} showIcon={false} />
                        </div>

                        <p className="text-sm text-heritage-600">
                            {product.state?.name || 'Unknown State'}
                        </p>

                        <p className="text-sm text-heritage-700 line-clamp-2">
                            {product.description}
                        </p>
                    </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                    <div className="flex items-center justify-between w-full">
                        <span className="text-xl font-bold text-heritage-900">
                            {formatPrice(product.price)}
                        </span>
                        {product.availabilityType !== 'in_stock' && (
                            <span className="text-xs text-heritage-600 capitalize">
                                {product.availabilityType.replace('_', ' ')}
                            </span>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
