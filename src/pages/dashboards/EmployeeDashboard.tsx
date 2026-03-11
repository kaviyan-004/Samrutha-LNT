/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import {
    CheckCircle, ChevronRight, ChevronLeft, Flame, TrendingUp
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadialBarChart, RadialBar, Cell
} from 'recharts';
import { engineers, tasks, projects, calcEffortAccuracy } from '../../data/mockData';
import StatusBadge from '../../components/StatusBadge';
import AnimatedCounter from '../../components/AnimatedCounter';
import type { BlockerType } from '../../data/mockData';

// Only Priya's data for demo
const ME = engineers[0];
const MY_TASKS = tasks.filter(t => t.assignedTo.includes('e1'));
const MY_PROJECTS = projects.filter(p => ME.projectIds.includes(p.id));

const BLOCKER_TYPES: BlockerType[] = [
    'Resource unavailable', 'Dependency pending', 'Technical issue', 'Client delay'
];

const STEP_LABELS = [
    'Project', 'Tasks', 'Hours', 'Completion', 'Blockers', 'Review'
];

interface CheckInData {
    projectId: string;
    taskIds: string[];
    plannedHours: number;
    actualHours: number;
    completionPct: number;
    hasBlocker: boolean;
    blockerType?: BlockerType;
}

export default function EmployeeDashboard() {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'checkin'>('dashboard');
    const [step, setStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [checkIn, setCheckIn] = useState<CheckInData>({
        projectId: '',
        taskIds: [],
        plannedHours: 8,
        actualHours: 0,
        completionPct: 50,
        hasBlocker: false,
        blockerType: undefined,
    });

    const selectedProject = MY_PROJECTS.find(p => p.id === checkIn.projectId);
    const projectTasks = tasks.filter(t => t.projectId === checkIn.projectId && t.assignedTo.includes('e1'));

    const accuracyPct = calcEffortAccuracy(ME.plannedHours, ME.actualHours);

    const handleSubmit = () => setSubmitted(true);
    const handleReset = () => { setSubmitted(false); setStep(1); setCheckIn({ projectId: '', taskIds: [], plannedHours: 8, actualHours: 0, completionPct: 50, hasBlocker: false }); };

    return (
        <div className="space-y-6 fade-in-up">
            {/* Tab switch */}
            <div className="flex gap-2">
                {[{ id: 'dashboard', label: 'My Dashboard' }, { id: 'checkin', label: 'Daily Check-In' }].map(t => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === t.id ? 'text-white' : 'bg-white text-slate-500 border border-slate-200'}`}
                        style={activeTab === t.id ? { background: '#003366' } : {}}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {activeTab === 'dashboard' && <EmployeeDashboardContent me={ME} accuracyPct={accuracyPct} />}
            {activeTab === 'checkin' && (
                submitted ? (
                    <CheckInSuccess onReset={handleReset} checkIn={checkIn} project={selectedProject} />
                ) : (
                    <CheckInWizard
                        step={step} setStep={setStep}
                        checkIn={checkIn} setCheckIn={setCheckIn}
                        myProjects={MY_PROJECTS} projectTasks={projectTasks}
                        onSubmit={handleSubmit}
                    />
                )
            )}
        </div>
    );
}

function EmployeeDashboardContent({ me, accuracyPct }: { me: typeof ME; accuracyPct: number }) {
    const gaugeData = [{ value: accuracyPct, fill: accuracyPct >= 80 ? '#1DB954' : accuracyPct >= 60 ? '#F59E0B' : '#EF4444' }];

    return (
        <div className="space-y-6">
            {/* KPI row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Effort Accuracy', value: accuracyPct, suffix: '%', color: '#1DB954' },
                    { label: 'Utilization', value: me.utilization, suffix: '%', color: '#1E4DB7' },
                    { label: 'Reliability Score', value: me.reliabilityScore, suffix: '%', color: '#00C896' },
                    { label: 'Day Streak', value: 7, suffix: ' days', prefix: '🔥 ', color: '#F59E0B' },
                ].map((k, i) => (
                    <div key={i} className="glass-card p-4 card-hover fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">{k.label}</p>
                        <AnimatedCounter target={k.value} suffix={k.suffix} prefix={k.prefix} className="text-2xl font-bold" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Effort Accuracy Gauge */}
                <div className="glass-card p-5">
                    <h3 className="font-heading font-semibold text-slate-700 text-sm mb-4">Effort Accuracy</h3>
                    <div className="relative flex justify-center items-center" style={{ height: 180 }}>
                        <ResponsiveContainer width="100%" height={180}>
                            <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={gaugeData} startAngle={90} endAngle={-270}>
                                <RadialBar dataKey="value" cornerRadius={6} background={{ fill: '#F1F5F9' }}>
                                    {gaugeData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                                </RadialBar>
                            </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="gauge-center text-center">
                            <div className="text-2xl font-bold font-mono-data" style={{ color: gaugeData[0].fill }}>{accuracyPct}%</div>
                            <div className="text-xs text-slate-400">Accuracy</div>
                        </div>
                    </div>
                    <p className="text-center text-xs text-slate-500 mt-2">You tend to underestimate tasks by <strong>~{100 - accuracyPct}%</strong></p>
                </div>

                {/* Weekly Hours Chart */}
                <div className="glass-card p-5 lg:col-span-2">
                    <h3 className="font-heading font-semibold text-slate-700 text-sm mb-4">Weekly Effort (This Week)</h3>
                    <ResponsiveContainer width="100%" height={160}>
                        <BarChart data={me.weeklyData} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 12 }}
                            />
                            <Bar dataKey="planned" name="Planned" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="actual" name="Actual" fill="#1E4DB7" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="flex gap-4 mt-2 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-slate-200" />Planned</div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ background: '#1E4DB7' }} />Actual</div>
                    </div>
                </div>
            </div>

            {/* My Tasks Today */}
            <div className="glass-card p-5">
                <h3 className="font-heading font-semibold text-slate-700 text-sm mb-4">My Tasks Today</h3>
                <div className="space-y-3">
                    {tasks.filter(t => t.assignedTo.includes('e1')).map(task => (
                        <div key={task.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-slate-700 truncate">{task.name}</div>
                                <div className="text-xs text-slate-400 mt-0.5">
                                    {projects.find(p => p.id === task.projectId)?.name}
                                </div>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                                <div className="text-xs font-mono-data text-slate-500">{task.actualHours}h / {task.plannedHours}h</div>
                                <div className="w-20 bg-slate-200 rounded-full h-1.5">
                                    <div className="h-1.5 rounded-full" style={{ width: `${task.completionPct}%`, background: task.completionPct === 100 ? '#1DB954' : '#1E4DB7' }} />
                                </div>
                                <StatusBadge status={task.status} size="sm" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function CheckInWizard({ step, setStep, checkIn, setCheckIn, myProjects, projectTasks, onSubmit }: any) {
    const progress = ((step - 1) / 5) * 100;

    const canNext = () => {
        if (step === 1) return !!checkIn.projectId;
        if (step === 2) return checkIn.taskIds.length > 0;
        if (step === 3) return checkIn.actualHours > 0;
        return true;
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="glass-card p-8">
                {/* Progress bar */}
                <div className="mb-8">
                    <div className="flex justify-between mb-2">
                        {STEP_LABELS.map((label, i) => (
                            <div key={i} className="flex flex-col items-center gap-1">
                                <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i + 1 < step ? 'step-done' : i + 1 === step ? 'step-active' : 'step-pending'
                                        }`}
                                >
                                    {i + 1 < step ? <CheckCircle size={14} /> : i + 1}
                                </div>
                                <span className="text-xs text-slate-400 hidden md:block">{label}</span>
                            </div>
                        ))}
                    </div>
                    <div className="relative h-1.5 bg-slate-100 rounded-full mt-2">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: '#1E4DB7' }} />
                    </div>
                </div>

                {/* Step Content */}
                <div className="min-h-64">
                    {step === 1 && (
                        <div>
                            <h3 className="font-heading font-bold text-slate-800 text-lg mb-2">Which project did you work on today?</h3>
                            <p className="text-slate-400 text-sm mb-6">Select from your assigned projects</p>
                            <div className="space-y-3">
                                {myProjects.map((p: any) => (
                                    <button
                                        key={p.id}
                                        onClick={() => setCheckIn((c: any) => ({ ...c, projectId: p.id, taskIds: [] }))}
                                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${checkIn.projectId === p.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-300'}`}
                                    >
                                        <div className="font-semibold text-slate-700">{p.name}</div>
                                        <div className="text-xs text-slate-400 mt-1">{p.completionPct}% complete • <StatusBadge status={p.status} size="sm" /></div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h3 className="font-heading font-bold text-slate-800 text-lg mb-2">Which tasks did you work on?</h3>
                            <p className="text-slate-400 text-sm mb-6">Select all that apply</p>
                            <div className="space-y-3">
                                {projectTasks.length === 0 && <p className="text-slate-400 text-sm">No tasks found for this project.</p>}
                                {projectTasks.map((t: any) => {
                                    const selected = checkIn.taskIds.includes(t.id);
                                    return (
                                        <button
                                            key={t.id}
                                            onClick={() => setCheckIn((c: any) => ({
                                                ...c,
                                                taskIds: selected ? c.taskIds.filter((id: string) => id !== t.id) : [...c.taskIds, t.id]
                                            }))}
                                            className={`w-full p-3 rounded-xl border-2 text-left flex items-center gap-3 transition-all ${selected ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-300'}`}
                                        >
                                            <div className={`w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 ${selected ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}>
                                                {selected && <CheckCircle size={12} color="white" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-semibold text-slate-700">{t.name}</div>
                                                <div className="text-xs text-slate-400">{t.plannedHours}h planned</div>
                                            </div>
                                            <StatusBadge status={t.status} size="sm" />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h3 className="font-heading font-bold text-slate-800 text-lg mb-2">Hours: Planned vs Actual</h3>
                            <p className="text-slate-400 text-sm mb-6">How did your time compare to plan?</p>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Planned Hours</label>
                                    <input
                                        type="number"
                                        min={1} max={24} step={0.5}
                                        value={checkIn.plannedHours}
                                        onChange={e => setCheckIn((c: any) => ({ ...c, plannedHours: +e.target.value }))}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-center text-2xl font-bold font-mono-data text-slate-700 focus:outline-none"
                                        style={{ boxShadow: '0 0 0 0' }}
                                        onFocus={e => e.target.style.boxShadow = '0 0 0 3px rgba(30,77,183,0.15)'}
                                        onBlur={e => e.target.style.boxShadow = ''}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Actual Hours</label>
                                    <input
                                        type="number"
                                        min={0.5} max={24} step={0.5}
                                        value={checkIn.actualHours}
                                        onChange={e => setCheckIn((c: any) => ({ ...c, actualHours: +e.target.value }))}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-center text-2xl font-bold font-mono-data text-slate-700 focus:outline-none"
                                        onFocus={e => e.target.style.boxShadow = '0 0 0 3px rgba(30,77,183,0.15)'}
                                        onBlur={e => e.target.style.boxShadow = ''}
                                    />
                                </div>
                            </div>
                            {checkIn.actualHours > 0 && checkIn.plannedHours > 0 && (
                                <div className={`mt-4 p-3 rounded-xl text-sm font-medium ${Math.abs(checkIn.actualHours - checkIn.plannedHours) / checkIn.plannedHours < 0.1
                                    ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                                    }`}>
                                    Variance: {((Math.abs(checkIn.actualHours - checkIn.plannedHours) / checkIn.plannedHours) * 100).toFixed(0)}%
                                    {checkIn.actualHours > checkIn.plannedHours ? ' over plan' : ' under plan'}
                                </div>
                            )}
                        </div>
                    )}

                    {step === 4 && (
                        <div>
                            <h3 className="font-heading font-bold text-slate-800 text-lg mb-2">Task Completion Status</h3>
                            <p className="text-slate-400 text-sm mb-6">What percentage of your tasks are completed?</p>
                            <div className="text-center mb-4">
                                <div className="text-5xl font-bold font-mono-data" style={{ color: checkIn.completionPct >= 70 ? '#1DB954' : checkIn.completionPct >= 40 ? '#F59E0B' : '#EF4444' }}>
                                    {checkIn.completionPct}%
                                </div>
                            </div>
                            <input
                                type="range" min={0} max={100} step={5}
                                value={checkIn.completionPct}
                                onChange={e => setCheckIn((c: any) => ({ ...c, completionPct: +e.target.value }))}
                                className="w-full h-2 rounded-full outline-none cursor-pointer slider-custom"
                                style={{ accentColor: '#1E4DB7' }}
                            />
                            <div className="flex justify-between text-xs text-slate-400 mt-1">
                                <span>0%</span><span>100%</span>
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div>
                            <h3 className="font-heading font-bold text-slate-800 text-lg mb-2">Any Blockers Today?</h3>
                            <p className="text-slate-400 text-sm mb-6">Flag anything preventing progress</p>
                            <div className="flex gap-4 mb-6">
                                {[{ val: false, label: 'No Blockers', color: '#1DB954' }, { val: true, label: 'Yes, I have a blocker', color: '#EF4444' }].map(opt => (
                                    <button
                                        key={String(opt.val)}
                                        onClick={() => setCheckIn((c: any) => ({ ...c, hasBlocker: opt.val, blockerType: undefined }))}
                                        className={`flex-1 p-4 rounded-xl border-2 font-semibold text-sm transition-all ${checkIn.hasBlocker === opt.val ? 'border-current text-white' : 'border-slate-200 text-slate-500'}`}
                                        style={checkIn.hasBlocker === opt.val ? { borderColor: opt.color, background: opt.color } : {}}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                            {checkIn.hasBlocker && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Blocker Type</label>
                                    <select
                                        value={checkIn.blockerType || ''}
                                        onChange={e => setCheckIn((c: any) => ({ ...c, blockerType: e.target.value as BlockerType }))}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none"
                                    >
                                        <option value="">Select blocker type...</option>
                                        {BLOCKER_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 6 && (
                        <div>
                            <h3 className="font-heading font-bold text-slate-800 text-lg mb-4">Review Your Log</h3>
                            <div className="space-y-3 bg-slate-50 rounded-xl p-4">
                                <Row label="Project" value={myProjects.find((p: any) => p.id === checkIn.projectId)?.name || '-'} />
                                <Row label="Tasks" value={`${checkIn.taskIds.length} task(s) logged`} />
                                <Row label="Planned Hours" value={`${checkIn.plannedHours}h`} />
                                <Row label="Actual Hours" value={`${checkIn.actualHours}h`} />
                                <Row label="Completion" value={`${checkIn.completionPct}%`} />
                                <Row label="Blockers" value={checkIn.hasBlocker ? `Yes — ${checkIn.blockerType || 'Unspecified'}` : 'None'} />
                            </div>
                            <div className="mt-4 p-3 rounded-xl text-sm" style={{ background: '#EFF6FF', color: '#1E40AF' }}>
                                Effort Accuracy for today: <strong>{calcEffortAccuracy(checkIn.plannedHours, checkIn.actualHours)}%</strong>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
                    <button
                        onClick={() => setStep(s => s - 1)}
                        disabled={step === 1}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-all"
                    >
                        <ChevronLeft size={16} /> Back
                    </button>
                    {step < 6 ? (
                        <button
                            onClick={() => setStep(s => s + 1)}
                            disabled={!canNext()}
                            className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-40"
                            style={{ background: '#003366' }}
                        >
                            Next <ChevronRight size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={onSubmit}
                            className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold text-white transition-all"
                            style={{ background: '#1DB954' }}
                        >
                            <CheckCircle size={16} /> Submit Log
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between text-sm">
            <span className="text-slate-500 font-medium">{label}</span>
            <span className="text-slate-800 font-semibold">{value}</span>
        </div>
    );
}

function CheckInSuccess({ onReset, checkIn, project }: any) {
    return (
        <div className="max-w-md mx-auto text-center glass-card p-10 fade-in-up">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#dcfce7' }}>
                <CheckCircle size={32} color="#1DB954" />
            </div>
            <h3 className="font-heading font-bold text-slate-800 text-xl mb-2">Work Log Submitted!</h3>
            <p className="text-slate-400 text-sm mb-4">
                Your effort for <strong>{project?.name}</strong> has been recorded successfully.
            </p>
            <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Effort Accuracy</span>
                    <span className="font-bold font-mono-data" style={{ color: '#1DB954' }}>{calcEffortAccuracy(checkIn.plannedHours, checkIn.actualHours)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Completion</span>
                    <span className="font-bold font-mono-data">{checkIn.completionPct}%</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Streak</span>
                    <span className="font-bold">🔥 8 days in a row</span>
                </div>
            </div>
            <button onClick={onReset} className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ background: '#003366' }}>
                Log Another Day
            </button>
        </div>
    );
}
