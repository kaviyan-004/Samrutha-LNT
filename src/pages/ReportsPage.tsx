import { useState } from 'react';
import { Download, Filter, Calendar } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { projects, engineers } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';

const MONTHLY_DATA = [
    { month: 'Oct', planned: 820, actual: 790 },
    { month: 'Nov', planned: 920, actual: 980 },
    { month: 'Dec', planned: 860, actual: 830 },
    { month: 'Jan', planned: 940, actual: 1020 },
    { month: 'Feb', planned: 880, actual: 910 },
    { month: 'Mar', planned: 950, actual: 0 },
];

export default function ReportsPage() {
    const [downloading, setDownloading] = useState(false);

    const handleDownload = () => {
        setDownloading(true);
        setTimeout(() => setDownloading(false), 1500);
    };

    return (
        <div className="space-y-6 fade-in-up">
            {/* Header row */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-heading font-bold text-slate-800 text-lg">Reports & Analytics</h2>
                    <p className="text-slate-400 text-sm">Quarterly performance summary</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50">
                        <Calendar size={14} /> Q1 2026
                    </button>
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all"
                        style={{ background: downloading ? '#1DB954' : '#003366' }}
                    >
                        <Download size={14} />
                        {downloading ? 'Preparing...' : 'Export PDF'}
                    </button>
                </div>
            </div>

            {/* Summary KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Effort Logged', value: '4,530h', trend: '+12% from last quarter' },
                    { label: 'Overall Effort Accuracy', value: '82%', trend: '⬆ +4% improvement' },
                    { label: 'Projects On Track', value: '1 / 3', trend: '2 require attention' },
                    { label: 'Avg Utilization', value: '82%', trend: 'Near optimal range' },
                ].map((k, i) => (
                    <div key={i} className="glass-card p-4">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">{k.label}</p>
                        <div className="text-2xl font-bold font-mono-data text-slate-800 mb-1">{k.value}</div>
                        <p className="text-xs text-slate-400">{k.trend}</p>
                    </div>
                ))}
            </div>

            {/* Monthly Effort Chart */}
            <div className="glass-card p-5">
                <h3 className="font-heading font-semibold text-slate-700 text-sm mb-4">Monthly Planned vs Actual Effort</h3>
                <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={MONTHLY_DATA} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: 8, border: 'none', fontSize: 12 }} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Bar dataKey="planned" name="Planned Hours" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="actual" name="Actual Hours" fill="#1E4DB7" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Project Summary Table */}
            <div className="glass-card overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-heading font-semibold text-slate-700 text-sm">Project Summary Report</h3>
                    <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700">
                        <Filter size={12} /> Filter
                    </button>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Project Name</th>
                            <th>Planned Hrs</th>
                            <th>Actual Hrs</th>
                            <th>Variance</th>
                            <th>Completion</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map(p => {
                            const variance = Math.round(Math.abs(p.actualHours - p.plannedHours) / p.plannedHours * 100);
                            return (
                                <tr key={p.id}>
                                    <td className="font-medium text-slate-800">{p.name}</td>
                                    <td className="font-mono-data text-slate-600">{p.plannedHours}h</td>
                                    <td className="font-mono-data text-slate-600">{p.actualHours}h</td>
                                    <td>
                                        <span className="font-mono-data font-bold text-sm" style={{ color: variance <= 10 ? '#1DB954' : variance <= 20 ? '#F59E0B' : '#DC2626' }}>
                                            {variance}%
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 bg-slate-100 rounded-full h-1.5">
                                                <div className="h-1.5 rounded-full" style={{ width: `${p.completionPct}%`, background: '#1E4DB7' }} />
                                            </div>
                                            <span className="text-xs font-mono-data text-slate-600">{p.completionPct}%</span>
                                        </div>
                                    </td>
                                    <td><StatusBadge status={p.status} size="sm" /></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Engineer Performance Summary */}
            <div className="glass-card overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                    <h3 className="font-heading font-semibold text-slate-700 text-sm">Engineer Performance Summary</h3>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Engineer</th>
                            <th>Utilization</th>
                            <th>Reliability</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {engineers.map(e => (
                            <tr key={e.id}>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-slate-700 text-white text-xs flex items-center justify-center font-bold">{e.avatar}</div>
                                        <span className="font-medium text-slate-800">{e.name}</span>
                                    </div>
                                </td>
                                <td className="font-mono-data text-slate-700">{e.utilization}%</td>
                                <td className="font-mono-data text-slate-700">{e.reliabilityScore}%</td>
                                <td><StatusBadge status={e.isOverloaded ? 'overloaded' : e.utilization >= 80 ? 'at-risk' : 'on-track'} size="sm" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
