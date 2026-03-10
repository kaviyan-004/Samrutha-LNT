import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../context/AuthContext';

const DEMO_ROLES: { role: Role; label: string; description: string; color: string }[] = [
    { role: 'employee', label: 'Employee', description: 'Daily check-in & personal metrics', color: '#00C896' },
    { role: 'manager', label: 'Manager', description: 'Team oversight & risk alerts', color: '#F59E0B' },
    { role: 'projectlead', label: 'Project Lead', description: 'Project health & burn rate', color: '#1E4DB7' },
    { role: 'unithead', label: 'Unit Head', description: 'Strategic KPIs & utilization', color: '#7C3AED' },
    { role: 'marketing', label: 'Marketing', description: 'Capacity planning & commitment', color: '#EC4899' },
];

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState<Role>('employee');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (role: Role = selectedRole) => {
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 600));
        login(email || 'demo@lnt.com', password || 'demo', role);
        setIsLoading(false);
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#F4F6F9' }}>
            <div className="w-full max-w-[480px] px-6 text-center">
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 text-left">
                    {/* Header */}
                    <div className="flex flex-col items-center text-center space-y-2">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#00C896' }}>
                            <Activity size={24} color="white" />
                        </div>
                        <h2 className="font-heading font-bold text-slate-800 text-2xl">Welcome back</h2>
                        <p className="text-slate-500 text-sm">Sign in to your workspace</p>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="your.name@company.com"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Password</label>
                            <div className="relative w-full">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-500 transition-colors pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Your Role</label>
                            <select
                                value={selectedRole}
                                onChange={e => setSelectedRole(e.target.value as Role)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-500 bg-white transition-colors"
                            >
                                {DEMO_ROLES.map(r => (
                                    <option key={r.role} value={r.role}>{r.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Main Login Button */}
                    <button
                        onClick={() => handleLogin()}
                        disabled={isLoading}
                        className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all shadow-sm"
                        style={{ background: 'linear-gradient(135deg, #003366, #1E4DB7)' }}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In to EffortIQ'}
                    </button>

                    {/* Quick Demo Login */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 border-t border-slate-100" />
                            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Quick Demo Login</span>
                            <div className="flex-1 border-t border-slate-100" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {DEMO_ROLES.map(({ role, label, color }) => (
                                <button
                                    key={role}
                                    onClick={() => handleLogin(role)}
                                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors w-full"
                                >
                                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <p className="text-center text-xs text-slate-400 mt-6">
                    L&T EffortIQ • Enterprise Edition • v2.0
                </p>
            </div>
        </div>
    );
}
