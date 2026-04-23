import { Badge } from '@/components/ui/badge';
import { CraftStatus } from '@/models/Product';
import { AlertTriangle, TrendingDown, AlertCircle, Skull } from 'lucide-react';

interface CraftStatusBadgeProps {
    status: CraftStatus;
    showIcon?: boolean;
}

const statusConfig = {
    stable: {
        label: 'Stable Craft',
        variant: 'success' as const,
        icon: null,
    },
    declining: {
        label: 'Declining',
        variant: 'warning' as const,
        icon: TrendingDown,
    },
    endangered: {
        label: 'Endangered',
        variant: 'danger' as const,
        icon: AlertTriangle,
    },
    critically_rare: {
        label: 'Critically Rare',
        variant: 'danger' as const,
        icon: Skull,
    },
};

export default function CraftStatusBadge({ status, showIcon = true }: CraftStatusBadgeProps) {
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <Badge variant={config.variant} className="gap-1">
            {showIcon && Icon && <Icon className="h-3 w-3" />}
            {config.label}
        </Badge>
    );
}
