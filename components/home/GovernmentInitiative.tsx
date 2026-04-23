'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GovernmentInitiative() {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <section className="py-20 bg-gradient-to-r from-saffron-50 to-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-start gap-12">
                    <div className="flex-1 space-y-6">
                        <span className="inline-block py-1 px-3 rounded-full bg-saffron-100 text-saffron-700 text-sm font-semibold tracking-wide">
                            Government of India Initiative
                        </span>
                        <h2 className="heading-section text-4xl text-heritage-900">
                            Empowering Women, <br />
                            <span className="text-saffron-600">Zero Tax Burden</span>
                        </h2>
                        <p className="text-story text-heritage-700">
                            We are proud to be supported by the Government of India's progressive policy allowing <strong>0% GST tax</strong> on products manufactured by women-dominated industries.
                        </p>
                        <p className="text-story text-heritage-700">
                            This ensures that 100% of the value goes directly to the women artisans and their development, making your purchase even more impactful.
                        </p>

                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-6 pt-4 overflow-hidden"
                                >
                                    <div className="space-y-4">
                                        <p className="text-heritage-800 italic">
                                            Many traditional Indian crafts are sustained by women-led and women-dominated artisan communities. To support such cottage and handicraft sectors, the Government of India provides GST exemptions or concessional tax treatment for certain handmade products, subject to classification and compliance.
                                        </p>

                                        <div className="bg-white p-6 rounded-lg shadow-sm border border-heritage-100">
                                            <h3 className="text-xl font-bold text-heritage-900 mb-3">What This Means for You</h3>
                                            <ul className="list-disc pl-5 space-y-2 text-heritage-700">
                                                <li>Your purchase supports authentic handmade products</li>
                                                <li>No additional tax burden on eligible products</li>
                                                <li>Transparent pricing, with the product value going directly to the craft</li>
                                            </ul>
                                        </div>

                                        <div className="bg-white p-6 rounded-lg shadow-sm border border-heritage-100">
                                            <h3 className="text-xl font-bold text-heritage-900 mb-3">What This Means for Women Artisans</h3>
                                            <ul className="list-disc pl-5 space-y-2 text-heritage-700">
                                                <li>Higher income retention for artisans</li>
                                                <li>Greater financial independence and skill sustainability</li>
                                                <li>Continued preservation of traditional craft practices</li>
                                            </ul>
                                        </div>

                                        <div className="bg-heritage-50 p-6 rounded-lg border border-heritage-200">
                                            <h3 className="text-xl font-bold text-heritage-900 mb-3">Our Commitment at The Indian Attic</h3>
                                            <p className="mb-3 text-heritage-700">We ensure that:</p>
                                            <ul className="list-disc pl-5 space-y-2 text-heritage-700">
                                                <li>Products are sourced directly from artisan communities</li>
                                                <li>Craft processes are handmade and tradition-driven</li>
                                                <li>Tax benefits, where applicable, are accurately applied and clearly disclosed</li>
                                                <li>Every purchase contributes to ethical commerce and cultural preservation</li>
                                            </ul>
                                        </div>

                                        <p className="text-xs text-gray-500 mt-4 border-t pt-2">
                                            Tax benefits are applied based on product type, artisan classification, and prevailing government regulations.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="pt-4">
                            <Button
                                size="lg"
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="bg-heritage-800 text-white hover:bg-heritage-900 glow-shadow flex items-center gap-2"
                            >
                                {isExpanded ? 'Show Less' : 'Learn More'}
                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 relative h-[400px] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border-4 border-white sticky top-24">
                        <Image
                            src="/images/woman.png"
                            alt="Women Artisans at Work"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                            <div className="text-white">
                                <p className="font-bold text-xl">Nari Shakti</p>
                                <p className="text-sm opacity-90">Driving India's Creative Economy</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
