import React, { useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend, Cell, ReferenceLine, Area, AreaChart
} from 'recharts';
import { projects, tasks, burnRateData, calcProjectHealthScore } from '../../data/mockData';
import StatusBadge from '../../components/StatusBadge';
import AnimatedCounter from '../../components/AnimatedCounter';

function ProjectHealthGauge({ score }: { score: number }) {
    const color = score >= 80 ? '#1DB954' : score >= 50 ? '#F59E0B' : '#DC2626';
    const status = score >= 80 ? 'on-track' : score >= 50 ? 'at-risk' : 'delayed';
    const circumference = 2 * Math.PI * 54;
    const dashOffset = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative">
                <svg width={128} height={128}>
                    <circle cx={64} cy={64} r={54} fill="none" stroke="#F1F5F9" strokeWidth={10} />
                    <circle
                        cx={64} cy={64} r={54} fill="none" stroke={color} strokeWidth={10}
                        strokeDasharray={circumference} strokeDashoffset={dashOffset}
                        strokeLinecap="round" transform="rotate(-90 64 64)"
                        style={{ transition: 'stroke-dashoffset 1s ease' }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold font-mono-data" style={{ color }}>{score}</span>
                    <span className="text-xs text-slate-400">/100</span>
                </div>
            </div>
            <StatusBadge status={status} />
        </div>
    );
}

const GANTT_TASKS = [
    { name: 'FEA Model Setup', start: 0, planned: 6, actual: 8, status: 'completed' },
    { name: 'Load Case Analysis', start: 5, planned: 8, actual: 7, status: 'completed' },
    { name: 'Design Optimization', start: 10, planned: 12, actual: 14, status: 'in-progress' },
    { name: 'Report & Docs', start: 18, planned: 6, actual: 3, status: 'in-progress' },
    { name: 'Client Review', start: 22, planned: 4, actual: 0, status: 'not-started' },
];

const TASK_SPEED = tasks.filter(t => t.projectId === 'proj-1').map(t => ({
    name: t.name.length > 18 ? t.name.slice(0, 18) + '...' : t.name,
    planned: t.plannedHours,
    actual: t.actualHours || 0,
    status: t.status,
}));

export default function ProjectLeadDashboard() {
    const [selectedProject, setSelectedProject] = useState('proj-1');
    const project = projects.find(p => p.id === selectedProject)!;
    const projTasks = tasks.filter(t => t.projectId === selectedProject);
    const healthScore = calcProjectHealthScore(project, projTasks);

    const laggingStats = {
        late: projTasks.filter(t => t.status === 'completed' && t.actualEndDate && t.actualEndDate > t.plannedEndDate).length,
        blocked: projTasks.filter(t => t.hasBlocker).length,
        avgVariance: Math.round(projTasks.reduce((s, t) => s + Math.abs(t.actualHours - t.plannedHours) / Math.max(t.plannedHours, 1) * 100, 0) / projTasks.length),
    };

    return (
        <div className="space-y-6 fade-in-up">
            {/* Project selector */}
            <div className="flex items-center gap-4">
                <div>
                    <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wide">Active Project</label>
                    <select
                        value={selectedProject}
                        onChange={e => setSelectedProject(e.target.value)}
                        className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white font-semibold"
                    >
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Health Score + KPIs */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="glass-card p-5 flex flex-col items-center justify-center">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-3">Project Health Score</p>
                    <ProjectHealthGauge score={healthScore} />
                </div>
                <div className="glass-card p-5">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Completion</p>
                    <AnimatedCounter target={project.completionPct} suffix="%" className="text-3xl font-bold text-slate-800" />
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${project.completionPct}%`, background: '#1E4DB7' }} />
                    </div>
                </div>
                <div className="glass-card p-5">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Planned Hours</p>
                    <AnimatedCounter target={project.plannedHours} suffix="h" className="text-3xl font-bold text-slate-800" />
                    <p className="text-xs text-slate-400 mt-1">Budgeted effort</p>
                </div>
                <div className="glass-card p-5">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Actual Hours</p>
                    <AnimatedCounter target={project.actualHours} suffix="h" className="text-3xl font-bold text-slate-800" />
                    <p className="text-xs text-slate-400 mt-1">
                        {project.actualHours > project.plannedHours
                            ? <span style={{ color: '#DC2626' }}>+{project.actualHours - project.plannedHours}h over</span>
                            : <span style={{ color: '#1DB954' }}>{project.plannedHours - project.actualHours}h under</span>
                        }
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Burn Rate Chart */}
                <div className="glass-card p-5">
                    <h3 className="font-heading font-semibold text-slate-700 text-sm mb-4">Effort Burn Rate</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={burnRateData}>
                            <defs>
                                <linearGradient id="plannedGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#1E4DB7" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#1E4DB7" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                            <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: 8, border: 'none', fontSize: 12 }} />
                            <Area type="monotone" dataKey="planned" name="Planned" stroke="#1E4DB7" fill="url(#plannedGrad)" strokeWidth={2} dot={false} />
                            <Area type="monotone" dataKey="actual" name="Actual" stroke="#EF4444" fill="url(#actualGrad)" strokeWidth={2} dot={false} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Task Speed Chart */}
                <div className="glass-card p-5">
                    <h3 className="font-heading font-semibold text-slate-700 text-sm mb-4">Task Completion Speed</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={TASK_SPEED} layout="vertical" barSize={10} barGap={2}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                            <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                            <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#64748B' }} width={130} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: 8, border: 'none', fontSize: 12 }} />
                            <Bar dataKey="planned" name="Planned" fill="#E2E8F0" radius={[0, 4, 4, 0]} />
                            <Bar dataKey="actual" name="Actual" fill="#1E4DB7" radius={[0, 4, 4, 0]} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Lagging Indicators + Gantt-style */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass-card p-5">
                    <h3 className="font-heading font-semibold text-slate-700 text-sm mb-4">Lagging Indicators</h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Tasks Completed Late', value: `${laggingStats.late}`, unit: 'tasks', color: '#DC2626' },
                            { label: 'Active Blockers', value: `${laggingStats.blocked}`, unit: 'blockers', color: '#F59E0B' },
                            { label: 'Avg Effort Variance', value: `${laggingStats.avgVariance}`, unit: '%', color: '#1E4DB7' },
                        ].map((item, i) => (
                            <div key={i} className="p-3 rounded-xl" style={{ background: '#F8FAFC' }}>
                                <div className="text-xs text-slate-500 mb-1">{item.label}</div>
                                <div className="font-bold font-mono-data text-xl" style={{ color: item.color }}>
                                    {item.value} <span className="text-sm font-normal text-slate-400">{item.unit}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Simple Gantt */}
                <div className="glass-card p-5 lg:col-span-2">
                    <h3 className="font-heading font-semibold text-slate-700 text-sm mb-4">Project Timeline (Weeks)</h3>
                    <div className="space-y-3">
                        {GANTT_TASKS.map((t, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="text-xs text-slate-500 w-36 truncate flex-shrink-0">{t.name}</div>
                                <div className="flex-1 relative bg-slate-100 rounded-full h-5 overflow-hidden">
                                    {/* Planned bar */}
                                    <div
                                        className="absolute h-full rounded-full opacity-30"
                                        style={{ left: `${(t.start / 28) * 100}%`, width: `${(t.planned / 28) * 100}%`, background: '#1E4DB7' }}
                                    />
                                    {/* Actual bar */}
                                    {t.actual > 0 && (
                                        <div
                                            className="absolute h-3/4 top-1/2 -translate-y-1/2 rounded-full"
                                            style={{
                                                left: `${(t.start / 28) * 100}%`,
                                                width: `${(t.actual / 28) * 100}%`,
                                                background: t.actual > t.planned ? '#EF4444' : '#1DB954'
                                            }}
                                        />
                                    )}
                                </div>
                                <StatusBadge status={t.status as any} size="sm" />
                            </div>
                        ))}
                        <div className="flex text-xs text-slate-400 mt-2 justify-between">
                            {['W1', 'W5', 'W10', 'W15', 'W20', 'W25', 'W28'].map(w => <span key={w}>{w}</span>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
