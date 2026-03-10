// Mock data for EffortIQ demo

export type ProjectStatus = 'on-track' | 'at-risk' | 'delayed';
export type TaskStatus = 'completed' | 'in-progress' | 'not-started' | 'blocked';
export type BlockerType = 'Resource unavailable' | 'Dependency pending' | 'Technical issue' | 'Client delay';

export interface Task {
    id: string;
    name: string;
    projectId: string;
    plannedHours: number;
    actualHours: number;
    completionPct: number;
    status: TaskStatus;
    assignedTo: string[];
    plannedEndDate: string;
    actualEndDate?: string;
    hasBlocker: boolean;
    blockerType?: BlockerType;
}

export interface Project {
    id: string;
    name: string;
    status: ProjectStatus;
    completionPct: number;
    healthScore: number;
    plannedHours: number;
    actualHours: number;
    estimatedRevenue: number;
    startDate: string;
    endDate: string;
}

export interface Engineer {
    id: string;
    name: string;
    role: 'employee' | 'manager' | 'projectlead';
    avatar: string;
    department: string;
    projectIds: string[];
    utilization: number;
    reliabilityScore: number;
    plannedHours: number;
    actualHours: number;
    isOverloaded: boolean;
    skillSet: string[];
    weeklyData: { day: string; planned: number; actual: number }[];
}

export interface DailyLog {
    id: string;
    engineerId: string;
    projectId: string;
    taskIds: string[];
    plannedHours: number;
    actualHours: number;
    completionPct: number;
    hasBlocker: boolean;
    blockerType?: BlockerType;
    date: string;
}

// ===== PROJECTS =====
export const projects: Project[] = [
    {
        id: 'proj-1',
        name: 'Bridge Design Automation',
        status: 'on-track',
        completionPct: 68,
        healthScore: 85,
        plannedHours: 2400,
        actualHours: 2150,
        estimatedRevenue: 4200000,
        startDate: '2025-10-01',
        endDate: '2026-06-30',
    },
    {
        id: 'proj-2',
        name: 'Smart Grid Layout Tool',
        status: 'at-risk',
        completionPct: 45,
        healthScore: 62,
        plannedHours: 1800,
        actualHours: 1950,
        estimatedRevenue: 3100000,
        startDate: '2025-11-15',
        endDate: '2026-05-31',
    },
    {
        id: 'proj-3',
        name: 'Tunnel Structural Analysis',
        status: 'delayed',
        completionPct: 23,
        healthScore: 38,
        plannedHours: 3200,
        actualHours: 2800,
        estimatedRevenue: 5800000,
        startDate: '2025-09-01',
        endDate: '2026-04-30',
    },
];

// ===== TASKS =====
export const tasks: Task[] = [
    // Bridge Design Automation (proj-1)
    { id: 't1', name: 'FEA Model Setup', projectId: 'proj-1', plannedHours: 80, actualHours: 85, completionPct: 100, status: 'completed', assignedTo: ['e1'], plannedEndDate: '2025-12-15', actualEndDate: '2025-12-17', hasBlocker: false },
    { id: 't2', name: 'Load Case Analysis', projectId: 'proj-1', plannedHours: 120, actualHours: 110, completionPct: 100, status: 'completed', assignedTo: ['e2'], plannedEndDate: '2026-01-10', actualEndDate: '2026-01-09', hasBlocker: false },
    { id: 't3', name: 'Design Optimization Loop', projectId: 'proj-1', plannedHours: 160, actualHours: 180, completionPct: 75, status: 'in-progress', assignedTo: ['e1', 'e3'], plannedEndDate: '2026-03-20', hasBlocker: true, blockerType: 'Dependency pending' },
    { id: 't4', name: 'Report & Documentation', projectId: 'proj-1', plannedHours: 60, actualHours: 20, completionPct: 30, status: 'in-progress', assignedTo: ['e4'], plannedEndDate: '2026-04-15', hasBlocker: false },
    { id: 't5', name: 'Client Review Preparation', projectId: 'proj-1', plannedHours: 40, actualHours: 0, completionPct: 0, status: 'not-started', assignedTo: ['e2', 'e5'], plannedEndDate: '2026-05-01', hasBlocker: false },

    // Smart Grid Layout Tool (proj-2)
    { id: 't6', name: 'Requirements Gathering', projectId: 'proj-2', plannedHours: 40, actualHours: 55, completionPct: 100, status: 'completed', assignedTo: ['e5'], plannedEndDate: '2025-12-01', actualEndDate: '2025-12-10', hasBlocker: false },
    { id: 't7', name: 'Grid Algorithm Design', projectId: 'proj-2', plannedHours: 200, actualHours: 240, completionPct: 80, status: 'in-progress', assignedTo: ['e3', 'e6'], plannedEndDate: '2026-02-28', hasBlocker: true, blockerType: 'Technical issue' },
    { id: 't8', name: 'UI Prototype', projectId: 'proj-2', plannedHours: 100, actualHours: 120, completionPct: 60, status: 'in-progress', assignedTo: ['e7'], plannedEndDate: '2026-03-15', hasBlocker: false },
    { id: 't9', name: 'Integration Testing', projectId: 'proj-2', plannedHours: 80, actualHours: 10, completionPct: 10, status: 'in-progress', assignedTo: ['e8'], plannedEndDate: '2026-04-30', hasBlocker: true, blockerType: 'Dependency pending' },
    { id: 't10', name: 'Performance Benchmarking', projectId: 'proj-2', plannedHours: 60, actualHours: 0, completionPct: 0, status: 'not-started', assignedTo: ['e6'], plannedEndDate: '2026-05-15', hasBlocker: false },

    // Tunnel Structural Analysis (proj-3)
    { id: 't11', name: 'Geological Survey Data', projectId: 'proj-3', plannedHours: 120, actualHours: 130, completionPct: 100, status: 'completed', assignedTo: ['e4', 'e9'], plannedEndDate: '2025-11-15', actualEndDate: '2025-11-28', hasBlocker: false },
    { id: 't12', name: 'Structural Model Build', projectId: 'proj-3', plannedHours: 300, actualHours: 280, completionPct: 55, status: 'in-progress', assignedTo: ['e9', 'e10'], plannedEndDate: '2026-01-31', hasBlocker: true, blockerType: 'Resource unavailable' },
    { id: 't13', name: 'Stress Analysis Simulation', projectId: 'proj-3', plannedHours: 400, actualHours: 80, completionPct: 15, status: 'in-progress', assignedTo: ['e3'], plannedEndDate: '2026-02-28', hasBlocker: true, blockerType: 'Client delay' },
    { id: 't14', name: 'Safety Factor Validation', projectId: 'proj-3', plannedHours: 200, actualHours: 0, completionPct: 0, status: 'not-started', assignedTo: ['e10'], plannedEndDate: '2026-03-31', hasBlocker: false },
    { id: 't15', name: 'Final Technical Report', projectId: 'proj-3', plannedHours: 80, actualHours: 0, completionPct: 0, status: 'not-started', assignedTo: ['e4'], plannedEndDate: '2026-04-15', hasBlocker: false },
];

// ===== ENGINEERS =====
export const engineers: Engineer[] = [
    {
        id: 'e1', name: 'Priya Sharma', role: 'employee', avatar: 'PS',
        department: 'Bridge Engineering', projectIds: ['proj-1'],
        utilization: 92, reliabilityScore: 88, plannedHours: 40, actualHours: 37,
        isOverloaded: false, skillSet: ['FEA', 'Structural Analysis', 'AutoCAD'],
        weeklyData: [
            { day: 'Mon', planned: 8, actual: 9 },
            { day: 'Tue', planned: 8, actual: 7 },
            { day: 'Wed', planned: 8, actual: 8 },
            { day: 'Thu', planned: 8, actual: 9 },
            { day: 'Fri', planned: 8, actual: 4 },
        ],
    },
    {
        id: 'e2', name: 'Arjun Mehta', role: 'employee', avatar: 'AM',
        department: 'Bridge Engineering', projectIds: ['proj-1'],
        utilization: 74, reliabilityScore: 94, plannedHours: 40, actualHours: 30,
        isOverloaded: false, skillSet: ['Load Analysis', 'STAAD Pro', 'Python'],
        weeklyData: [
            { day: 'Mon', planned: 8, actual: 6 },
            { day: 'Tue', planned: 8, actual: 7 },
            { day: 'Wed', planned: 8, actual: 7 },
            { day: 'Thu', planned: 8, actual: 6 },
            { day: 'Fri', planned: 8, actual: 4 },
        ],
    },
    {
        id: 'e3', name: 'Ravi Kumar', role: 'employee', avatar: 'RK',
        department: 'Smart Grid', projectIds: ['proj-1', 'proj-2', 'proj-3'],
        utilization: 110, reliabilityScore: 71, plannedHours: 40, actualHours: 44,
        isOverloaded: true, skillSet: ['Grid Design', 'CAD', 'Optimization'],
        weeklyData: [
            { day: 'Mon', planned: 8, actual: 10 },
            { day: 'Tue', planned: 8, actual: 9 },
            { day: 'Wed', planned: 8, actual: 11 },
            { day: 'Thu', planned: 8, actual: 8 },
            { day: 'Fri', planned: 8, actual: 6 },
        ],
    },
    {
        id: 'e4', name: 'Meena Krishnan', role: 'employee', avatar: 'MK',
        department: 'Documentation', projectIds: ['proj-1', 'proj-3'],
        utilization: 68, reliabilityScore: 91, plannedHours: 40, actualHours: 27,
        isOverloaded: false, skillSet: ['Technical Writing', 'MS Office', 'Data Analysis'],
        weeklyData: [
            { day: 'Mon', planned: 8, actual: 6 },
            { day: 'Tue', planned: 8, actual: 5 },
            { day: 'Wed', planned: 8, actual: 7 },
            { day: 'Thu', planned: 8, actual: 5 },
            { day: 'Fri', planned: 8, actual: 4 },
        ],
    },
    {
        id: 'e5', name: 'Suresh Babu', role: 'employee', avatar: 'SB',
        department: 'Smart Grid', projectIds: ['proj-1', 'proj-2'],
        utilization: 85, reliabilityScore: 82, plannedHours: 40, actualHours: 34,
        isOverloaded: false, skillSet: ['Grid Analysis', 'AutoCAD', 'Matlab'],
        weeklyData: [
            { day: 'Mon', planned: 8, actual: 8 },
            { day: 'Tue', planned: 8, actual: 7 },
            { day: 'Wed', planned: 8, actual: 6 },
            { day: 'Thu', planned: 8, actual: 7 },
            { day: 'Fri', planned: 8, actual: 6 },
        ],
    },
    {
        id: 'e6', name: 'Divya Nair', role: 'employee', avatar: 'DN',
        department: 'Smart Grid', projectIds: ['proj-2'],
        utilization: 78, reliabilityScore: 89, plannedHours: 40, actualHours: 31,
        isOverloaded: false, skillSet: ['Algorithm Design', 'Python', 'R'],
        weeklyData: [
            { day: 'Mon', planned: 8, actual: 7 },
            { day: 'Tue', planned: 8, actual: 6 },
            { day: 'Wed', planned: 8, actual: 7 },
            { day: 'Thu', planned: 8, actual: 6 },
            { day: 'Fri', planned: 8, actual: 5 },
        ],
    },
    {
        id: 'e7', name: 'Kiran Joshi', role: 'employee', avatar: 'KJ',
        department: 'UI/UX Engineering', projectIds: ['proj-2'],
        utilization: 65, reliabilityScore: 76, plannedHours: 40, actualHours: 26,
        isOverloaded: false, skillSet: ['UI/UX', 'Figma', 'React'],
        weeklyData: [
            { day: 'Mon', planned: 8, actual: 5 },
            { day: 'Tue', planned: 8, actual: 6 },
            { day: 'Wed', planned: 8, actual: 5 },
            { day: 'Thu', planned: 8, actual: 6 },
            { day: 'Fri', planned: 8, actual: 4 },
        ],
    },
    {
        id: 'e8', name: 'Anjali Rao', role: 'employee', avatar: 'AR',
        department: 'Testing & QA', projectIds: ['proj-2'],
        utilization: 55, reliabilityScore: 85, plannedHours: 40, actualHours: 22,
        isOverloaded: false, skillSet: ['Testing', 'Selenium', 'JIRA'],
        weeklyData: [
            { day: 'Mon', planned: 8, actual: 4 },
            { day: 'Tue', planned: 8, actual: 5 },
            { day: 'Wed', planned: 8, actual: 5 },
            { day: 'Thu', planned: 8, actual: 4 },
            { day: 'Fri', planned: 8, actual: 4 },
        ],
    },
    {
        id: 'e9', name: 'Rohit Sinha', role: 'employee', avatar: 'RS',
        department: 'Structural Engineering', projectIds: ['proj-3'],
        utilization: 96, reliabilityScore: 79, plannedHours: 40, actualHours: 38,
        isOverloaded: false, skillSet: ['Structural FEA', 'ANSYS', 'SolidWorks'],
        weeklyData: [
            { day: 'Mon', planned: 8, actual: 9 },
            { day: 'Tue', planned: 8, actual: 8 },
            { day: 'Wed', planned: 8, actual: 7 },
            { day: 'Thu', planned: 8, actual: 8 },
            { day: 'Fri', planned: 8, actual: 6 },
        ],
    },
    {
        id: 'e10', name: 'Pooja Menon', role: 'employee', avatar: 'PM',
        department: 'Structural Engineering', projectIds: ['proj-3'],
        utilization: 82, reliabilityScore: 87, plannedHours: 40, actualHours: 33,
        isOverloaded: false, skillSet: ['Structural Safety', 'STAAD Pro', 'AutoCAD'],
        weeklyData: [
            { day: 'Mon', planned: 8, actual: 7 },
            { day: 'Tue', planned: 8, actual: 7 },
            { day: 'Wed', planned: 8, actual: 6 },
            { day: 'Thu', planned: 8, actual: 7 },
            { day: 'Fri', planned: 8, actual: 6 },
        ],
    },
];

// ===== AI ENGINE UTILITIES =====
export function calcEffortAccuracy(planned: number, actual: number): number {
    if (planned === 0) return 0;
    return Math.max(0, Math.round((1 - Math.abs(actual - planned) / planned) * 100));
}

export function calcProjectHealthScore(project: Project, projectTasks: Task[]): number {
    let score = 100;
    projectTasks.forEach(t => {
        if (t.actualHours > t.plannedHours * 1.2) score -= 5;
        if (t.status === 'blocked') score -= 10;
        if (t.status === 'not-started' && new Date(t.plannedEndDate) < new Date()) score -= 10;
    });
    const overallVariance = Math.abs(project.actualHours - project.plannedHours) / project.plannedHours;
    if (overallVariance > 0.2) score -= 15;
    return Math.max(0, Math.min(100, score));
}

export function getProjectStatusFromScore(score: number): ProjectStatus {
    if (score >= 80) return 'on-track';
    if (score >= 50) return 'at-risk';
    return 'delayed';
}

export function calcCapacityForecast(totalHours: number, committedHours: number): number {
    return Math.max(0, totalHours - committedHours);
}

// Chart data helpers
export const teamActivityHeatmap = [
    { week: 'W1', Mon: 32, Tue: 28, Wed: 35, Thu: 30, Fri: 22 },
    { week: 'W2', Mon: 35, Tue: 38, Wed: 40, Thu: 36, Fri: 25 },
    { week: 'W3', Mon: 28, Tue: 30, Wed: 32, Thu: 29, Fri: 18 },
    { week: 'W4', Mon: 40, Tue: 42, Wed: 38, Thu: 35, Fri: 20 },
];

export const capacityForecast = [
    { week: 'Week 1', available: 320, committed: 290, free: 30 },
    { week: 'Week 2', available: 320, committed: 280, free: 40 },
    { week: 'Week 3', available: 320, committed: 300, free: 20 },
    { week: 'Week 4', available: 320, committed: 260, free: 60 },
];

export const burnRateData = [
    { week: 'W1', planned: 120, actual: 110 },
    { week: 'W2', planned: 240, actual: 250 },
    { week: 'W3', planned: 360, actual: 390 },
    { week: 'W4', planned: 480, actual: 510 },
    { week: 'W5', planned: 600, actual: 640 },
    { week: 'W6', planned: 720, actual: 780 },
    { week: 'W7', planned: 840, actual: 900 },
    { week: 'W8', planned: 960, actual: 980 },
];

export const bandwidthTimeline = [
    { month: 'Mar', capacity: 350, utilized: 310 },
    { month: 'Apr', capacity: 350, utilized: 320 },
    { month: 'May', capacity: 370, utilized: 280 },
    { month: 'Jun', capacity: 370, utilized: 260 },
    { month: 'Jul', capacity: 390, utilized: 200 },
    { month: 'Aug', capacity: 390, utilized: 190 },
];
