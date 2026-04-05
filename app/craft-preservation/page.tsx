import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CraftPreservationPage() {
    return (
        <div className="min-h-screen bg-heritage-50 pb-20">
            <section className="bg-heritage-900 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="heading-display text-4xl md:text-6xl mb-6">Preserving Endangered Crafts</h1>
                    <p className="text-xl text-heritage-200 max-w-3xl mx-auto font-light">
                        Our mission is to save India's dying art forms from extinction by creating sustainable livelihoods for the last generation of masters.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16">
                <div className="grid gap-16">
                    {/* Parsi Gara */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                            <Image
                                src="/images/parsi.png" // Placeholder
                                alt="Parsi Gara Embroidery"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="space-y-6">
                            <div className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold border border-red-200">
                                ENDANGERED
                            </div>
                            <h2 className="heading-section text-3xl">Parsi Gara Embroidery</h2>
                            <p className="text-story">
                                Once a staple in every Parsi wardrobe, the art of Gara embroidery—known for its intricate Chinese-influenced motifs—is fading.
                                With only a handful of master artisans left in Mumbai and Gujarat, this craft requires immense patience and skill.
                            </p>
                            <Link href="/products?tag=parsi-gara">
                                <Button className="bg-heritage-600 hover:bg-heritage-700 text-white">
                                    Support This Craft
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Rogan Art */}
                    <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
                        <div className="order-1 md:order-2 relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                            <Image
                                src="/images/rogan-art.png" // Placeholder
                                alt="Rogan Art"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="order-2 md:order-1 space-y-6">
                            <div className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold border border-orange-200">
                                CRITICALLY RARE
                            </div>
                            <h2 className="heading-section text-3xl">Rogan Art of Kutch</h2>
                            <p className="text-story">
                                Practiced by only one family in Nirona, Gujarat, Rogan art involves painting on fabric using a thick paste made from castor oil.
                                It's a mesmerizing freehand technique that creates embossed, vibrant patterns.
                            </p>
                            <Link href="/products?tag=rogan">
                                <Button className="bg-heritage-600 hover:bg-heritage-700 text-white">
                                    Support This Craft
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Toda Embroidery */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                            <Image
                                src="/images/toda-embroidery.png" // Placeholder
                                alt="Toda Embroidery"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="space-y-6">
                            <div className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold border border-yellow-200">
                                VULNERABLE
                            </div>
                            <h2 className="heading-section text-3xl">Toda Embroidery</h2>
                            <p className="text-story">
                                Exclusive to the Toda tribe of the Nilgiris, this unique embroidery looks like a woven cloth but is actually stitched.
                                The bold red and black patterns on white are striking, but the younger generation is moving away from this tradition.
                            </p>
                            <Link href="/products?tag=toda">
                                <Button className="bg-heritage-600 hover:bg-heritage-700 text-white">
                                    Support This Craft
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-20 bg-white p-12 rounded-2xl shadow-lg text-center space-y-6">
                    <h2 className="heading-section text-3xl">How You Can Help</h2>
                    <p className="text-story max-w-2xl mx-auto">
                        Every purchase you make acts as a vote for the survival of these crafts.
                        We also contribute 5% of our profits directly to craft preservation foundations.
                    </p>
                    <Button size="lg" className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-8">
                        Donate to Heritage Fund
                    </Button>
                </div>
            </div>
        </div>
    );
}
