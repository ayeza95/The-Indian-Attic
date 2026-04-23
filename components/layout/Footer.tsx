'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-heritage-900 text-heritage-100 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand Info */}
                    <div className="space-y-4">
                        <h3 className="font-display text-2xl font-bold text-white">The Indian Attic</h3>
                        <p className="text-sm text-heritage-300 leading-relaxed">
                            Bridging the gap between timeless Indian heritage and the modern world.
                            Authentic, ethical, and soulful products directly from India's master artisans.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="#" className="hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
                            <a href="#" className="hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
                            <a href="#" className="hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
                            <a href="mailto:ayezafatima17.24@gmail.com" className="hover:text-white transition-colors"><Mail className="h-5 w-5" /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-6">Discover</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
                            <li><Link href="/states" className="hover:text-white transition-colors">Explore by State</Link></li>
                            <li><Link href="/swadesibox" className="hover:text-white transition-colors">SwadesiBox</Link></li>
                            <li><Link href="/craft-preservation" className="hover:text-white transition-colors">Craft Preservation</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold text-white mb-6">Support</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link href="/shipping" className="hover:text-white transition-colors">International Shipping</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link href="/about" className="hover:text-white transition-colors">Our Story</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-semibold text-white mb-6">Stay Connected</h4>
                        <p className="text-sm text-heritage-300 mb-4">
                            Join our community to hear about new artisan collections and stories.
                        </p>
                        <form className="flex gap-2" action="mailto:ayezafatima17.24@gmail.com" method="post" encType="text/plain">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email address"
                                className="bg-heritage-800 border-none text-white placeholder:text-heritage-400 text-sm rounded px-3 py-2 w-full focus:ring-1 focus:ring-heritage-500"
                                suppressHydrationWarning
                            />
                            <button type="submit" className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors" suppressHydrationWarning>
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-heritage-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-heritage-400">
                    <p>© 2025 The Indian Attic. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
