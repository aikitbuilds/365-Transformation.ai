import React from 'react';
import { Task } from '../types';
import { Card } from './Card';
import { LayersIcon, TrendingUpIcon, CheckSquareIcon, DollarSignIcon } from './icons/IconComponents';

interface ProjectStatsProps {
    tasks: Task[];
}

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; trend?: string }> = ({ icon, title, value, trend }) => (
  <Card className="p-4 flex items-center gap-4">
    <div className="bg-slate-700/50 p-3 rounded-lg">
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-400">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </Card>
);

export const ProjectStats: React.FC<ProjectStatsProps> = ({ tasks }) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Done').length;
    const health = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const velocity = tasks.filter(t => t.status === 'In Progress').length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard 
                icon={<LayersIcon className="w-6 h-6 text-violet-400" />}
                title="Project Health"
                value={`${health}%`}
            />
            <StatCard 
                icon={<TrendingUpIcon className="w-6 h-6 text-green-400" />}
                title="Task Velocity"
                value={`${velocity} In Progress`}
            />
            <StatCard 
                icon={<CheckSquareIcon className="w-6 h-6 text-blue-400" />}
                title="Completed Tasks"
                value={`${completedTasks} / ${totalTasks}`}
            />
            <StatCard 
                icon={<DollarSignIcon className="w-6 h-6 text-yellow-400" />}
                title="Budget Status"
                value="On Track"
            />
        </div>
    );
};