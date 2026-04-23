import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password, name, role, ...roleSpecificData } = body;

        // Validation
        if (!email || !password || !name || !role) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (!['buyer', 'artisan'].includes(role)) {
            return NextResponse.json(
                { error: 'Invalid role' },
                { status: 400 }
            );
        }

        await connectDB();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user with role-specific data
        const userData: any = {
            email,
            password: hashedPassword,
            name,
            role,
        };

        if (role === 'buyer') {
            userData.originState = roleSpecificData.originState;
            userData.culturalPreferences = roleSpecificData.culturalPreferences;
            userData.deliveryCountry = roleSpecificData.deliveryCountry;
        } else if (role === 'artisan') {
            userData.businessName = roleSpecificData.businessName;
            userData.craftSpecialization = roleSpecificData.craftSpecialization;
            userData.artisanLineage = roleSpecificData.artisanLineage;
            userData.generationalCraft = roleSpecificData.generationalCraft;
            userData.yearsOfExperience = roleSpecificData.yearsOfExperience;
            userData.verificationStatus = 'pending';
        }

        const user = await User.create(userData);

        return NextResponse.json(
            {
                message: 'User registered successfully',
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Failed to register user' },
            { status: 500 }
        );
    }
}
