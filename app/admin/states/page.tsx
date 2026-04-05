import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import State from '@/models/State';
import EditStateModal from '@/components/admin/EditStateModal';
import { auth } from '@/lib/auth';

// Fetch states from the database
async function getStates() {
    await connectDB();
    // Fetch all states, sorted alphabetically
    const states = await State.find({}).sort({ name: 1 }).lean();

    // Convert MongoDB objects to plain objects
    return states.map((state: any) => ({
        _id: state._id.toString(),
        name: state.name,
        image: state.image || '', // Fix: Ensure this is always a string
        description: state.description || '',
    }));
}

export default async function AdminStatesPage() {
    const session = await auth();
    if (session?.user?.role !== 'admin') {
        redirect('/');
    }

    const states = await getStates();

    return (
        <div className="min-h-screen bg-heritage-50 py-12">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-heritage-900">Manage States</h1>
                        <p className="text-heritage-600 mt-2">Update state images and descriptions</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {states.map((state) => (
                        <div key={state._id} className="group bg-white rounded-xl shadow-sm border border-heritage-100 overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative">
                            {/* Link Overlay */}
                            <Link
                                href={`/states/${state._id}`}
                                className="absolute inset-0 z-0"
                                aria-label={`View products from ${state.name}`}
                            />

                            {/* State Image Preview */}
                            <div className="relative h-48 w-full bg-heritage-100 overflow-hidden">
                                <Image
                                    src={state.image || '/images/placeholder.png'}
                                    alt={state.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                            </div>

                            {/* State Details & Edit Button */}
                            <div className="p-4 flex-1 flex flex-col relative z-20 pointer-events-none">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-heritage-900 group-hover:text-heritage-600 transition-colors">{state.name}</h3>
                                </div>
                                <p className="text-sm text-heritage-600 mb-4 line-clamp-2 flex-1">
                                    {state.description || "No description provided."}
                                </p>
                                <div className="flex justify-end pt-4 border-t border-heritage-50 pointer-events-auto">
                                    {/* This is the modal component you provided */}
                                    <EditStateModal state={state} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
