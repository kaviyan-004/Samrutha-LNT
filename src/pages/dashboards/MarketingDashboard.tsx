import React, { useState } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { projects, bandwidthTimeline } from '../../data/mockData';
import StatusBadge from '../../components/StatusBadge';
import AnimatedCounter from '../../components/AnimatedCounter';

const TOTAL_CAPACITY = 350;
const CURRENT_UTILIZED = 310;
const FREE_CAPACITY = TOTAL_CAPACITY - CURRENT_UTILIZED;
const CAPACITY_PCT = Math.round((FREE_CAPACITY / TOTAL_CAPACITY) * 100);

function CapacityMeter({ pct }: { pct: number }) {
    const color = pct >= 30 ? '#1DB954' : pct >= 15 ? '#F59E0B' : '#DC2626';
    const zone = pct >= 30 ? 'GREEN ZONE' : pct >= 15 ? 'YELLOW ZONE' : 'RED ZONE';
    const zoneColor = pct >= 30 ? { bg: '#dcfce7', text: '#166534' } : pct >= 15 ? { bg: '#fef9c3', text: '#854d0e' } : { bg: '#fee2e2', text: '#991b1b' };

    return (
        <div className="text-center">
            <div className="relative mx-auto" style={{ width: 180, height: 90 }}>
                <svg width={180} height={100} viewBox="0 0 180 100">
                    {/* Background arc */}
                    <path d="M 15 90 A 75 75 0 0 1 165 90" fill="none" stroke="#F1F5F9" strokeWidth={14} strokeLinecap="round" />
                    {/* Colored arc */}
                    <path
                        d="M 15 90 A 75 75 0 0 1 165 90"
                        fill="none"
                        stroke={color}
                        strokeWidth={14}
                        strokeLinecap="round"
                        strokeDasharray={`${(pct / 100) * 235} 235`}
                        style={{ transition: 'stroke-dasharray 1.2s ease' }}
                    />
                    {/* Needle */}
                    <g transform={`rotate(${(pct / 100) * 180 - 90}, 90, 90)`}>
                        <line x1="90" y1="90" x2="90" y2="28" stroke="#1A1A2E" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="90" cy="90" r="5" fill="#1A1A2E" />
                    </g>
                </svg>
            </div>
            <div className="text-3xl font-bold font-mono-data mb-1" style={{ color }}>{pct}%</div>
            <div className="text-xs font-bold px-3 py-1 rounded-full" style={zoneColor}>{zone}</div>
            <div className="text-xs text-slate-400 mt-2">{FREE_CAPACITY} hrs available of {TOTAL_CAPACITY} total</div>
        </div>
    );
}

export default function MarketingDashboard() {
    const [engineers, setEngineers] = useState('');
    const [weeks, setWeeks] = useState('');
    const [checkerResult, setCheckerResult] = useState<null | { label: string; reason: string; color: string; bg: string }>(null);

    const checkFeasibility = () => {
        const engCount = parseInt(engineers) || 0;
        const weekCount = parseInt(weeks) || 0;
        const requiredHours = engCount * weekCount * 40;
        const freeHours = FREE_CAPACITY * weekCount;

        if (requiredHours <= freeHours * 0.6) {
            setCheckerResult({ label: 'FEASIBLE', reason: `${requiredHours}h needed vs ${Math.round(freeHours * 0.6)}h confirmed available. Team has sufficient bandwidth.`, color: '#166534', bg: '#dcfce7' });
        } else if (requiredHours <= freeHours) {
            setCheckerResult({ label: 'RISKY', reason: `${requiredHours}h needed but only ${freeHours}h available. Risk of overload if any project faces delays.`, color: '#854d0e', bg: '#fef9c3' });
        } else {
            setCheckerResult({ label: 'NOT RECOMMENDED', reason: `${requiredHours}h required exceeds available bandwidth (${freeHours}h). Current utilization too high.`, color: '#991b1b', bg: '#fee2e2' });
        }
    };

    return (
        <div className="space-y-6 fade-in-up">
            {/* KPI row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Capacity (hrs)', value: TOTAL_CAPACITY, color: '#1E4DB7' },
                    { label: 'Utilized (hrs)', value: CURRENT_UTILIZED, color: '#F59E0B' },
                    { label: 'Free Bandwidth (hrs)', value: FREE_CAPACITY, color: '#1DB954' },
                    { label: 'Projects Active', value: projects.length, color: '#7C3AED' },
                ].map((k, i) => (
                    <div key={i} className="glass-card p-4 card-hover">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">{k.label}</p>
                        <AnimatedCounter target={k.value} className="text-2xl font-bold" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Delivery Capacity Meter */}
                <div className="glass-card p-6">
                    <h3 className="font-heading font-semibold text-slate-700 text-sm mb-6">Delivery Capacity Meter</h3>
                    <CapacityMeter pct={CAPACITY_PCT} />
                </div>

                {/* Project Commitment Checker */}
                <div className="glass-card p-6">
                    <h3 className="font-heading font-semibold text-slate-700 text-sm mb-4">Project Commitment Checker</h3>
                    <p className="text-xs text-slate-400 mb-4">Can we commit to a new project?</p>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Engineers Needed</label>
                                <input
                                    type="number" min={1} max={50}
                                    value={engineers}
                                    onChange={e => { setEngineers(e.target.value); setCheckerResult(null); }}
                                    placeholder="e.g. 5"
                                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none"
                                    onFocus={e => e.target.style.boxShadow = '0 0 0 3px rgba(30,77,183,0.15)'}
                                    onBlur={e => e.target.style.boxShadow = ''}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Duration (weeks)</label>
                                <input
                                    type="number" min={1} max={52}
                                    value={weeks}
                                    onChange={e => { setWeeks(e.target.value); setCheckerResult(null); }}
                                    placeholder="e.g. 12"
                                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none"
                                    onFocus={e => e.target.style.boxShadow = '0 0 0 3px rgba(30,77,183,0.15)'}
                                    onBlur={e => e.target.style.boxShadow = ''}
                                />
                            </div>
                        </div>
                        <button
                            onClick={checkFeasibility}
                            disabled={!engineers || !weeks}
                            className="w-full py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-40 transition-all"
                            style={{ background: 'linear-gradient(135deg, #003366, #1E4DB7)' }}
                        >
                            Check Feasibility
                        </button>
                        {checkerResult && (
                            <div className="p-4 rounded-xl fade-in-up" style={{ background: checkerResult.bg }}>
                                <div className="font-bold text-base mb-1" style={{ color: checkerResult.color }}>{checkerResult.label}</div>
                                <p className="text-xs leading-relaxed" style={{ color: checkerResult.color }}>{checkerResult.reason}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Active Projects Summary */}
            <div className="glass-card p-5">
                <h3 className="font-heading font-semibold text-slate-700 text-sm mb-4">Active Projects Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {projects.map(p => {
                        const safeToPromise = p.status === 'on-track';
                        return (
                            <div key={p.id} className="p-4 rounded-xl border" style={{ borderColor: p.status === 'on-track' ? '#bbf7d0' : p.status === 'at-risk' ? '#fde68a' : '#fecaca', background: p.status === 'on-track' ? '#f0fdf4' : p.status === 'at-risk' ? '#fffbeb' : '#fff1f2' }}>
                                <div className="font-semibold text-slate-800 text-sm mb-2">{p.name}</div>
                                <div className="flex items-center justify-between mb-2">
                                    <StatusBadge status={p.status} size="sm" />
                                    <span className="text-xs font-mono-data font-bold text-slate-600">{p.completionPct}%</span>
                                </div>
                                <div className="w-full bg-white rounded-full h-1.5 mb-2">
                                    <div className="h-1.5 rounded-full" style={{ width: `${p.completionPct}%`, background: p.status === 'on-track' ? '#1DB954' : p.status === 'at-risk' ? '#F59E0B' : '#DC2626' }} />
                                </div>
                                <div className="text-xs font-medium" style={{ color: safeToPromise ? '#1DB954' : '#DC2626' }}>
                                    {safeToPromise ? '✓ Safe to commit delivery' : '⚠ Delivery uncertain'}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bandwidth Timeline */}
            <div className="glass-card p-5">
                <h3 className="font-heading font-semibold text-slate-700 text-sm mb-4">Team Bandwidth – Next 6 Months</h3>
                <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={bandwidthTimeline}>
                        <defs>
                            <linearGradient id="capGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#1E4DB7" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#1E4DB7" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="utilGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#DC2626" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: 8, border: 'none', fontSize: 12 }} />
                        <Area type="monotone" dataKey="capacity" name="Total Capacity" stroke="#1E4DB7" fill="url(#capGrad)" strokeWidth={2} dot={false} />
                        <Area type="monotone" dataKey="utilized" name="Utilized" stroke="#DC2626" fill="url(#utilGrad)" strokeWidth={2} dot={false} />
                    </AreaChart>
                </ResponsiveContainer>
                <p className="text-xs text-slate-400 mt-2 text-center">
                    Team will have significant free capacity from May onwards — ideal window for new project intake.
                </p>
            </div>
        </div>
    );
}
