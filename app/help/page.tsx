"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, ShoppingBag, Truck, RotateCcw, Mail, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

const faqData = [
    {
        id: 'item-1',
        question: 'Do you ship internationally?',
        answer: 'Yes, we ship to over 200 countries via DHL and FedEx. Shipping costs are calculated at checkout based on your location and weight of the items.',
        category: 'shipping'
    },
    {
        id: 'item-2',
        question: 'What is the return policy?',
        answer: 'Due to the unique, handcrafted nature of our products, we accept returns only if the item is damaged upon arrival or significantly different from the description. Please report issues within 48 hours of delivery.',
        category: 'returns'
    },
    {
        id: 'item-3',
        question: 'Are the products authentic?',
        answer: 'Absolutely. Every item is directly sourced from master artisans and verified cooperatives. Each purchase comes with a digital Certificate of Authenticity and the artisan\'s profile.',
        category: 'general'
    },
    {
        id: 'item-4',
        question: 'How do I track my order?',
        answer: 'You will receive an email with a live tracking link as soon as your order ships. You can also log in to your account and check the \'My Orders\' section for real-time updates.',
        category: 'orders'
    },
    {
        id: 'item-5',
        question: 'Can I cancel my order?',
        answer: 'Orders can be cancelled within 24 hours of placement if they haven\'t been shipped yet. Please contact support immediately.',
        category: 'orders'
    },
    {
        id: 'item-6',
        question: 'What if I receive a damaged item?',
        answer: 'Please take photos of the damaged packaging and item and email us within 48 hours. We will arrange a replacement or refund.',
        category: 'returns'
    }
];

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredFaqs = faqData.filter(item => {
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-heritage-50">
            {/* Hero Search Section */}
            <div className="bg-heritage-900 py-20 px-4 text-center">
                <div className="container mx-auto max-w-3xl space-y-6">
                    <span className="inline-block py-1 px-3 rounded-full bg-gold-500/20 text-gold-300 text-sm font-semibold tracking-wide border border-gold-500/30">
                        24/7 Support
                    </span>
                    <h1 className="heading-display text-4xl md:text-5xl text-white">
                        How can we help you?
                    </h1>
                    <div className="relative max-w-xl mx-auto mt-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-heritage-400 h-5 w-5" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for answers (e.g. 'refund policy', 'tracking')..."
                            className="pl-12 py-6 bg-white/10 border-heritage-700 text-white placeholder:text-heritage-400 focus:bg-white/20 transition-all rounded-full text-lg"
                        />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-10">
                {/* Quick Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
                    <div
                        onClick={() => setActiveCategory(activeCategory === 'orders' ? 'all' : 'orders')}
                        className={`bg-white p-6 rounded-xl shadow-lg border hover:-translate-y-1 transition-all cursor-pointer group ${activeCategory === 'orders' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-heritage-100'}`}
                    >
                        <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                            <ShoppingBag className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="font-bold text-heritage-900 text-lg mb-2">Orders & Payments</h3>
                        <p className="text-heritage-600 text-sm">Track orders, payment issues, invoices.</p>
                    </div>

                    <div
                        onClick={() => setActiveCategory(activeCategory === 'shipping' ? 'all' : 'shipping')}
                        className={`bg-white p-6 rounded-xl shadow-lg border hover:-translate-y-1 transition-all cursor-pointer group ${activeCategory === 'shipping' ? 'border-green-500 ring-2 ring-green-100' : 'border-heritage-100'}`}
                    >
                        <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                            <Truck className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="font-bold text-heritage-900 text-lg mb-2">Shipping & Delivery</h3>
                        <p className="text-heritage-600 text-sm">Delivery timelines, international shipping.</p>
                    </div>

                    <div
                        onClick={() => setActiveCategory(activeCategory === 'returns' ? 'all' : 'returns')}
                        className={`bg-white p-6 rounded-xl shadow-lg border hover:-translate-y-1 transition-all cursor-pointer group ${activeCategory === 'returns' ? 'border-amber-500 ring-2 ring-amber-100' : 'border-heritage-100'}`}
                    >
                        <div className="h-12 w-12 bg-amber-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
                            <RotateCcw className="h-6 w-6 text-amber-600" />
                        </div>
                        <h3 className="font-bold text-heritage-900 text-lg mb-2">Returns & Refunds</h3>
                        <p className="text-heritage-600 text-sm">Return policy, damage claims, refunds.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto pb-20">
                    {/* FAQ Section */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-heritage-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="heading-section text-3xl text-heritage-900">
                                    {activeCategory !== 'all' ? `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} FAQs` : 'Frequently Asked Questions'}
                                </h2>
                                {(activeCategory !== 'all' || searchQuery) && (
                                    <Button variant="ghost" size="sm" onClick={() => { setActiveCategory('all'); setSearchQuery(''); }} className="text-heritage-500">
                                        <X className="h-4 w-4 mr-2" /> Clear Filters
                                    </Button>
                                )}
                            </div>

                            <Accordion type="single" collapsible className="w-full space-y-4">
                                {filteredFaqs.length > 0 ? (
                                    filteredFaqs.map((faq) => (
                                        <AccordionItem key={faq.id} value={faq.id} className="border border-heritage-100 rounded-lg px-6">
                                            <AccordionTrigger className="text-lg font-semibold text-heritage-900 text-left">{faq.question}</AccordionTrigger>
                                            <AccordionContent className="text-heritage-700 leading-relaxed text-base">
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-heritage-500">
                                        No answers found. Please try a different search term.
                                    </div>
                                )}
                            </Accordion>
                        </div>
                    </div>

                    {/* Contact Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-gold-50 p-6 rounded-xl border border-gold-200">
                            <h3 className="font-bold text-heritage-900 text-xl mb-4">Still need help?</h3>
                            <p className="text-heritage-700 mb-6 text-sm">
                                Can't find the answer you're looking for? Our support team is here to help.
                            </p>

                            <div className="space-y-4">
                                <Link href="/contact?subject=General Inquiry" className="block">
                                    <Button variant="outline" className="w-full border-gold-300 text-gold-700 hover:bg-gold-50 transition-colors flex items-center justify-center gap-2 h-12 font-medium">
                                        <Mail className="h-4 w-4" /> Message Us
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-heritage-100 shadow-sm text-center">
                            <h3 className="font-bold text-heritage-900 mb-2">Are you an Artisan?</h3>
                            <p className="text-heritage-600 text-sm mb-4">Join our platform to showcase your craft to the world.</p>
                            <Link href="/auth/register">
                                <Button variant="link" className="text-gold-600 font-bold hover:text-gold-700 p-0">
                                    Register as Seller &rarr;
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
