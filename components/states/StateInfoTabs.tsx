"use client";

import { useState } from "react";
import { History, Palette, Music, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface StateInfoTabsProps {
    history: string;
    culture: string;
    arts: string[];
    famousFor: string[];
}

export default function StateInfoTabs({ history, culture, arts, famousFor }: StateInfoTabsProps) {
    const [activeTab, setActiveTab] = useState<"history" | "culture" | "arts">("history");

    return (
        <div className="bg-white rounded-xl shadow-sm border border-heritage-100 overflow-hidden">
            {/* Tabs Header */}
            <div className="flex border-b border-heritage-100 overflow-x-auto">
                <button
                    onClick={() => setActiveTab("history")}
                    className={cn(
                        "px-6 py-4 font-medium transition-colors whitespace-nowrap",
                        activeTab === "history"
                            ? "text-heritage-900 border-b-2 border-gold-500 bg-gold-50/50 font-semibold"
                            : "text-heritage-500 hover:text-heritage-800 hover:bg-heritage-50"
                    )}
                >
                    History & Heritage
                </button>
                <button
                    onClick={() => setActiveTab("culture")}
                    className={cn(
                        "px-6 py-4 font-medium transition-colors whitespace-nowrap",
                        activeTab === "culture"
                            ? "text-heritage-900 border-b-2 border-gold-500 bg-gold-50/50 font-semibold"
                            : "text-heritage-500 hover:text-heritage-800 hover:bg-heritage-50"
                    )}
                >
                    Culture & Traditions
                </button>
                <button
                    onClick={() => setActiveTab("arts")}
                    className={cn(
                        "px-6 py-4 font-medium transition-colors whitespace-nowrap",
                        activeTab === "arts"
                            ? "text-heritage-900 border-b-2 border-gold-500 bg-gold-50/50 font-semibold"
                            : "text-heritage-500 hover:text-heritage-800 hover:bg-heritage-50"
                    )}
                >
                    Arts & Crafts
                </button>
            </div>

            {/* Tab Content */}
            <div className="p-8 min-h-[400px]">
                {activeTab === "history" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-gold-100 rounded-full shrink-0">
                                <History className="h-6 w-6 text-gold-700" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-display font-bold text-heritage-900 mb-3">Timeless Legacy</h2>
                                <p className="text-story text-heritage-700 leading-relaxed">
                                    {history}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                            <div className="p-4 bg-heritage-50 rounded-lg border border-heritage-100">
                                <h3 className="font-bold text-heritage-900 mb-2 flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-gold-600" /> Famous For
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {famousFor.map((item, i) => (
                                        <span key={i} className="bg-white text-heritage-800 px-3 py-1 rounded-full text-sm font-medium border border-heritage-200 shadow-sm">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "culture" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-saffron-100 rounded-full shrink-0">
                                <Music className="h-6 w-6 text-saffron-700" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-display font-bold text-heritage-900 mb-3">Living Traditions</h2>
                                <p className="text-story text-heritage-700 leading-relaxed">
                                    {culture || "A land rich in traditions, vibrant festivals, and ancient customs that celebrate the true spirit of India. The local lifestyle, food, and attire reflect a deep connection to the roots."}
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 p-6 bg-gradient-to-br from-heritage-50 to-white rounded-xl border border-heritage-100">
                            <p className="italic text-heritage-600 text-center">
                                &quot;Culture is the widening of the mind and of the spirit.&quot;
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === "arts" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex items-start gap-4 mb-8">
                            <div className="p-3 bg-terracotta-100 rounded-full shrink-0">
                                <Palette className="h-6 w-6 text-terracotta-700" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-display font-bold text-heritage-900 mb-3">Artistic Heritage</h2>
                                <p className="text-story text-heritage-700 leading-relaxed">
                                    Explore the distinct art forms and handicrafts that have flourished in this region for centuries, passed down through generations of skilled artisans.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {arts.map((art, idx) => (
                                <div key={idx} className="group bg-white p-6 rounded-xl border border-heritage-100 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 hover:-translate-y-1">
                                    <div className="h-12 w-12 bg-gradient-to-br from-gold-100 to-gold-200 rounded-full flex items-center justify-center shrink-0 border border-gold-200 group-hover:scale-110 transition-transform">
                                        <span className="text-gold-700 text-xl">✦</span>
                                    </div>
                                    <div>
                                        <span className="text-lg font-bold text-heritage-800 group-hover:text-gold-600 transition-colors">{art}</span>
                                        <p className="text-xs text-heritage-400 mt-1">Traditional Craft</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
