/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Cell
} from 'recharts';
import { engineers, projects, capacityForecast } from '../../data/mockData';
import AnimatedCounter from '../../components/AnimatedCounter';
import StatusBadge from '../../components/StatusBadge';

const REVENUE_TABLE = [
    { project: 'Bridge Design Automation', planned: 2400, actual: 2150, revenue: '₹42L', efficiency: 96 },
    { project: 'Smart Grid Layout Tool', planned: 1800, actual: 1950, revenue: '₹31L', efficiency: 79 },
    { project: 'Tunnel Structural Analysis', planned: 3200, actual: 2800, revenue: '₹58L', efficiency: 82 },
];

const HIRING_THRESHOLD = 85;
const AVG_UTILIZATION = Math.round(engineers.reduce((s, e) => s + e.utilization, 0) / engineers.length);
const OVERLOADED_SKILLS = ['FEA', 'Grid Design', 'Structural FEA'];

const HEATMAP_ENGINEERS = engineers.map(e => ({
    ...e,
    color: e.utilization >= 100 ? '#DC2626' : e.utilization >= 85 ? '#F59E0B' : e.utilization >= 70 ? '#1DB954' : '#94A3B8',
    label: e.utilization >= 100 ? 'Overloaded' : e.utilization >= 85 ? 'High' : e.utilization >= 70 ? 'Normal' : 'Low',
}));

export default function UnitHeadDashboard() {
    const [selectedEngineer, setSelectedEngineer] = useState<string | null>(null);
    const selected = HEATMAP_ENGINEERS.find(e => e.id === selectedEngineer);
    const showHiring = AVG_UTILIZATION > HIRING_THRESHOLD;

    const capacityIndex = (AVG_UTILIZATION / 100).toFixed(2);
    const canTakeProject = AVG_UTILIZATION < 75 ? 'YES' : AVG_UTILIZATION < 88 ? 'MARGINAL' : 'NO';

    return (
        <div className="space-y-6 fade-in-up">
            {/* Hiring Alert */}
            {showHiring && (
                <div className="flex items-center gap-3 px-5 py-4 rounded-xl border" style={{ background: '#fff1f2', borderColor: '#fecaca' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#fee2e2' }}>
                        <AlertTriangle size={16} color="#DC2626" />
                    </div>
                    <div className="flex-1">
                        <div className="text-sm font-bold text-red-800">Hiring Recommended</div>
                        <div className="text-xs text-red-600 mt-0.5">
                            Average utilization at {AVG_UTILIZATION}% for 3+ weeks. Overloaded skills: {OVERLOADED_SKILLS.join(', ')}
                        </div>
                    </div>
                    <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-1 rounded-lg">Critical</span>
                </div>
            )}

            {/* Strategic KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                    { label: 'Total Engineers', value: 124, suffix: '', color: '#1E4DB7' },
                    { label: 'Avg Utilization', value: AVG_UTILIZATION, suffix: '%', color: AVG_UTILIZATION > 85 ? '#DC2626' : '#1DB954' },
                    { label: 'Capacity Saturation', value: capacityIndex, suffix: '', color: '#F59E0B', isString: true },
                    { label: 'Projects At Risk', value: projects.filter(p => p.status !== 'on-track').length, suffix: '', color: '#EF4444' },
                    { label: 'Revenue/Engineer', value: 4.2, suffix: 'L/eng', prefix: '₹', decimals: 1, color: '#1DB954' },
                ].map((k, i) => (
                    <div key={i} className="glass-card p-4 card-hover fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">{k.label}</p>
                        {k.isString ? (
                            <div className="text-2xl font-bold font-mono-data" style={{ color: k.color }}>{k.value}</div>
                        ) : (
                            <AnimatedCounter target={Number(k.value)} suffix={k.suffix} prefix={k.prefix} decimals={k.decimals} className="text-2xl font-bold" />
                        )}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Utilization Heatmap */}
                <div className="glass-card p-5">
                    <h3 className="font-heading font-semibold text-slate-700 text-sm mb-4">Engineer Utilization Heatmap</h3>
                    <div className="grid grid-cols-5 gap-2 mb-4">
                        {HEATMAP_ENGINEERS.map(eng => (
                            <div
                                key={eng.id}
                                onClick={() => setSelectedEngineer(selectedEngineer === eng.id ? null : eng.id)}
                                className="heat-cell p-2 text-center"
                                style={{ background: eng.color + '22', border: `2px solid ${eng.color}33`, cursor: 'pointer' }}
                                title={`${eng.name}: ${eng.utilization}%`}
                            >
                                <div className="text-xs font-bold" style={{ color: eng.color }}>{eng.avatar}</div>
                                <div className="text-xs font-mono-data font-bold mt-0.5" style={{ color: eng.color }}>{eng.utilization}%</div>
                            </div>
                        ))}
                    </div>
                    {/* Legend */}
                    <div className="flex gap-3 text-xs text-slate-500">
                        {[{ color: '#1DB954', label: '≤80% Normal' }, { color: '#F59E0B', label: '81-99% High' }, { color: '#DC2626', label: '≥100% Overloaded' }].map(l => (
                            <div key={l.label} className="flex items-center gap-1">
                                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
                                {l.label}
                            </div>
                        ))}
                    </div>
                    {/* Detail panel */}
                    {selected && (
                        <div className="mt-4 p-3 rounded-xl fade-in-up" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                            <div className="font-semibold text-slate-700 text-sm">{selected.name}</div>
                            <div className="text-xs text-slate-500 mt-1">{selected.department}</div>
                            <div className="flex gap-4 mt-2 text-xs">
                                <span>Utilization: <strong style={{ color: selected.color }}>{selected.utilization}%</strong></span>
                                <span>Reliability: <strong>{selected.reliabilityScore}%</strong></span>
                            </div>
                            <div className="text-xs text-slate-500 mt-1">Skills: {selected.skillSet.join(' • ')}</div>
                        </div>
                    )}
                </div>

                {/* Capacity Forecast */}
                <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-heading font-semibold text-slate-700 text-sm">Capacity Forecast (Next 4 Weeks)</h3>
                        <span
                            className="text-xs font-bold px-2.5 py-1 rounded-full"
                            style={{
                                background: canTakeProject === 'YES' ? '#dcfce7' : canTakeProject === 'MARGINAL' ? '#fef9c3' : '#fee2e2',
                                color: canTakeProject === 'YES' ? '#166534' : canTakeProject === 'MARGINAL' ? '#854d0e' : '#991b1b',
                            }}
                        >
                            {canTakeProject === 'YES' ? 'Can Accept New Project' : canTakeProject === 'MARGINAL' ? 'Marginal Capacity' : 'No New Projects'}
                        </span>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={capacityForecast}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                            <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: 8, border: 'none', fontSize: 12 }} />
                            <Bar dataKey="committed" name="Committed" fill="#1E4DB7" radius={[4, 4, 0, 0]} stackId="a" />
                            <Bar dataKey="free" name="Available" fill="#1DB954" radius={[4, 4, 0, 0]} stackId="a" />
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="flex gap-4 text-xs text-slate-500 mt-2">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm" style={{ background: '#1E4DB7' }} />Committed</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm" style={{ background: '#1DB954' }} />Free Bandwidth</div>
                    </div>
                </div>
            </div>

            {/* Revenue-to-Effort Table */}
            <div className="glass-card overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                    <h3 className="font-heading font-semibold text-slate-700 text-sm">Revenue-to-Effort Mapping</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Project</th>
                                <th>Planned Hours</th>
                                <th>Actual Hours</th>
                                <th>Est. Revenue</th>
                                <th>Effort Efficiency</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {REVENUE_TABLE.map((row, i) => (
                                <tr key={i}>
                                    <td className="font-medium text-slate-800">{row.project}</td>
                                    <td className="font-mono-data text-slate-600">{row.planned}h</td>
                                    <td className="font-mono-data text-slate-600">{row.actual}h</td>
                                    <td className="font-mono-data font-bold text-slate-800">{row.revenue}</td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-slate-100 rounded-full h-1.5 w-20">
                                                <div className="h-1.5 rounded-full" style={{ width: `${row.efficiency}%`, background: row.efficiency >= 90 ? '#1DB954' : row.efficiency >= 70 ? '#F59E0B' : '#DC2626' }} />
                                            </div>
                                            <span className="font-mono-data font-bold text-sm">{row.efficiency}%</span>
                                        </div>
                                    </td>
                                    <td><StatusBadge status={projects[i].status} size="sm" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
