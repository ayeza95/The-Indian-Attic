import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from './mongodb';
import User from '@/models/User';

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please provide email and password');
                }

                // Check static admin credentials first
                const { validateAdminCredentials } = await import('@/lib/admin-credentials');
                const admin = validateAdminCredentials(
                    credentials.email as string,
                    credentials.password as string
                );

                if (admin) {
                    await connectDB();
                    // Check if this admin already exists in the database
                    let dbAdmin = await User.findOne({ email: admin.email });

                    if (!dbAdmin) {
                        // Create admin record in DB if it doesn't exist
                        dbAdmin = await User.create({
                            email: admin.email,
                            password: await bcrypt.hash(admin.password, 10),
                            name: admin.name,
                            role: 'admin',
                            isActive: true
                        });
                    } else if (dbAdmin.name !== admin.name) {
                        // Update name if it changed (e.g. from Super Admin to Admin)
                        dbAdmin.name = admin.name;
                        await dbAdmin.save();
                    }

                    return {
                        id: dbAdmin._id.toString(),
                        email: dbAdmin.email,
                        name: dbAdmin.name,
                        role: dbAdmin.role,
                        phone: dbAdmin.phone,
                        businessName: dbAdmin.businessName,
                    };
                }

                // Check database for regular users
                await connectDB();

                const user = await User.findOne({ email: credentials.email });

                if (!user) {
                    throw new Error('No user found with this email');
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (!isPasswordValid) {
                    throw new Error('Invalid password');
                }

                if (!user.isActive) {
                    throw new Error('Account is deactivated');
                }

                if (user.isBanned) {
                    throw new Error('Your account has been permanently banned for violating community guidelines.');
                }

                // For artisans, check verification status
                if (user.role === 'artisan' && user.verificationStatus !== 'verified') {
                    throw new Error('Your artisan account is pending verification');
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    phone: user.phone,
                    businessName: user.businessName,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session: sessionData }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
                token.phone = user.phone;
                token.businessName = user.businessName;
                token.name = user.name;
            }

            // Handle session updates (e.g., profile or preferences changes)
            if (trigger === 'update') {
                await connectDB();
                const dbUser = await User.findById(token.id);
                if (dbUser) {
                    // Update legacy "Super Admin" name if found
                    if (dbUser.name === "Super Admin") {
                        dbUser.name = "Admin";
                        await dbUser.save();
                    }
                    token.name = dbUser.name;
                    token.phone = dbUser.phone;
                    token.businessName = dbUser.businessName;
                    token.role = dbUser.role;
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as string;
                session.user.id = token.id as string;
                session.user.phone = token.phone as string;
                session.user.businessName = token.businessName as string;
                session.user.name = token.name as string;
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/login',
        error: '/auth/error',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    trustHost: true,
});
