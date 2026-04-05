import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { ArrowRight, Heart } from 'lucide-react';
import GovernmentInitiative from '@/components/home/GovernmentInitiative';

async function getFeaturedProducts() {
    await connectDB();
    // Fetch 4 items, preferably with images
    const products = await Product.find({ isActive: true, isHidden: { $ne: true } })
        .sort({ createdAt: -1 })
        .limit(4)
        .lean();

    return products.map(p => ({
        ...p,
        _id: p._id.toString(),
    }));
}

export default async function HomePage() {
    // const featuredProducts = await getFeaturedProducts(); // Commented out for now as it's not used in current UI

    return (
        <main className="min-h-screen bg-heritage-50/30">
            {/* Hero Section */}
            <section className="relative h-[90vh] w-full overflow-hidden">
                <Image
                    src="/images/home-page.png"
                    alt="The Indian Attic Heritage"
                    fill
                    className="object-cover opacity-90"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-transparent flex items-center justify-center text-center px-4">
                    <div className="max-w-4xl space-y-6 animate-in fade-in zoom-in duration-1000">
                        <h3 className="heading-display text-gold text-2xl sm:text-3xl md:text-5xl drop-shadow-2xl leading-tight">
                            From Indian Hands to Global Homes
                        </h3>
                        <p className="text-xl md:text-2xl text-heritage-100 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
                            A curated marketplace where meaningful, everyday heritage is kept, preserved, and cherished.
                        </p>
                        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="bg-heritage-500 hover:bg-heritage-600 text-white min-w-[200px] text-lg py-6 glow-shadow">
                                <Link href="/products">
                                    Explore Collection
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur border-white text-white hover:bg-white hover:text-heritage-900 min-w-[200px] text-lg py-6">
                                <Link href="/swadesibox">
                                    Join SwadesiBox
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="py-20 container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <span className="text-heritage-600 font-medium tracking-wider uppercase text-sm">Our Philosophy</span>
                    <h2 className="heading-section text-4xl">Rediscover Your Roots</h2>
                    <p className="text-story">
                        In every corner of India, there's a story waiting to be told. From the clay pots of Kutch to the weaves of Varanasi,
                        we bring you authentic products that carry the soul of their makers.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl group">
                        <Image
                            src="/images/wool.png"
                            alt="Artisan Crafting Pottery"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                            <div className="text-white">
                                <h3 className="text-2xl font-bold mb-2">Hands of Heritage</h3>
                                <p className="text-heritage-100">Supporting thousands of skilled artisans across rural India.</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-8">
                        <div className="flex gap-6 items-start p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-12 w-12 bg-heritage-100 rounded-full flex items-center justify-center shrink-0">
                                <Heart className="h-6 w-6 text-heritage-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-heritage-900 mb-2">Ethically Sourced</h3>
                                <p className="text-heritage-600 leading-relaxed">
                                    Every product is sourced directly from artisans, ensuring fair wages and sustainable livelihoods.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6 items-start p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-12 w-12 bg-terracotta-100 rounded-full flex items-center justify-center shrink-0">
                                <span className="text-2xl text-terracotta-600">🇮🇳</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-heritage-900 mb-2">Pan-India Discovery</h3>
                                <p className="text-heritage-600 leading-relaxed">
                                    Explore India's diversity through its crafts. Filter by state or cultural region.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6 items-start p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-12 w-12 bg-saffron-100 rounded-full flex items-center justify-center shrink-0">
                                <span className="text-2xl">📦</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-heritage-900 mb-2">SwadesiBox</h3>
                                <p className="text-heritage-600 leading-relaxed">
                                    A curated quarterly subscription box bringing the best of India's hidden gems to your doorstep.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Spotlight Collections */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-gold-600 font-medium tracking-wider uppercase text-sm">Curated Categories</span>
                        <h2 className="heading-section text-4xl mt-2">Spotlight Collections</h2>
                        <p className="text-story mt-4">Handpicked treasures that define the essence of Indian luxury and tradition.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="group relative h-[400px] overflow-hidden rounded-xl cursor-pointer">
                            <Image
                                src="/images/collection-silk.png"
                                alt="Royal Textiles"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                                <h3 className="text-white text-2xl font-display font-bold mb-2">Royal Textiles</h3>
                                <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300">
                                    Banarasi, Kanjeevaram, and Chanderi silks fit for royalty.
                                </p>
                            </div>
                        </div>

                        <div className="group relative h-[400px] overflow-hidden rounded-xl cursor-pointer">
                            <Image
                                src="/images/collection-decors.png"
                                alt="Timeless Decor"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                                <h3 className="text-white text-2xl font-display font-bold mb-2">Timeless Decor</h3>
                                <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300">
                                    Brass artifacts, Madhubani art, and handcrafted stone carvings.
                                </p>
                            </div>
                        </div>

                        <div className="group relative h-[400px] overflow-hidden rounded-xl cursor-pointer">
                            <Image
                                src="/images/collection-crafts.png"
                                alt="Vedic Wellness"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-heritage-900/40 group-hover:bg-transparent transition-colors duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                                <h3 className="text-white text-2xl font-display font-bold mb-2">Vedic Wellness</h3>
                                <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300">
                                    Pure copper vessels, herbal infusions, and organic spices.
                                </p>
                            </div>
                        </div>

                        <div className="group relative h-[400px] overflow-hidden rounded-xl cursor-pointer">
                            <Image
                                src="/images/collection-stone.png"
                                alt="Heirloom Jewelry"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-heritage-900/40 group-hover:bg-transparent transition-colors duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                                <h3 className="text-white text-2xl font-display font-bold mb-2">Heirloom Crafts</h3>
                                <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300">
                                    Intricate silverwork, tribal jewelry, and precious stones.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Heritage Process */}
            <section className="py-24 bg-heritage-900 overflow-hidden relative">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-saffron-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2 space-y-8">
                            <h2 className="heading-display text-5xl text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-100 to-gold-400">
                                From Soil to Soul
                            </h2>
                            <p className="text-xl text-heritage-200 leading-relaxed font-light">
                                Every artifact in The Indian Attic is not just made; it is born. Born from the earth, shaped by hands utilizing techniques older than written history, and finished with the blessings of an artisan.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-full border border-gold-500/30 flex items-center justify-center text-gold-400 font-bold bg-heritage-800">1</div>
                                    <div>
                                        <h3 className="text-gold-200 font-bold text-lg">Sourcing</h3>
                                        <p className="text-heritage-300 text-sm">Ethically gathering raw natural materials from their native regions.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-full border border-gold-500/30 flex items-center justify-center text-gold-400 font-bold bg-heritage-800">2</div>
                                    <div>
                                        <h3 className="text-gold-200 font-bold text-lg">Crafting</h3>
                                        <p className="text-heritage-300 text-sm">Weeks of meticulous hand-craftsmanship using generational skills.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-full border border-gold-500/30 flex items-center justify-center text-gold-400 font-bold bg-heritage-800">3</div>
                                    <div>
                                        <h3 className="text-gold-200 font-bold text-lg">Curating</h3>
                                        <p className="text-heritage-300 text-sm">Quality checked and packaged with the story of its maker.</p>
                                    </div>
                                </div>
                            </div>

                            <Button asChild className="bg-gold-500 text-heritage-950 hover:bg-gold-400 px-8 py-6 rounded-none text-lg font-medium tracking-wide mt-4">
                                <Link href="/about">
                                    Discover Our Journey
                                </Link>
                            </Button>
                        </div>

                        <div className="lg:w-1/2 relative h-[600px] w-full">
                            <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-2xl border border-heritage-700/50">
                                <Image
                                    src="/images/story-pottery.png"
                                    alt="Artisan at work"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-heritage-950/90 to-transparent"></div>
                                <div className="absolute bottom-10 left-10 right-10">
                                    <blockquote className="text-gold-100 font-display text-2xl italic leading-relaxed">
                                        &quot;When you buy handmade, you are buying more than an object. You are buying hundreds of hours of errors and experimentation.&quot;
                                    </blockquote>
                                    <p className="text-gold-500 mt-4 font-bold">— Traditional Artisan Wisdom</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-saffron-50/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="heading-section text-4xl">Voices of Heritage</h2>
                        <div className="h-1 w-20 bg-gold-400 mx-auto mt-4 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="bg-white border-none shadow-lg hover:-translate-y-2 transition-transform duration-300">
                            <CardContent className="p-8">
                                <div className="flex gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <span key={s} className="text-gold-500 text-xl">★</span>
                                    ))}
                                </div>
                                <p className="text-heritage-700 italic mb-6 leading-relaxed">
                                    &quot;I found the exact brass lamp setup my grandmother used to have. The packaging was beautiful, and it felt like unboxing a memory.&quot;
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-heritage-200 flex items-center justify-center text-heritage-700 font-bold">
                                        AP
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-heritage-900">Anjali P.</h4>
                                        <p className="text-sm text-heritage-500">London, UK</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border-none shadow-lg hover:-translate-y-2 transition-transform duration-300">
                            <CardContent className="p-8">
                                <div className="flex gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <span key={s} className="text-gold-500 text-xl">★</span>
                                    ))}
                                </div>
                                <p className="text-heritage-700 italic mb-6 leading-relaxed">
                                    &quot;The authenticity is unmatched. Knowing that my purchase directly supports a family in Kutch makes the beautiful shawl even more special.&quot;
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-heritage-200 flex items-center justify-center text-heritage-700 font-bold">
                                        RK
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-heritage-900">Rahul K.</h4>
                                        <p className="text-sm text-heritage-500">Bangalore, India</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border-none shadow-lg hover:-translate-y-2 transition-transform duration-300">
                            <CardContent className="p-8">
                                <div className="flex gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <span key={s} className="text-gold-500 text-xl">★</span>
                                    ))}
                                </div>
                                <p className="text-heritage-700 italic mb-6 leading-relaxed">
                                    &quot;SwadesiBox is the highlight of my quarter. Discovering new Indian crafts I didn't even know existed is a joy.&quot;
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-heritage-200 flex items-center justify-center text-heritage-700 font-bold">
                                        SM
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-heritage-900">Sarah M.</h4>
                                        <p className="text-sm text-heritage-500">New York, USA</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Government Support Section */}
            <GovernmentInitiative />
        </main>
    );
}
