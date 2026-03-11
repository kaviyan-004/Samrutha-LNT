import { useState } from 'react';
import { Bell, Moon, Sun, User, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
    const { user } = useAuth();
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState({ email: true, alerts: true, weekly: false });
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="max-w-2xl space-y-6 fade-in-up">
            {/* Profile section */}
            <div className="glass-card p-6">
                <h3 className="font-heading font-semibold text-slate-800 text-base mb-4 flex items-center gap-2">
                    <User size={16} /> Profile Information
                </h3>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold" style={{ background: '#003366' }}>
                        {user?.avatar}
                    </div>
                    <div>
                        <div className="font-bold text-slate-800 text-lg">{user?.name}</div>
                        <div className="text-slate-400 text-sm">{user?.email}</div>
                        <div className="text-xs font-medium mt-1" style={{ color: '#1E4DB7' }}>{user?.department}</div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: 'Full Name', value: user?.name || '' },
                        { label: 'Email', value: user?.email || '' },
                        { label: 'Department', value: user?.department || '' },
                        { label: 'Employee ID', value: 'LNT-2024-0' + (user?.avatar || '00') },
                    ].map(f => (
                        <div key={f.label}>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{f.label}</label>
                            <input
                                type="text"
                                defaultValue={f.value}
                                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Notifications */}
            <div className="glass-card p-6">
                <h3 className="font-heading font-semibold text-slate-800 text-base mb-4 flex items-center gap-2">
                    <Bell size={16} /> Notification Preferences
                </h3>
                <div className="space-y-4">
                    {[
                        { key: 'email', label: 'Email Notifications', desc: 'Receive daily digests and alerts via email' },
                        { key: 'alerts', label: 'Risk Alerts', desc: 'Immediate notifications for overload or delays' },
                        { key: 'weekly', label: 'Weekly Report', desc: 'Summary report every Friday' },
                    ].map(item => (
                        <div key={item.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50">
                            <div>
                                <div className="text-sm font-semibold text-slate-700">{item.label}</div>
                                <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                            </div>
                            <button
                                onClick={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
                                className="relative w-11 h-6 rounded-full transition-all flex-shrink-0"
                                style={{ background: notifications[item.key as keyof typeof notifications] ? '#1DB954' : '#E2E8F0' }}
                            >
                                <div
                                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all"
                                    style={{ left: notifications[item.key as keyof typeof notifications] ? '24px' : '4px' }}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Appearance */}
            <div className="glass-card p-6">
                <h3 className="font-heading font-semibold text-slate-800 text-base mb-4 flex items-center gap-2">
                    {darkMode ? <Moon size={16} /> : <Sun size={16} />} Appearance
                </h3>
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50">
                    <div>
                        <div className="text-sm font-semibold text-slate-700">Dark Mode</div>
                        <div className="text-xs text-slate-400 mt-0.5">Switch to dark theme (coming soon)</div>
                    </div>
                    <button
                        onClick={() => setDarkMode(v => !v)}
                        className="relative w-11 h-6 rounded-full transition-all"
                        style={{ background: darkMode ? '#1E4DB7' : '#E2E8F0' }}
                    >
                        <div
                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all"
                            style={{ left: darkMode ? '24px' : '4px' }}
                        />
                    </button>
                </div>
            </div>

            {/* Security */}
            <div className="glass-card p-6">
                <h3 className="font-heading font-semibold text-slate-800 text-base mb-4 flex items-center gap-2">
                    <Shield size={16} /> Security
                </h3>
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Current Password</label>
                        <input type="password" placeholder="••••••••" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <button className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50">Reset</button>
                <button
                    onClick={handleSave}
                    className="px-6 py-2 rounded-xl text-white text-sm font-semibold transition-all"
                    style={{ background: saved ? '#1DB954' : '#003366' }}
                >
                    {saved ? '✓ Saved!' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
}
