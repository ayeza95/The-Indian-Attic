import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';

export default function LocallyRareBadge() {
    return (
        <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white gap-1">
            <Globe className="h-3 w-3" />
            Locally Famous, Globally Rare
        </Badge>
    );
}
