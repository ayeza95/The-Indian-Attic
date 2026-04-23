import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import connectDB from '@/lib/mongodb';
import State from '@/models/State';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

// Fetch states from the database
async function getStates() {
    await connectDB();
    // Fetch all states, sorted alphabetically
    const states = await State.find({}).sort({ name: 1 }).lean();


    // Convert MongoDB objects to plain objects
    return states.map((state: any) => ({
        ...state,
        _id: state._id.toString(),
        name: state.name,
        image: state.image,
        description: state.description || '',
    }));
}

export default async function StatesPage() {
    const session = await auth();
    if (session?.user?.role === 'admin') {
        redirect('/admin/states');
    }
    const states = await getStates();

    return (
        <div className="min-h-screen bg-heritage-50">
            {/* Header */}
            <div className="bg-heritage-900 text-gold-50 py-16 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="heading-display text-4xl md:text-5xl mb-4 text-gold-300">
                        Explore by Region
                    </h1>
                    <p className="text-xl font-light text-heritage-200 max-w-2xl mx-auto">
                        Discover the unique crafts, traditions, and stories woven into the fabric of every Indian state.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 -mt-8">
                {states.length === 0 ? (
                    <Card className="bg-white/80 backdrop-blur">
                        <CardContent className="py-12 text-center">
                            <p className="text-heritage-600 mb-4">
                                No states available yet.
                            </p>
                            <p className="text-sm text-heritage-500">
                                States and districts will be added soon. Check back later.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {states.map((state: any) => (
                            <div key={state._id} className="group h-full relative">
                                <Card className="h-full border border-heritage-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-white flex flex-col relative">

                                    {/* Clickable Overlay */}
                                    <Link
                                        href={`/states/${state._id}`}
                                        className="absolute inset-0 z-10"
                                        aria-label={`Explore ${state.name}`}
                                    />

                                    {/* Image Section */}
                                    <div className="relative h-48 overflow-hidden bg-heritage-800">
                                        {state.image ? (
                                            <div className="relative h-full w-full">
                                                <img
                                                    src={state.image}
                                                    alt={state.name}
                                                    className="object-cover h-full w-full opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-heritage-900/80 to-transparent" />
                                            </div>
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-heritage-100 text-heritage-300">
                                                <span className="text-4xl opacity-50">🏛️</span>
                                            </div>
                                        )}

                                        {/* Title + Admin Edit */}
                                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                            <h2 className="text-2xl font-display font-bold text-white group-hover:text-gold-300 transition-colors pointer-events-none">
                                                {state.name}
                                            </h2>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <CardContent className="p-6 flex-grow flex flex-col pointer-events-none">
                                        <p className="text-heritage-600 mb-4 line-clamp-3 flex-grow">
                                            {state.description}
                                        </p>

                                        <div className="pt-4 border-t border-heritage-50 flex items-center justify-between text-sm">
                                            <span className="text-heritage-400 font-medium">
                                                Explore Crafts →
                                            </span>
                                            <span className="bg-heritage-100 text-heritage-700 px-2 py-1 rounded text-xs">
                                                Active
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
