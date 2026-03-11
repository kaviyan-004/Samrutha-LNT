/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { engineers, tasks, projects, calcEffortAccuracy } from '../../data/mockData';
import StatusBadge from '../../components/StatusBadge';
import AnimatedCounter from '../../components/AnimatedCounter';

const RISK_ALERTS = [
    { id: 1, type: 'danger', text: 'Ravi Kumar has exceeded planned hours 4 times this week', time: '5 min ago' },
    { id: 2, type: 'warning', text: 'Task "Stress Analysis Simulation" is 8 days behind schedule', time: '1 hr ago' },
    { id: 3, type: 'warning', text: 'Smart Grid Layout Tool — effort variance exceeded 20%', time: '3 hrs ago' },
    { id: 4, type: 'danger', text: 'Employee Rohit Sinha approaching overload threshold (96%)', time: '5 hrs ago' },
    { id: 5, type: 'info', text: 'Bridge Design Automation on track — 85% health score', time: 'Yesterday' },
];

const TOP_DELAYED = [
    { name: 'Stress Analysis', days: 8, projectId: 'proj-3' },
    { name: 'Grid Algorithm', days: 5, projectId: 'proj-2' },
    { name: 'Integration Testing', days: 4, projectId: 'proj-2' },
    { name: 'Design Optimization', days: 2, projectId: 'proj-1' },
    { name: 'Structural Model', days: 2, projectId: 'proj-3' },
];

function getVarianceColor(planned: number, actual: number) {
    const pct = Math.abs(actual - planned) / planned * 100;
    if (pct <= 10) return { color: '#166534', bg: '#dcfce7' };
    if (pct <= 25) return { color: '#854d0e', bg: '#fef9c3' };
    return { color: '#991b1b', bg: '#fee2e2' };
}

export default function ManagerDashboard() {
    const [filter, setFilter] = useState('');

    const filteredEngineers = engineers.filter(e =>
        filter ? e.projectIds.some(pid => pid === filter) : true
    );

    const leaderboard = [...engineers].sort((a, b) => b.reliabilityScore - a.reliabilityScore);

    return (
        <div className="space-y-6 fade-in-up">
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Team Members', value: engineers.length, color: '#1E4DB7' },
                    { label: 'Overloaded', value: engineers.filter(e => e.isOverloaded).length, color: '#EF4444' },
                    { label: 'Avg Reliability', value: Math.round(engineers.reduce((s, e) => s + e.reliabilityScore, 0) / engineers.length), suffix: '%', color: '#00C896' },
                    { label: 'Open Alerts', value: RISK_ALERTS.filter(a => a.type !== 'info').length, color: '#F59E0B' },
                ].map((k, i) => (
                    <div key={i} className="glass-card p-4 card-hover">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">{k.label}</p>
                        <AnimatedCounter target={k.value} suffix={k.suffix} className="text-2xl font-bold" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Delayed Tasks chart */}
                <div className="glass-card p-5">
                    <h3 className="font-heading font-semibold text-slate-700 text-sm mb-4">Top 5 Delayed Tasks This Month</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={TOP_DELAYED} layout="vertical" barSize={16}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                            <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                            <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#64748B' }} width={110} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: 8, border: 'none', fontSize: 12 }} formatter={(v) => [`${v} days`, 'Delay']} />
                            <Bar dataKey="days" radius={[0, 4, 4, 0]}>
                                {TOP_DELAYED.map((_, i) => (
                                    <Cell key={i} fill={i === 0 ? '#DC2626' : i <= 2 ? '#F59E0B' : '#1E4DB7'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Risk Alerts Feed */}
                <div className="glass-card p-5 lg:col-span-2">
                    <h3 className="font-heading font-semibold text-slate-700 text-sm mb-4">Risk Alerts Feed</h3>
                    <div className="space-y-3 overflow-y-auto" style={{ maxHeight: 220 }}>
                        {RISK_ALERTS.map(alert => (
                            <div key={alert.id} className="flex items-start gap-3 p-3 rounded-xl" style={{
                                background: alert.type === 'danger' ? '#fff1f2' : alert.type === 'warning' ? '#fffbeb' : '#f0fdf4'
                            }}>
                                <AlertTriangle size={15} color={alert.type === 'danger' ? '#DC2626' : alert.type === 'warning' ? '#F59E0B' : '#1DB954'} className="mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-700 leading-relaxed">{alert.text}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{alert.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Team Overview Table */}
            <div className="glass-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <h3 className="font-heading font-semibold text-slate-700 text-sm">Team Overview</h3>
                    <select
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 bg-white"
                    >
                        <option value="">All Projects</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Project</th>
                                <th>Planned Hrs</th>
                                <th>Actual Hrs</th>
                                <th>Variance</th>
                                <th>Utilization</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEngineers.map(eng => {
                                const varPct = Math.round(Math.abs(eng.actualHours - eng.plannedHours) / eng.plannedHours * 100);
                                const varStyle = getVarianceColor(eng.plannedHours, eng.actualHours);
                                const projName = projects.find(p => eng.projectIds.includes(p.id))?.name || '';
                                return (
                                    <tr key={eng.id}>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-slate-700 text-white text-xs flex items-center justify-center font-bold">{eng.avatar}</div>
                                                <span className="font-medium text-slate-800">{eng.name}</span>
                                            </div>
                                        </td>
                                        <td className="text-xs text-slate-500 max-w-xs truncate">{projName}</td>
                                        <td className="font-mono-data text-slate-700">{eng.plannedHours}h</td>
                                        <td className="font-mono-data text-slate-700">{eng.actualHours}h</td>
                                        <td>
                                            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold" style={varStyle}>
                                                {varPct}%
                                            </span>
                                        </td>
                                        <td className="font-mono-data text-slate-700">{eng.utilization}%</td>
                                        <td>
                                            <StatusBadge status={eng.isOverloaded ? 'overloaded' : eng.utilization >= 80 ? 'at-risk' : 'on-track'} size="sm" />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Reliability Leaderboard */}
            <div className="glass-card p-5">
                <h3 className="font-heading font-semibold text-slate-700 text-sm mb-4">Estimation Reliability Leaderboard</h3>
                <div className="space-y-3">
                    {leaderboard.map((eng, i) => {
                        const accuracy = calcEffortAccuracy(eng.plannedHours, eng.actualHours);
                        const trend = accuracy > 85 ? 'up' : accuracy > 70 ? 'neutral' : 'down';
                        return (
                            <div key={eng.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500'}`}>
                                    #{i + 1}
                                </div>
                                <div className="w-7 h-7 rounded-full bg-slate-700 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">{eng.avatar}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-slate-700">{eng.name}</div>
                                    <div className="w-full bg-slate-100 rounded-full h-1 mt-1">
                                        <div className="h-1 rounded-full" style={{ width: `${eng.reliabilityScore}%`, background: '#1E4DB7' }} />
                                    </div>
                                </div>
                                <div className="text-xs font-mono-data text-slate-500">{accuracy}% accuracy</div>
                                <div className="font-bold font-mono-data text-slate-800">{eng.reliabilityScore}%</div>
                                {trend === 'up' ? <TrendingUp size={14} color="#1DB954" /> : <TrendingDown size={14} color="#EF4444" />}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
