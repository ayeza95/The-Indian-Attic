"use client";

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plane, Package, Globe, ShieldCheck, Clock, MapPin, CheckCircle2, Info } from 'lucide-react';
import Link from 'next/link';

export default function ShippingPage() {
    return (
        <div className="min-h-screen bg-heritage-50">
            {/* Hero Section */}
            <section className="relative min-h-[60vh] md:min-h-[70vh] w-full overflow-hidden flex items-center">
                <Image
                    src="/images/logistics.png"
                    alt="Global Delivery of Heritage"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-heritage-950/90 via-heritage-900/60 to-transparent" />
                <div className="container relative z-10 mx-auto px-4 flex flex-col md:flex-row items-center justify-between py-12 md:py-0">
                    <div className="max-w-2xl space-y-6 animate-in slide-in-from-left duration-1000">
                        <h1 className="heading-display text-4xl md:text-5xl lg:text-7xl text-white leading-tight">
                            From India's Heart <br />
                            to <span className="text-gold-400">Your Doorstep</span>
                        </h1>
                        <p className="text-lg md:text-xl text-heritage-100 font-light leading-relaxed max-w-lg">
                            We bridge the distance between Indian artisans and global connoisseurs with secure, tracked, and premium logistics.
                        </p>
                    </div>
                    <div className="flex flex-col items-end w-full md:w-auto space-y-8 md:space-y-20 animate-in slide-in-from-right duration-1000 mt-8 md:mt-0 gap-10">
                        <span className="inline-block py-3 px-6 rounded-full bg-gold-500/20 text-gold-300 text-lg font-semibold tracking-wide border border-gold-500/30 backdrop-blur-sm">
                            Worldwide Shipping Available
                        </span>
                        <div className="flex flex-wrap gap-4 pt-2 justify-end">
                            <Link href="/products">
                                <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-heritage-950 font-medium px-8 h-14 text-lg">
                                    Shop Now
                                </Button>
                            </Link>
                            <a href="#zones">
                                <Button size="lg" variant="outline" className="text-gold-500 border-white hover:bg-white hover:text-heritage-900 h-14 text-lg">
                                    View Rates
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Global Reach Stats */}
            <section className="py-12 bg-white border-b border-heritage-100 relative z-10 -mt-8 mx-4 md:mx-auto md:max-w-6xl rounded-xl shadow-xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-8 text-center divide-x divide-heritage-100">
                    <div>
                        <p className="text-4xl font-bold text-gold-600 font-display">200+</p>
                        <p className="text-heritage-600 text-sm mt-1 uppercase tracking-wider font-semibold">Countries Served</p>
                    </div>
                    <div>
                        <p className="text-4xl font-bold text-gold-600 font-display">15k+</p>
                        <p className="text-heritage-600 text-sm mt-1 uppercase tracking-wider font-semibold">Orders Delivered</p>
                    </div>
                    <div>
                        <p className="text-4xl font-bold text-gold-600 font-display">100%</p>
                        <p className="text-heritage-600 text-sm mt-1 uppercase tracking-wider font-semibold">Insured Transit</p>
                    </div>
                    <div>
                        <p className="text-4xl font-bold text-gold-600 font-display">7-14</p>
                        <p className="text-heritage-600 text-sm mt-1 uppercase tracking-wider font-semibold">Days Delivery</p>
                    </div>
                </div>
            </section>

            {/* The Journey Timeline */}
            <section className="py-24 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="heading-section text-4xl mb-4">The Journey of Heritage</h2>
                    <p className="text-story text-heritage-600 max-w-2xl mx-auto">
                        Every package is handled with the reverence it deserves. Here is how your artifact travels from an Indian village to your home.
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-heritage-200 -translate-y-1/2 z-0 opacity-50"></div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-heritage-100 md:transform md:translate-y-8">
                            <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center text-gold-600 mx-auto mb-4 border-4 border-white shadow-md">
                                <Package className="h-8 w-8" />
                            </div>
                            <h3 className="font-bold text-xl text-center text-heritage-900 mb-2">1. Expert Packaging</h3>
                            <p className="text-sm text-heritage-600 text-center leading-relaxed">
                                Three-layer protection with eco-friendly heritage packaging materials to ensure breakage-free transit.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-lg border border-heritage-100 md:transform md:-translate-y-8">
                            <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center text-gold-600 mx-auto mb-4 border-4 border-white shadow-md">
                                <ShieldCheck className="h-8 w-8" />
                            </div>
                            <h3 className="font-bold text-xl text-center text-heritage-900 mb-2">2. Customs Clearance</h3>
                            <p className="text-sm text-heritage-600 text-center leading-relaxed">
                                We handle all export documentation and regulatory compliance for Indian artifacts.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-lg border border-heritage-100 md:transform md:translate-y-8">
                            <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center text-gold-600 mx-auto mb-4 border-4 border-white shadow-md">
                                <Plane className="h-8 w-8" />
                            </div>
                            <h3 className="font-bold text-xl text-center text-heritage-900 mb-2">3. Express Transit</h3>
                            <p className="text-sm text-heritage-600 text-center leading-relaxed">
                                Partnered with DHL, FedEx, and Aramex for priority air shipping with live tracking.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-lg border border-heritage-100 md:transform md:-translate-y-8">
                            <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center text-gold-600 mx-auto mb-4 border-4 border-white shadow-md">
                                <MapPin className="h-8 w-8" />
                            </div>
                            <h3 className="font-bold text-xl text-center text-heritage-900 mb-2">4. Doorstep Delivery</h3>
                            <p className="text-sm text-heritage-600 text-center leading-relaxed">
                                Safe handover at your location, anywhere from New York to London to Sydney.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Shipping Zones & Pricing */}
            <section id="zones" className="py-24 bg-gradient-to-b from-heritage-900 to-heritage-800 text-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 space-y-4">
                        <span className="text-gold-400 font-medium tracking-wider uppercase text-sm">Transparent Pricing</span>
                        <h2 className="heading-display text-4xl md:text-5xl text-white">Shipping Zones</h2>
                        <p className="text-heritage-200">Flat rates based on destination. Free shipping on orders above $150.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Zone 1: USA/Canada */}
                        <Card className="bg-white/10 backdrop-blur-md border-heritage-700 text-white glow-shadow hover:bg-white/15 transition-all duration-300 relative z-0 hover:z-30 hover:scale-105">
                            <CardContent className="p-8 space-y-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-gold-500/20 rounded-lg">
                                        <Globe className="h-6 w-6 text-gold-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold font-display">North America</h3>
                                </div>
                                <div className="space-y-6 border-b border-white/10 pb-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-heritage-200 font-semibold">Standard</span>
                                            <span className="text-2xl font-bold text-white">$15.00</span>
                                        </div>
                                        <p className="text-xs text-heritage-300 leading-relaxed">
                                            Cheapest option, Delivery time: 10–15 days, Normal priority handling, Best for non-urgent orders
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-gold-400 font-semibold">Express</span>
                                            <span className="text-2xl font-bold text-gold-400">$35.00</span>
                                        </div>
                                        <p className="text-xs text-heritage-300 leading-relaxed">
                                            Faster & premium option, Delivery time usually 40–60% faster, Higher courier priority, Better handling
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm text-heritage-200">
                                    <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-400" /> Full Tracking</p>
                                    <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-400" /> Customs Handled</p>
                                </div>
                                <button
                                    onClick={() => {
                                        localStorage.setItem('preferred_country', 'USA');
                                        window.location.href = '/products';
                                    }}
                                    className="w-full mt-4 bg-gold-500 text-heritage-900 hover:bg-gold-400 font-bold py-2 px-4 rounded-md transition-colors"
                                >
                                    Ship to USA / CAN
                                </button>
                            </CardContent>
                        </Card>

                        {/* Zone 2: Europe */}
                        <Card className="bg-white/10 backdrop-blur-md border-heritage-700 text-white glow-shadow hover:bg-white/15 transition-all duration-300 relative z-10 hover:z-30 hover:scale-105 overflow-hidden">
                            <div className="absolute top-0 right-0 bg-gold-500 text-heritage-900 text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
                            <CardContent className="p-8 space-y-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-gold-500/20 rounded-lg">
                                        <Globe className="h-6 w-6 text-gold-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold font-display">UK & Europe</h3>
                                </div>
                                <div className="space-y-6 border-b border-white/10 pb-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-heritage-200 font-semibold">Standard</span>
                                            <span className="text-2xl font-bold text-white">€14.00</span>
                                        </div>
                                        <p className="text-xs text-heritage-300 leading-relaxed">
                                            Cheapest option, Delivery time: 7–12 days, Normal priority handling, Best for non-urgent orders
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-gold-400 font-semibold">Express</span>
                                            <span className="text-2xl font-bold text-gold-400">€32.00</span>
                                        </div>
                                        <p className="text-xs text-heritage-300 leading-relaxed">
                                            Faster & premium option, Delivery time usually 40–60% faster, Higher courier priority, Better handling
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm text-heritage-200">
                                    <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-400" /> VAT Included Options</p>
                                    <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-400" /> Secure Packaging</p>
                                </div>
                                <button
                                    onClick={() => {
                                        localStorage.setItem('preferred_country', 'Europe');
                                        window.location.href = '/products';
                                    }}
                                    className="w-full mt-4 bg-gold-500 text-heritage-900 hover:bg-gold-400 font-bold py-2 px-4 rounded-md transition-colors"
                                >
                                    Ship to Europe
                                </button>
                            </CardContent>
                        </Card>

                        {/* Zone 3: Rest of World */}
                        <Card className="bg-white/10 backdrop-blur-md border-heritage-700 text-white glow-shadow hover:bg-white/15 transition-all duration-300 relative z-0 hover:z-30 hover:scale-105">
                            <CardContent className="p-8 space-y-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-gold-500/20 rounded-lg">
                                        <Globe className="h-6 w-6 text-gold-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold font-display">Rest of World</h3>
                                </div>
                                <div className="space-y-6 border-b border-white/10 pb-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-heritage-200 font-semibold">Standard</span>
                                            <span className="text-2xl font-bold text-white">$20.00</span>
                                        </div>
                                        <p className="text-xs text-heritage-300 leading-relaxed">
                                            Cheapest option, Delivery time: 12–20 days, Normal priority handling, Best for non-urgent orders
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-gold-400 font-semibold">Express</span>
                                            <span className="text-2xl font-bold text-gold-400">$45.00</span>
                                        </div>
                                        <p className="text-xs text-heritage-300 leading-relaxed">
                                            Faster & premium option, Delivery time usually 40–60% faster, Higher courier priority, Better handling
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm text-heritage-200">
                                    <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-400" /> Global Tracking</p>
                                    <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-400" /> Insurance Included</p>
                                </div>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem('preferred_country');
                                        window.location.href = '/products';
                                    }}
                                    className="w-full mt-4 bg-gold-500 text-heritage-900 hover:bg-gold-400 font-bold py-2 px-4 rounded-md transition-colors"
                                >
                                    Ship Globally
                                </button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 container mx-auto px-4 max-w-4xl">
                <h2 className="heading-section text-3xl text-center mb-12">Frequently Asked Questions</h2>

                <Accordion type="single" collapsible className="w-full space-y-4">
                    <AccordionItem value="item-1" className="bg-white border border-heritage-100 rounded-lg px-6 shadow-sm">
                        <AccordionTrigger className="text-lg font-semibold text-heritage-900">How long does shipping take?</AccordionTrigger>
                        <AccordionContent className="text-heritage-700 leading-relaxed text-base pt-2">
                            Standard international shipping typically takes 10-15 business days. Express shipping options (DHL/FedEx) usually arrive within 5-7 business days. Timelines may vary based on customs processing in your country.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2" className="bg-white border border-heritage-100 rounded-lg px-6 shadow-sm">
                        <AccordionTrigger className="text-lg font-semibold text-heritage-900">Will I have to pay customs duties?</AccordionTrigger>
                        <AccordionContent className="text-heritage-700 leading-relaxed text-base pt-2">
                            Yes, import duties and taxes may be charged by your local customs authority once the package arrives. These charges are the responsibility of the recipient. We recommend checking your country's import regulations for Indian handicrafts.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3" className="bg-white border border-heritage-100 rounded-lg px-6 shadow-sm">
                        <AccordionTrigger className="text-lg font-semibold text-heritage-900">How are fragile items packaged?</AccordionTrigger>
                        <AccordionContent className="text-heritage-700 leading-relaxed text-base pt-2">
                            We take immense pride in our packaging. Fragile items like terracotta and glass are triply secured with bubble wrap, foam, and sturdy corrugated boxes. We have a breakage rate of less than 0.5% globally.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4" className="bg-white border border-heritage-100 rounded-lg px-6 shadow-sm">
                        <AccordionTrigger className="text-lg font-semibold text-heritage-900">Do you offer insurance?</AccordionTrigger>
                        <AccordionContent className="text-heritage-700 leading-relaxed text-base pt-2">
                            Yes, all international shipments are fully insured against loss or damage in transit. If your item arrives damaged, simply send us a photo within 24 hours of delivery for a full refund or replacement.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <div className="mt-12 p-6 bg-blue-50 rounded-xl flex items-start gap-4 border border-blue-100">
                    <Info className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
                    <div>
                        <h4 className="font-bold text-blue-900 mb-1">Need help with a shipment?</h4>
                        <p className="text-blue-800 text-sm">
                            Our logistics team is available 24/7. Email us at <a href="mailto:ayezafatima17.24@gmail.com" className="text-gold-600 hover:underline font-bold">logistics@indianattic.com</a> or WhatsApp us at +91-98765-43210.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
