import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Linkedin, Heart, Users, Globe, Github } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-heritage-50 pb-20">
            {/* Hero Section */}
            <section className="relative h-[30vh] w-full overflow-hidden flex items-center justify-center bg-heritage-900">
                <div className="absolute inset-0 bg-[url('/images/hero.png')] opacity-20 bg-cover bg-center" />
                <div className="relative z-10 text-center px-4 max-w-4xl space-y-6">
                    <span className="text-heritage-200 font-medium tracking-wider uppercase text-sm">Our Story</span>
                    <h1 className="heading-display text-white text-3xl md:text-5xl">
                        Bridging Heritage & Modernity
                    </h1>
                    <p className="text-xl text-heritage-100 max-w-2xl mx-auto font-light leading-relaxed">
                        The Indian Attic is not just a marketplace; it's a movement to preserve the soul of India.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* CEO Profile Card */}
                    <div className="h-full">
                        <Card className="overflow-hidden border-none shadow-2xl bg-white h-full py-8">
                            <div className="relative h-80 w-72 mx-auto overflow-hidden border-4 border-heritage-100 shadow-xl">
                                <Image
                                    src="/images/AYEZA.png"
                                    alt="Ayeza Fatima"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <CardContent className="p-8 text-center space-y-4">
                                <div>
                                    <h2 className="heading-section text-3xl">Ayeza Fatima</h2>
                                    <p className="text-heritage-600 font-medium">Founder & CEO</p>
                                </div>
                                <p className="text-story italic text-heritage-700">
                                    "I founded The Indian Attic with a simple belief: our heritage is too precious to be forgotten in dusty corners. It belongs in our living rooms, our daily lives, and our hearts."
                                </p>
                                <div className="flex justify-center pt-4 gap-4">
                                    <Link href="https://www.linkedin.com/in/ayeza-fatima-b80544325/" target="_blank">
                                        <Button variant="outline" className="gap-2 border-heritage-200 text-heritage-700 hover:text-heritage-900">
                                            <Linkedin className="h-4 w-4" /> Connect on LinkedIn
                                        </Button>
                                    </Link>
                                    <Link href="https://github.com/ayeza95" target="_blank">
                                        <Button variant="outline" className="gap-2 border-heritage-200 text-heritage-700 hover:text-heritage-900 px-6">
                                            <Github className="h-4 w-4" /> Follow on Github
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Vision Content */}
                    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl space-y-8 h-full">
                        <div>
                            <h2 className="heading-section text-3xl mb-6 text-heritage-900">Why The Indian Attic?</h2>
                            <div className="space-y-6 text-story text-heritage-800">
                                <p>
                                    Growing up in India, I watched as skilled artisans struggled to compete with mass-produced factory goods.
                                    Beautiful, centuries-old crafts were slowly dying out because they lacked a platform to reach the modern world.
                                </p>
                                <p>
                                    The Indian Attic was born to change that narrative. We are building a bridge between the rural artisan in Kutch
                                    and the modern home in New York, London, or Mumbai.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-6">
                            <div className="flex gap-4 p-4 bg-heritage-50 rounded-xl border border-heritage-100">
                                <div className="bg-white p-3 rounded-full h-fit shadow-sm">
                                    <Users className="h-6 w-6 text-heritage-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-heritage-900">Empowering Artisans</h3>
                                    <p className="text-heritage-600 text-sm mt-1">
                                        We cut out the middlemen. Artisans set their own prices and ship directly, ensuring they earn a dignified livelihood.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 p-4 bg-heritage-50 rounded-xl border border-heritage-100">
                                <div className="bg-white p-3 rounded-full h-fit shadow-sm">
                                    <Heart className="h-6 w-6 text-terracotta-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-heritage-900">Preserving Culture</h3>
                                    <p className="text-heritage-600 text-sm mt-1">
                                        Every purchase helps keep a traditional art form alive, preventing it from becoming just a memory in a museum.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 p-4 bg-heritage-50 rounded-xl border border-heritage-100">
                                <div className="bg-white p-3 rounded-full h-fit shadow-sm">
                                    <Globe className="h-6 w-6 text-saffron-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-heritage-900">Global Recognition</h3>
                                    <p className="text-heritage-600 text-sm mt-1">
                                        We give Indian craftsmanship the global stage it deserves, branded as premium, luxury heritage.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
// End of component
