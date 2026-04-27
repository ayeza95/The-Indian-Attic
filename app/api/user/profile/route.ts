import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req: NextRequest) {
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const user = await User.findById(session.user.id).select('-password');

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                businessName: user.businessName,
                originState: user.originState,
                culturalPreferences: user.culturalPreferences || { festivals: [], interests: [] },
                warningCount: user.warningCount || 0,
                isRestricted: user.isRestricted || false,
                isBanned: user.isBanned || false,
            },
        }, { status: 200 });
    } catch (error: any) {
        console.error('Profile fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await auth();

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const body = await req.json();
        const { name, phone, businessName, originState, festivals, interests } = body;

        const updateData: any = {};
        if (name) updateData.name = name;
        if (phone !== undefined) {
            // Server-side validation: only 10 digits
            const cleanedPhone = phone.replace(/\D/g, '').slice(0, 10);
            updateData.phone = cleanedPhone;
        }
        if (businessName !== undefined) updateData.businessName = businessName;

        // Handle Buyer Preferences
        if (originState !== undefined) updateData.originState = originState || null;

        if (festivals !== undefined || interests !== undefined) {
            updateData.culturalPreferences = {
                festivals: Array.isArray(festivals) ? festivals : (festivals ? festivals.split(',').map((s: string) => s.trim()) : []),
                interests: Array.isArray(interests) ? interests : (interests ? interests.split(',').map((s: string) => s.trim()) : [])
            };
        }

        const user = await User.findByIdAndUpdate(
            session.user.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                businessName: user.businessName,
                originState: user.originState,
                culturalPreferences: user.culturalPreferences,
                warningCount: user.warningCount || 0,
                isRestricted: user.isRestricted || false,
                isBanned: user.isBanned || false,
            },
        }, { status: 200 });
    } catch (error: any) {
        console.error('Profile update error:', error);
        return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
        );
    }
}
