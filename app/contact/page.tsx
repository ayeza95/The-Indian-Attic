"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Mail, MapPin, Phone, Send, Clock } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-heritage-50">
            {/* Header */}
            <div className="bg-heritage-900 py-16 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/patterns/mandala-opacity.png')] opacity-10"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="heading-display text-4xl md:text-6xl text-gold-100 mb-4">Get in Touch</h1>
                    <p className="text-xl text-heritage-200 max-w-2xl mx-auto font-light">
                        Have questions about a product, shipping, or just want to say hello? We'd love to hear from you.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 -mt-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Contact Info Sidebar */}
                    <div className="space-y-6">
                        <Card className="bg-white border text-heritage-900 border-heritage-100 shadow-xl overflow-hidden">
                            <div className="h-2 bg-gold-500 w-full"></div>
                            <CardContent className="p-8 space-y-8">
                                <div>
                                    <h3 className="text-2xl font-display mb-6 text-heritage-900">Contact Information</h3>
                                    <div className="space-y-8">
                                        <div className="flex items-start gap-4 group">
                                            <div className="p-3 bg-heritage-50 rounded-lg group-hover:bg-gold-50 transition-colors">
                                                <MapPin className="h-6 w-6 text-heritage-700 group-hover:text-gold-600" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-heritage-900 mb-1">Head Office</p>
                                                <p className="text-heritage-600 text-sm leading-relaxed">
                                                    124, Heritage Lane, Hauz Khas Village<br />
                                                    New Delhi, Delhi 110016, India
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 group">
                                            <div className="p-3 bg-heritage-50 rounded-lg group-hover:bg-gold-50 transition-colors">
                                                <Mail className="h-6 w-6 text-heritage-700 group-hover:text-gold-600" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-heritage-900 mb-1">Email Us</p>
                                                <p className="text-heritage-600 text-sm">
                                                    <a href="mailto:ayezafatima17.24@gmail.com" className="text-gold-600 hover:underline font-medium">support@indianattic.com</a><br />
                                                    <a href="mailto:ayezafatima17.24@gmail.com" className="text-gold-600 hover:underline font-medium">partnerships@indianattic.com</a>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 group">
                                            <div className="p-3 bg-heritage-50 rounded-lg group-hover:bg-gold-50 transition-colors">
                                                <Phone className="h-6 w-6 text-heritage-700 group-hover:text-gold-600" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-heritage-900 mb-1">Call Us</p>
                                                <p className="text-heritage-600 text-sm">
                                                    +91 98765 43210
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 group">
                                            <div className="p-3 bg-heritage-50 rounded-lg group-hover:bg-gold-50 transition-colors">
                                                <Clock className="h-6 w-6 text-heritage-700 group-hover:text-gold-600" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-heritage-900 mb-1">Business Hours</p>
                                                <p className="text-heritage-600 text-sm">
                                                    Mon - Fri: 9:00 AM - 6:00 PM IST<br />
                                                    Sat - Sun: Closed
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card className="border-none shadow-xl bg-white">
                            <CardContent className="p-8 md:p-10">
                                <h2 className="text-3xl font-display text-heritage-900 mb-6">Send us a Message</h2>
                                <form
                                    className="space-y-6"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const form = e.currentTarget;
                                        const formData = new FormData(form);
                                        const subject = formData.get('subject') as string;
                                        const body = `Name: ${formData.get('firstName') || ''} ${formData.get('lastName') || ''}\nEmail: ${formData.get('email') || ''}\n\nMessage:\n${formData.get('message') || ''}`;
                                        window.location.href = `mailto:ayezafatima17.24@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                                        form.reset();
                                    }}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-heritage-700">First Name</label>
                                            <Input
                                                name="firstName"
                                                placeholder="John"
                                                className="bg-heritage-50/50 border-heritage-200 text-heritage-900 placeholder:text-heritage-400 focus:border-gold-400 focus:bg-white transition-all h-12"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-heritage-700">Last Name</label>
                                            <Input
                                                name="lastName"
                                                placeholder="Doe"
                                                className="bg-heritage-50/50 border-heritage-200 text-heritage-900 placeholder:text-heritage-400 focus:border-gold-400 focus:bg-white transition-all h-12"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-heritage-700">Email Address</label>
                                        <Input
                                            name="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            className="bg-heritage-50/50 border-heritage-200 text-heritage-900 placeholder:text-heritage-400 focus:border-gold-400 focus:bg-white transition-all h-12"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-heritage-700">Subject</label>
                                        <div className="relative">
                                            <select name="subject" className="flex h-12 w-full rounded-md border border-heritage-200 bg-heritage-50/50 px-3 py-2 text-sm text-heritage-900 ring-offset-background focus-visible:outline-none focus:border-gold-400 focus:bg-white transition-all appearance-none cursor-pointer font-medium">
                                                <option>General Inquiry</option>
                                                <option>Order Support</option>
                                                <option>Artisan Partnership</option>
                                                <option>SwadesiBox Subscription</option>
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-heritage-500"><path d="m6 9 6 6 6-6" /></svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-heritage-700">Message</label>
                                        <textarea
                                            name="message"
                                            className="flex min-h-[150px] w-full rounded-md border border-heritage-200 bg-heritage-50/50 px-4 py-3 text-sm text-heritage-900 placeholder:text-heritage-400 ring-offset-background focus-visible:outline-none focus:border-gold-400 focus:bg-white transition-all resize-none"
                                            placeholder="How can we help you?"
                                        />
                                    </div>

                                    <Button type="submit" className="w-full bg-heritage-900 hover:bg-heritage-800 text-gold-50 h-12 text-lg font-medium shadow-lg hover:shadow-xl transition-all" size="lg">
                                        <Send className="h-4 w-4 mr-2" /> Send Message
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
}
