import { Badge } from '@/components/ui/badge';
import { AuthenticityTag } from '@/models/Product';
import { Award, Leaf, HandMetal, Sprout, Hammer } from 'lucide-react';

interface AuthenticityTagsProps {
    tags: AuthenticityTag[];
}

const tagConfig: Record<AuthenticityTag, { label: string; icon: any }> = {
    handmade: {
        label: 'Handmade',
        icon: HandMetal,
    },
    gi_tagged: {
        label: 'GI Tagged',
        icon: Award,
    },
    natural: {
        label: 'Natural',
        icon: Leaf,
    },
    direct_from_artisan: {
        label: 'Direct from Artisan',
        icon: Hammer,
    },
    organic: {
        label: 'Organic',
        icon: Sprout,
    },
    traditional_method: {
        label: 'Traditional Method',
        icon: Hammer,
    },
};

export default function AuthenticityTags({ tags }: AuthenticityTagsProps) {
    if (!tags || tags.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
                const config = tagConfig[tag];
                const Icon = config.icon;

                return (
                    <Badge key={tag} variant="outline" className="gap-1">
                        <Icon className="h-3 w-3" />
                        {config.label}
                    </Badge>
                );
            })}
        </div>
    );
}
