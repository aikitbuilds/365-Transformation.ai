import React from 'react';
import { Task } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { LayersIcon, TrendingUpIcon, CheckSquareIcon, DollarSignIcon, BrainCircuitIcon } from './icons/IconComponents';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend } from 'recharts';

interface ProjectStatsProps {
    tasks: Task[];
}

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; subtext?: string; colorClass?: string }> = ({ icon, title, value, subtext, colorClass = "text-white" }) => (
  <Card className="p-4 flex items-center gap-4 bg-slate-800/50 border-slate-700">
    <div className={`bg-slate-700/50 p-3 rounded-lg`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{title}</p>
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
      {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
    </div>
  </Card>
);

// Mock data for Sprint Velocity (since we don't have historical snapshots in this MVP)
const mockVelocityData = [
    { name: 'Sprint 1', planned: 12, completed: 10 },
    { name: 'Sprint 2', planned: 15, completed: 14 },
    { name: 'Sprint 3', planned: 18, completed: 12 },
    { name: 'Sprint 4', planned: 20, completed: 22 },
];

export const ProjectStats: React.FC<ProjectStatsProps> = ({ tasks }) => {
    // KPI Calculations
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Done').length;
    const health = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    
    // Bug Tracking
    const bugs = tasks.filter(t => t.tags.includes('bug'));
    const bugCount = bugs.length;
    const openBugs = bugs.filter(t => t.status !== 'Done').length;
    const bugRate = totalTasks > 0 ? Math.round((bugCount / totalTasks) * 100) : 0;

    // Time Tracking Calculations
    const tasksWithEstimates = tasks.filter(t => t.estimatedHours !== undefined);
    const totalEstimated = tasksWithEstimates.reduce((acc, t) => acc + (t.estimatedHours || 0), 0);
    const totalActual = tasksWithEstimates.reduce((acc, t) => acc + (t.actualHours || 0), 0);
    
    // Prepare data for Time Variance Chart (Completed tasks only)
    const completedTasksWithTime = tasks
        .filter(t => t.status === 'Done' && t.estimatedHours && t.actualHours)
        .map(t => ({
            name: t.title.length > 15 ? t.title.substring(0, 12) + '...' : t.title,
            Estimated: t.estimatedHours,
            Actual: t.actualHours
        }));

    return (
        <div className="space-y-6">
            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard 
                    icon={<LayersIcon className="w-6 h-6 text-violet-400" />}
                    title="Completion Rate"
                    value={`${health}%`}
                    subtext={`${completedTasks} of ${totalTasks} tasks done`}
                    colorClass="text-violet-400"
                />
                <StatCard 
                    icon={<TrendingUpIcon className="w-6 h-6 text-emerald-400" />}
                    title="Sprint Velocity"
                    value="22 pts"
                    subtext="Current Sprint (Estimated)"
                    colorClass="text-emerald-400"
                />
                <StatCard 
                    icon={<BrainCircuitIcon className="w-6 h-6 text-rose-400" />}
                    title="Bug Rate"
                    value={`${bugRate}%`}
                    subtext={`${openBugs} active bugs remaining`}
                    colorClass="text-rose-400"
                />
                <StatCard 
                    icon={<DollarSignIcon className="w-6 h-6 text-amber-400" />}
                    title="Time Budget"
                    value={`${totalActual}h`}
                    subtext={`of ${totalEstimated}h estimated usage`}
                    colorClass={totalActual > totalEstimated ? "text-red-400" : "text-amber-400"}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Velocity Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Sprint Velocity History</CardTitle>
                        <p className="text-xs text-slate-400">Planned vs Completed Story Points per Sprint</p>
                    </CardHeader>
                    <CardContent className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={mockVelocityData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
                                    itemStyle={{ color: '#e2e8f0' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="planned" stroke="#94a3b8" strokeDasharray="5 5" name="Planned" />
                                <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} name="Completed" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Time Variance Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Estimated vs Actual Time</CardTitle>
                        <p className="text-xs text-slate-400">Hours spent on recently completed tasks</p>
                    </CardHeader>
                    <CardContent className="h-64">
                        {completedTasksWithTime.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={completedTasksWithTime} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} unit="h" />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
                                        cursor={{fill: '#334155', opacity: 0.4}}
                                    />
                                    <Legend />
                                    <Bar dataKey="Estimated" fill="#64748b" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="Actual" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                                Not enough data on completed tasks.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};