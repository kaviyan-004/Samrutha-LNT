import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../context/AuthContext';

const ROLES: { role: Role; label: string; color: string }[] = [
    { role: 'employee', label: 'Employee', color: '#00C896' },
    { role: 'manager', label: 'Manager', color: '#F59E0B' },
    { role: 'projectlead', label: 'Project Lead', color: '#1E4DB7' },
    { role: 'unithead', label: 'Unit Head', color: '#7C3AED' },
    { role: 'marketing', label: 'Marketing', color: '#EC4899' },
];

export default function DemoModeButton() {
    const { switchRole, user } = useAuth();
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);

    if (!user) return null;

    const handleCycle = () => {
        const nextIndex = (currentIndex + 1) % ROLES.length;
        setCurrentIndex(nextIndex);
        const { role } = ROLES[nextIndex];
        switchRole(role);
        navigate('/dashboard');
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
            {isExpanded && (
                <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-3 w-52 fade-in-up">
                    <p className="text-xs font-heading font-semibold text-slate-500 mb-2 uppercase tracking-wider">Switch Role</p>
                    {ROLES.map(({ role, label, color }) => (
                        <button
                            key={role}
                            onClick={() => { switchRole(role); navigate('/dashboard'); setIsExpanded(false); }}
                            className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                            <span className="text-sm text-slate-700 font-medium">{label}</span>
                            {user.role === role && (
                                <span className="ml-auto text-xs text-slate-400">Active</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setIsExpanded(v => !v)}
                    className="demo-btn"
                    title="Switch Role"
                >
                    <RotateCcw size={14} />
                    Demo Mode
                </button>
                <button
                    onClick={handleCycle}
                    className="demo-btn"
                    style={{ padding: '12px', borderRadius: '50%', minWidth: '44px', justifyContent: 'center' }}
                    title="Cycle to next role"
                >
                    <Play size={14} />
                </button>
            </div>
        </div>
    );
}
