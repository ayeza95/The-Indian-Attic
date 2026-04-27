"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/products/ProductCard";
import { ProductFilter, FilterState } from "@/components/products/ProductFilter";
import { Card, CardContent } from "@/components/ui/card";

export default function ProductsGrid({ products }: { products: any[] }) {
    const [filters, setFilters] = useState<FilterState>({
        search: "",
        state: "all",
        craftStatus: "all",
        priceRange: "all"
    });

    const states = useMemo(() => {
        const uniqueStates = new Set(products.map(p => p.state?.name).filter(Boolean));
        return Array.from(uniqueStates) as string[];
    }, [products]);

    const craftStatuses = useMemo(() => {
        const uniqueStatuses = new Set(products.map(p => p.craftStatus).filter(Boolean));
        return Array.from(uniqueStatuses) as string[];
    }, [products]);

    const filteredProducts = products.filter(product => {
        // Search Filter
        if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase()) &&
            !product.description.toLowerCase().includes(filters.search.toLowerCase())) {
            return false;
        }

        // State Filter
        if (filters.state !== 'all' && product.state?.name !== filters.state) {
            return false;
        }

        // Craft Status Filter
        if (filters.craftStatus !== 'all' && product.craftStatus !== filters.craftStatus) {
            return false;
        }

        // Price Filter
        if (filters.priceRange !== 'all') {
            const price = product.price;
            if (filters.priceRange === 'low' && price >= 1000) return false;
            if (filters.priceRange === 'mid' && (price < 1000 || price > 5000)) return false;
            if (filters.priceRange === 'high' && price <= 5000) return false;
        }

        return true;
    });

    return (
        <div>
            <ProductFilter
                onFilterChange={setFilters}
                states={states}
                craftStatuses={craftStatuses}
            />

            {filteredProducts.length === 0 ? (
                <Card className="bg-white/80 backdrop-blur">
                    <CardContent className="py-12 text-center">
                        <p className="text-heritage-600 mb-4 text-lg">No products match your filters.</p>
                        <p className="text-sm text-heritage-500">
                            Try adjusting your search terms or clearing filters.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
                    {filteredProducts.map((product) => (
                        <div key={product._id} className="fade-in h-full">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
