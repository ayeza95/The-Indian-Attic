"use client";

import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

interface ProductFilterProps {
    onFilterChange: (filters: FilterState) => void;
    states: string[];
    craftStatuses: string[];
}

export interface FilterState {
    search: string;
    state: string;
    craftStatus: string;
    priceRange: string;
}

export function ProductFilter({ onFilterChange, states, craftStatuses }: ProductFilterProps) {
    const [filters, setFilters] = useState<FilterState>({
        search: "",
        state: "all",
        craftStatus: "all",
        priceRange: "all",
    });

    const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(filters.search);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [filters.search]);

    // Notify parent only when debounced search or other filters change
    useEffect(() => {
        onFilterChange({ ...filters, search: debouncedSearch });
    }, [debouncedSearch, filters.state, filters.craftStatus, filters.priceRange]);

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            search: "",
            state: "all",
            craftStatus: "all",
            priceRange: "all",
        });
    };

    const activeFilterCount =
        (filters.state !== "all" ? 1 : 0) +
        (filters.craftStatus !== "all" ? 1 : 0) +
        (filters.priceRange !== "all" ? 1 : 0);

    return (
        <div className="w-full space-y-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Search Bar */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-heritage-400" />
                    <Input
                        placeholder="Search products..."
                        className="pl-9 bg-white/50 backdrop-blur border-heritage-200 focus:border-gold-400 transition-all font-medium"
                        value={filters.search}
                        onChange={(e) => handleFilterChange("search", e.target.value)}
                        suppressHydrationWarning
                    />
                </div>

                {/* Desktop Filters */}
                <div className="hidden md:flex gap-3 flex-1 overflow-x-auto pb-1" suppressHydrationWarning>
                    <Select value={filters.state} onValueChange={(val) => handleFilterChange("state", val)}>
                        <SelectTrigger className="w-[180px] bg-white/50 border-heritage-200" suppressHydrationWarning>
                            <SelectValue placeholder="Filter by State" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All States</SelectItem>
                            {states.map((state) => (
                                <SelectItem key={state} value={state}>
                                    {state}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filters.craftStatus} onValueChange={(val) => handleFilterChange("craftStatus", val)}>
                        <SelectTrigger className="w-[180px] bg-white/50 border-heritage-200" suppressHydrationWarning>
                            <SelectValue placeholder="Craft Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            {craftStatuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status.replace(/_/g, ' ')}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filters.priceRange} onValueChange={(val) => handleFilterChange("priceRange", val)}>
                        <SelectTrigger className="w-[180px] bg-white/50 border-heritage-200" suppressHydrationWarning>
                            <SelectValue placeholder="Price Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Prices</SelectItem>
                            <SelectItem value="low">Under ₹1,000</SelectItem>
                            <SelectItem value="mid">₹1,000 - ₹5,000</SelectItem>
                            <SelectItem value="high">Above ₹5,000</SelectItem>
                        </SelectContent>
                    </Select>

                    {activeFilterCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-heritage-600 hover:text-red-600" suppressHydrationWarning>
                            <X className="h-4 w-4 mr-1" /> Clear
                        </Button>
                    )}
                </div>

                {/* Mobile Filter Sheet */}
                <div className="md:hidden flex ml-auto">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="border-heritage-300 relative">
                                <Filter className="h-4 w-4 mr-2" /> Filters
                                {activeFilterCount > 0 && (
                                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-gold-500 text-white rounded-full text-[10px]">
                                        {activeFilterCount}
                                    </Badge>
                                )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle className="font-display text-2xl">Filter Products</SheetTitle>
                                <SheetDescription>
                                    Refine your search to find the perfect artifact.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="space-y-6 mt-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-heritage-700">State</label>
                                    <Select value={filters.state} onValueChange={(val) => handleFilterChange("state", val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All States" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All States</SelectItem>
                                            {states.map((state) => (
                                                <SelectItem key={state} value={state}>
                                                    {state}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-heritage-700">Craft Status</label>
                                    <Select value={filters.craftStatus} onValueChange={(val) => handleFilterChange("craftStatus", val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Statuses" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            {craftStatuses.map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {status.replace(/_/g, ' ')}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-heritage-700">Price Range</label>
                                    <Select value={filters.priceRange} onValueChange={(val) => handleFilterChange("priceRange", val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Prices" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Prices</SelectItem>
                                            <SelectItem value="low">Under ₹1,000</SelectItem>
                                            <SelectItem value="mid">₹1,000 - ₹5,000</SelectItem>
                                            <SelectItem value="high">Above ₹5,000</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button className="w-full bg-heritage-900 text-gold-50 hover:bg-heritage-800" onClick={clearFilters}>
                                    Clear All Filters
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Active Filters Display */}
            {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                    {filters.state !== 'all' && (
                        <Badge variant="secondary" className="bg-gold-50 text-gold-900 border border-gold-200">
                            State: {filters.state} <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleFilterChange('state', 'all')} />
                        </Badge>
                    )}
                    {filters.craftStatus !== 'all' && (
                        <Badge variant="secondary" className="bg-gold-50 text-gold-900 border border-gold-200">
                            Status: {filters.craftStatus.replace(/_/g, ' ')} <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleFilterChange('craftStatus', 'all')} />
                        </Badge>
                    )}
                    {filters.priceRange !== 'all' && (
                        <Badge variant="secondary" className="bg-gold-50 text-gold-900 border border-gold-200">
                            Price: {filters.priceRange === 'low' ? '< ₹1k' : filters.priceRange === 'mid' ? '₹1k-5k' : '> ₹5k'} <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleFilterChange('priceRange', 'all')} />
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
}
