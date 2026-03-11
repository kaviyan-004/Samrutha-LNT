import { projects, tasks, engineers } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';

export default function ProjectsPage() {
    const { user } = useAuth();
    const myProjects = user?.role === 'employee'
        ? projects.filter(p => {
            const me = engineers.find(e => e.role === 'employee');
            return me ? me.projectIds.includes(p.id) : true;
        })
        : projects;

    return (
        <div className="space-y-6 fade-in-up">
            <h2 className="font-heading font-bold text-slate-800 text-lg">My Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {myProjects.map(p => {
                    const projTasks = tasks.filter(t => t.projectId === p.id);
                    const completedTasks = projTasks.filter(t => t.status === 'completed').length;
                    return (
                        <div key={p.id} className="glass-card p-5 card-hover">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="font-heading font-bold text-slate-800 text-sm leading-snug pr-2">{p.name}</h3>
                                <StatusBadge status={p.status} size="sm" />
                            </div>
                            <div className="mb-4">
                                <div className="flex justify-between text-xs text-slate-500 mb-1">
                                    <span>Progress</span>
                                    <span className="font-mono-data font-bold">{p.completionPct}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full transition-all"
                                        style={{
                                            width: `${p.completionPct}%`,
                                            background: p.status === 'on-track' ? '#1DB954' : p.status === 'at-risk' ? '#F59E0B' : '#DC2626'
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-center mb-4">
                                <div className="bg-slate-50 rounded-xl p-2">
                                    <div className="font-bold font-mono-data text-slate-800 text-sm">{p.plannedHours}h</div>
                                    <div className="text-xs text-slate-400">Planned</div>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-2">
                                    <div className="font-bold font-mono-data text-slate-800 text-sm">{p.actualHours}h</div>
                                    <div className="text-xs text-slate-400">Actual</div>
                                </div>
                            </div>
                            <div className="border-t border-slate-100 pt-3">
                                <p className="text-xs text-slate-500 mb-2 font-medium">Tasks ({completedTasks}/{projTasks.length} completed)</p>
                                <div className="space-y-1.5">
                                    {projTasks.slice(0, 3).map(t => (
                                        <div key={t.id} className="flex items-center justify-between text-xs">
                                            <span className="text-slate-600 truncate flex-1 pr-2">{t.name}</span>
                                            <StatusBadge status={t.status} size="sm" />
                                        </div>
                                    ))}
                                    {projTasks.length > 3 && (
                                        <p className="text-xs text-slate-400">+{projTasks.length - 3} more tasks</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
