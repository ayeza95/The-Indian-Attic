'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function GlobalBackButton() {
    const router = useRouter();
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only show button if we are NOT on the homepage
        if (pathname !== '/') {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [pathname]);

    if (!isVisible) return null;

    return (
        <Button
            onClick={() => router.back()}
            variant="outline"
            size="icon"
            className={cn(
                "fixed top-24 left-8 z-50 rounded-full shadow-lg border-heritage-200 bg-white/80 backdrop-blur-sm text-heritage-800 hover:bg-heritage-100 hover:text-heritage-900 transition-all duration-300",
                "h-12 w-12"
            )}
            title="Go Back"
        >
            <ArrowLeft className="h-6 w-6" />
        </Button>
    );
}
