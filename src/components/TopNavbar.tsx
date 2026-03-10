import { useState, useEffect } from 'react';
import { Bell, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../context/AuthContext';

const PAGE_TITLES: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/checkin': 'Daily Check-In',
    '/projects': 'My Projects',
    '/team': 'Team View',
    '/reports': 'Reports',
    '/settings': 'Settings',
};

const ROLE_LABELS: Record<Role, string> = {
    employee: 'Employee',
    manager: 'Manager',
    projectlead: 'Project Lead',
    unithead: 'Unit Head',
    marketing: 'Marketing',
};

const ROLE_COLORS: Record<Role, { bg: string; text: string }> = {
    employee: { bg: '#dcfce7', text: '#166534' },
    manager: { bg: '#fef9c3', text: '#854d0e' },
    projectlead: { bg: '#dbeafe', text: '#1e40af' },
    unithead: { bg: '#ede9fe', text: '#5b21b6' },
    marketing: { bg: '#fce7f3', text: '#9d174d' },
};

const notifications = [
    { id: 1, text: 'Ravi Kumar is overloaded (110% utilization)', time: '5 min ago', type: 'danger' },
    { id: 2, text: 'Tunnel Structural Analysis: Task delayed 3 days', time: '2 hrs ago', type: 'warning' },
    { id: 3, text: 'Smart Grid Layout Tool 45% completion — at risk', time: '4 hrs ago', type: 'warning' },
];

interface TopNavbarProps {
    currentPath: string;
}

export default function TopNavbar({ currentPath }: TopNavbarProps) {
    const { user } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!user) return null;

    const title = PAGE_TITLES[currentPath] ?? 'EffortIQ';
    const roleStyle = ROLE_COLORS[user.role];

    return (
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div>
                <h1 className="text-base font-heading font-bold text-slate-800">{title}</h1>
                <p className="text-xs text-slate-400">EffortIQ — Smart Work Tracking Platform</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                    <Clock size={13} />
                    <span className="font-mono-data">
                        {time.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                        &nbsp;|&nbsp;
                        {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(v => !v)}
                        className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
                    >
                        <Bell size={18} />
                        <span className="notif-dot" />
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 top-10 bg-white rounded-xl shadow-xl border border-slate-100 w-80 z-50" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                            <div className="px-4 py-3 border-b border-slate-100">
                                <h3 className="text-sm font-heading font-semibold text-slate-800">Notifications</h3>
                                <p className="text-xs text-slate-400">{notifications.length} alerts</p>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {notifications.map(n => (
                                    <div key={n.id} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-start gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${n.type === 'danger' ? 'bg-red-500' : 'bg-amber-400'}`} />
                                            <div>
                                                <p className="text-xs text-slate-700 leading-relaxed">{n.text}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: '#003366' }}>
                        {user.avatar}
                    </div>
                    <div className="hidden md:block">
                        <div className="text-xs font-semibold text-slate-800">{user.name}</div>
                        <div className="text-xs font-medium px-1.5 py-0.5 rounded-full" style={{ background: roleStyle.bg, color: roleStyle.text }}>
                            {ROLE_LABELS[user.role]}
                        </div>
                    </div>
                </div>
            </div>

            {showNotifications && (
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
            )}
        </header>
    );
}
