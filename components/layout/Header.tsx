'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, Menu, LogOut, LogIn, UserPlus } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const checkTheme = () => {
            setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
        };
        checkTheme();
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', checkTheme);
        return () => mediaQuery.removeEventListener('change', checkTheme);
    }, []);

    const isActive = (path: string) => {
        return pathname === path || (path !== '/' && pathname?.startsWith(path));
    };

    const linkClass = (path: string) => `text-sm font-medium transition-colors ${isActive(path)
        ? 'text-heritage-900 font-bold decoration-2 underline-offset-4 underline decoration-heritage-500'
        : 'text-heritage-700 hover:text-heritage-900'
        }`;

    const navLinks = [
        { href: '/states', label: 'Explore by State' },
        { href: '/products', label: 'All Products' },
        { href: '/swadesibox', label: 'SwadesiBox' },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-heritage-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between lg:px-12">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center space-x-2">
                        {/* Small screen logo */}
                        <div className="block sm:hidden relative w-16 h-16">
                            <Image
                                src={isDarkMode ? "/images/logo-dark.png" : "/images/logo-light.png"}
                                alt="TIA Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        {/* Medium/Large screen logo */}
                        <span className="hidden sm:block font-display text-2xl md:text-xl lg:text-2xl font-bold text-gold">
                            The Indian Attic
                        </span>
                    </Link>

                    {/* Desktop Navigation (Large screens only) */}
                    <nav className="hidden lg:flex items-center space-x-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={linkClass(link.href)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions Section */}
                    <div className="flex items-center space-x-4">
                        {/* Large screen actions */}
                        <div className="hidden lg:flex items-center space-x-4">
                            <Button asChild variant="outline" size="icon" className="border-heritage-200">
                                <Link href="/cart">
                                    <ShoppingCart className="h-5 w-5" />
                                </Link>
                            </Button>

                            {session ? (
                                <div className="flex items-center space-x-2">
                                    <Button asChild variant="ghost" size="icon">
                                        <Link href={`/dashboard/${session.user.role}`}>
                                            <User className="h-5 w-5" />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                    >
                                        Sign Out
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Button asChild variant="outline" size="sm" className="border-heritage-200">
                                        <Link href="/auth/login">
                                            Sign In
                                        </Link>
                                    </Button>
                                    <Button asChild size="sm" className="bg-heritage-900 border-heritage-900 hover:bg-heritage-800">
                                        <Link href="/auth/register">
                                            Get Started
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Mobile/Medium Menu Toggle */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" className="lg:hidden hover:bg-transparent p-0 h-auto w-auto">
                                    <Menu className="h-12 w-12" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <SheetHeader>
                                    <SheetTitle className="text-left font-display text-gold">
                                        The Indian Attic
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col space-y-4 mt-8">
                                    {/* Navigation Links in Mobile */}
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`${linkClass(link.href)} text-lg py-2`}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}

                                    <hr className="border-heritage-100" />

                                    {/* Action items in Mobile */}
                                    <Link href="/cart" className="flex items-center space-x-3 text-heritage-700 hover:text-heritage-900 py-2">
                                        <ShoppingCart className="h-5 w-5" />
                                        <span className="text-lg font-medium">Cart</span>
                                    </Link>

                                    {session ? (
                                        <>
                                            <Link href={`/dashboard/${session.user.role}`} className="flex items-center space-x-3 text-heritage-700 hover:text-heritage-900 py-2">
                                                <User className="h-5 w-5" />
                                                <span className="text-lg font-medium">Profile Dashboard</span>
                                            </Link>
                                            <button
                                                onClick={() => signOut({ callbackUrl: '/' })}
                                                className="flex items-center space-x-3 text-heritage-700 hover:text-heritage-900 py-2 w-full text-left"
                                            >
                                                <LogOut className="h-5 w-5" />
                                                <span className="text-lg font-medium">Sign Out</span>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/auth/login" className="flex items-center space-x-3 text-heritage-700 hover:text-heritage-900 py-2">
                                                <LogIn className="h-5 w-5" />
                                                <span className="text-lg font-medium">Sign In</span>
                                            </Link>
                                            <Link href="/auth/register" className="flex items-center space-x-3 text-heritage-700 hover:text-heritage-900 py-2">
                                                <UserPlus className="h-5 w-5" />
                                                <span className="text-lg font-medium">Get Started</span>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}
