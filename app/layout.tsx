import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/components/providers/CartProvider";
import { WishlistProvider } from "@/context/WishlistContext";
import { Toaster } from "sonner";
import GlobalBackButton from "@/components/ui/GlobalBackButton";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
    display: "swap",
});

export const metadata: Metadata = {
    title: "The Indian Attic - Rediscover Authentic Indian Heritage",
    description: "A culture-first marketplace for NRIs to rediscover authentic Indian products rooted in home, memory, and regional identity. Explore traditional crafts, foods, and cultural treasures by region.",
    keywords: ["Indian crafts", "traditional products", "NRI marketplace", "authentic Indian goods", "heritage products", "artisan crafts"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${playfair.variable} ${inter.variable} font-sans antialiased`}>
                <SessionProvider>
                    <CartProvider>
                        <WishlistProvider>
                            <Header />
                            {children}
                            <Footer />
                            <GlobalBackButton />
                        </WishlistProvider>
                    </CartProvider>
                    <Toaster position="bottom-right" richColors />
                </SessionProvider>
            </body>
        </html>
    );
}
