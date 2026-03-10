import { CheckCircle, AlertTriangle, XCircle, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type BadgeStatus =
    | 'on-track' | 'at-risk' | 'delayed' | 'overloaded'
    | 'completed' | 'in-progress' | 'not-started' | 'blocked';

interface StatusBadgeProps {
    status: BadgeStatus;
    size?: 'sm' | 'md';
}

interface StatusConfig {
    label: string;
    className?: string;
    style?: { background: string; color: string; border: string };
    icon: LucideIcon | null;
}

const STATUS_CONFIG: Record<BadgeStatus, StatusConfig> = {
    'on-track': { label: 'On Track', className: 'badge-on-track', icon: CheckCircle },
    'at-risk': { label: 'At Risk', className: 'badge-at-risk', icon: AlertTriangle },
    'delayed': { label: 'Delayed', className: 'badge-delayed', icon: XCircle },
    'overloaded': { label: 'Overloaded', className: 'badge-overloaded', icon: Zap },
    'completed': { label: 'Completed', className: 'badge-on-track', icon: CheckCircle },
    'in-progress': { label: 'In Progress', className: 'badge-at-risk', icon: AlertTriangle },
    'not-started': {
        label: 'Not Started',
        style: { background: '#F1F5F9', color: '#64748B', border: '1px solid #E2E8F0' },
        icon: null,
    },
    'blocked': { label: 'Blocked', className: 'badge-delayed', icon: XCircle },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
    const config = STATUS_CONFIG[status];
    const Icon = config.icon;
    const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full font-semibold ${sizeClass} ${config.className ?? ''}`}
            style={config.style}
        >
            {Icon && <Icon size={10} />}
            {config.label}
        </span>
    );
}
