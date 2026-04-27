import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
    try {
        await connectDB();
        const result = await User.updateMany(
            { name: "Super Admin" },
            { name: "Admin" }
        );
        return NextResponse.json({ 
            success: true, 
            message: `Updated ${result.modifiedCount} users.`,
            details: result
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
