"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
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
                        <div className="flex justify-center mb-4">
                            <div className="bg-gold-100 p-3 rounded-full">
                                <ShieldCheck className="h-8 w-8 text-gold-600" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-display text-heritage-900 text-center">Privacy Policy</CardTitle>
                        <p className="text-center text-heritage-500 text-sm mt-2">Last Updated: January 2026</p>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8 text-heritage-800 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-heritage-900 mb-4">1. Data Collection</h2>
                            <p>
                                We collect information that you provide to us directly, such as when you create an account, make a purchase, or communicate with our support team. This includes your name, email address, shipping address, and payment information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-heritage-900 mb-4">2. Use of Information</h2>
                            <p>
                                We use your information to process orders, manage your account, provide customer support, and improve our services. We may also use your information to send you updates about new artisan collections (if you opt-in).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-heritage-900 mb-4">3. Data Sharing</h2>
                            <p>
                                We share your shipping details with our logistics partners to facilitate delivery. We share your business name and product details with buyers. We do not sell your personal data to third parties for marketing purposes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-heritage-900 mb-4">4. Security</h2>
                            <p>
                                We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-heritage-900 mb-4">5. Your Rights</h2>
                            <p>
                                You have the right to access, correct, or delete your personal information. You can manage your account settings or contact us directly for assistance with your data.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-heritage-900 mb-4">6. Cookies</h2>
                            <p>
                                We use cookies to enhance your browsing experience, remember your login status, and analyze site traffic. You can adjust your browser settings to refuse cookies, but some features of the platform may not function correctly.
                            </p>
                        </section>

                        <div className="pt-8 border-t border-heritage-100 text-center text-heritage-500 text-sm">
                            <p>If you have questions about your privacy, contact us at <a href="mailto:ayezafatima17.24@gmail.com" className="text-gold-600 hover:underline font-medium">privacy@indianattic.com</a></p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
