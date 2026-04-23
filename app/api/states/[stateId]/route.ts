import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import State from '@/models/State';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ stateId: string }> }
) {
    try {
        const session = await auth();
        console.log("Admin Update Attempt - User:", session?.user?.email, "Role:", session?.user?.role);
        
        // Ensure user is admin
        if (session?.user?.role !== 'admin') {
            console.log("Update failed: User is not admin");
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Await params before accessing stateId
        const { stateId } = await params;
        
        const body = await request.json();
        
        await connectDB();
        
        const updatedState = await State.findByIdAndUpdate(
            stateId,
            { 
                image: body.image,
                description: body.description 
            },
            { new: true }
        );

        if (!updatedState) {
            console.log("Update failed: State ID not found", stateId);
            return new NextResponse("State not found", { status: 404 });
        }

        // Clear the cache for these pages so the new image shows up immediately
        revalidatePath('/states');
        revalidatePath('/admin/states');
        revalidatePath(`/states/${stateId}`);

        return NextResponse.json(updatedState);
    } catch (error) {
        console.error('[STATE_UPDATE_ERROR]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}