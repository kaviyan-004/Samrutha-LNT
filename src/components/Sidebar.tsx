import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, CheckSquare, FolderOpen, Users, BarChart2,
    Settings, LogOut, ChevronLeft, ChevronRight, Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../context/AuthContext';

interface NavItem {
    icon: React.ElementType;
    label: string;
    path: string;
    roles: Role[];
}

const NAV_ITEMS: NavItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['employee', 'manager', 'projectlead', 'unithead', 'marketing'] },
    { icon: CheckSquare, label: 'Daily Check-In', path: '/checkin', roles: ['employee'] },
    { icon: FolderOpen, label: 'My Projects', path: '/projects', roles: ['employee', 'projectlead'] },
    { icon: Users, label: 'Team View', path: '/team', roles: ['manager', 'projectlead', 'unithead'] },
    { icon: BarChart2, label: 'Reports', path: '/reports', roles: ['employee', 'manager', 'projectlead', 'unithead', 'marketing'] },
    { icon: Settings, label: 'Settings', path: '/settings', roles: ['employee', 'manager', 'projectlead', 'unithead', 'marketing'] },
];

const ROLE_LABELS: Record<Role, string> = {
    employee: 'Employee',
    manager: 'Manager',
    projectlead: 'Project Lead',
    unithead: 'Unit Head',
    marketing: 'Marketing',
};

const ROLE_COLORS: Record<Role, string> = {
    employee: '#00C896',
    manager: '#F59E0B',
    projectlead: '#1E4DB7',
    unithead: '#7C3AED',
    marketing: '#EC4899',
};

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const filteredNav = NAV_ITEMS.filter(item => user && item.roles.includes(user.role));

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div
            className="sidebar flex flex-col h-screen sticky top-0"
            style={{
                width: collapsed ? '70px' : '240px',
                transition: 'width 0.3s ease',
                background: 'linear-gradient(180deg, #003366 0%, #001f40 100%)',
                flexShrink: 0,
            }}
        >
            {/* Logo */}
            <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
                {!collapsed && (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#00C896' }}>
                            <Activity size={16} color="white" />
                        </div>
                        <div>
                            <div className="text-white font-heading font-bold text-sm leading-none">EffortIQ</div>
                            <div className="text-white/40 text-xs leading-none mt-0.5">Work Intelligence</div>
                        </div>
                    </div>
                )}
                {collapsed && (
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto" style={{ background: '#00C896' }}>
                        <Activity size={16} color="white" />
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(c => !c)}
                    className="text-white/50 hover:text-white transition-colors ml-auto"
                    title={collapsed ? 'Expand' : 'Collapse'}
                >
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
                {filteredNav.map(({ icon: Icon, label, path }) => (
                    <NavLink
                        key={path}
                        to={path}
                        title={collapsed ? label : undefined}
                        className={({ isActive }) =>
                            `nav-item flex items-center gap-3 px-3 py-2.5 text-sm transition-all ${isActive ? 'active text-white' : 'text-white/65 hover:text-white'}`
                        }
                    >
                        <Icon size={18} className="flex-shrink-0" />
                        {!collapsed && <span className="font-body font-medium">{label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* User section */}
            {user && (
                <div className="border-t border-white/10 p-3">
                    <div className={`flex items-center gap-3 mb-3 ${collapsed ? 'justify-center' : ''}`}>
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ background: ROLE_COLORS[user.role] }}
                        >
                            {user.avatar}
                        </div>
                        {!collapsed && (
                            <div className="min-w-0">
                                <div className="text-white text-sm font-semibold truncate">{user.name}</div>
                                <div className="text-xs font-medium truncate" style={{ color: ROLE_COLORS[user.role] }}>
                                    {ROLE_LABELS[user.role]}
                                </div>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        title="Logout"
                        className={`flex items-center gap-2 w-full text-white/50 hover:text-white transition-colors text-xs px-2 py-2 rounded-lg hover:bg-white/10 ${collapsed ? 'justify-center' : ''}`}
                    >
                        <LogOut size={15} />
                        {!collapsed && 'Logout'}
                    </button>
                </div>
            )}
        </div>
    );
}
