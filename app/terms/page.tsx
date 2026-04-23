"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function TermsOfServicePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-heritage-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <Button
                    variant="ghost"
                    className="mb-6 hover:bg-heritage-100 text-heritage-800"
                    onClick={() => router.back()}
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>

                <Card className="border-heritage-200">
                    <CardHeader className="border-b border-heritage-100 bg-white">
                        <CardTitle className="text-3xl font-display text-heritage-900 text-center">Terms of Service</CardTitle>
                        <p className="text-center text-heritage-500 text-sm mt-2">Last Updated: January 2026</p>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8 text-heritage-800 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-heritage-900 mb-4">1. Acceptance of Terms</h2>
                            <p>
                                By accessing and using The Indian Attic platform, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services. We act as a marketplace connecting master artisans with global buyers.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-heritage-900 mb-4">2. Artisan Marketplace</h2>
                            <p>
                                The Indian Attic provides a platform for artisans to showcase and sell their handcrafted products. Each item is unique and may have slight variations in color, texture, and size, which are characteristic of handmade crafts and not considered defects.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-heritage-900 mb-4">3. Orders and Payments</h2>
                            <p>
                                All orders are subject to acceptance and availability. Payments are processed securely. For artisan products, payment verification is required by the artisan before the order is fully confirmed and processed for shipping. Once an artisan verifies a payment, it cannot be unverified.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-heritage-900 mb-4">4. Shipping and Delivery</h2>
                            <p>
                                We facilitate shipping through global logistics partners. Delivery timelines are estimates and may be affected by customs clearance in the destination country. Import duties and taxes are the responsibility of the buyer.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-heritage-900 mb-4">5. Returns and Refunds</h2>
                            <p>
                                Due to the bespoke nature of heritage crafts, returns are only accepted for items damaged during transit or if the item received is significantly different from the description. Claims must be made within 48 hours of delivery with photographic evidence.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-heritage-900 mb-4">6. Intellectual Property</h2>
                            <p>
                                All content on this platform, including designs, images, and text, is the property of The Indian Attic or its artisans and is protected by intellectual property laws.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-heritage-900 mb-4">7. Limitation of Liability</h2>
                            <p>
                                The Indian Attic is not liable for indirect, incidental, or consequential damages arising from the use of our platform or the purchase of products.
                            </p>
                        </section>

                        <div className="pt-8 border-t border-heritage-100 text-center text-heritage-500 text-sm">
                            <p>If you have any questions, please contact us at <a href="mailto:ayezafatima17.24@gmail.com" className="text-gold-600 hover:underline font-medium">support@indianattic.com</a></p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
