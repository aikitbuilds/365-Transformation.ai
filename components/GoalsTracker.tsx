
import React, { useState } from 'react';
import { Goal, MetricEntry } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './Card';
import { TargetIcon, ZapIcon, TrendingUpIcon } from './icons/IconComponents';
import { AiGoalGeneratorModal } from './AiGoalGeneratorModal';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const pillarStyles = {
    Health: {
        borderColor: '#10b981',
        bgColor: 'bg-green-500/10'
    },
    Wealth: {
        borderColor: '#f59e0b',
        bgColor: 'bg-amber-500/10'
    },
    Relationships: {
        borderColor: '#3b82f6',
        bgColor: 'bg-blue-500/10'
    },
    General: {
        borderColor: '#a78bfa',
        bgColor: 'bg-violet-500/10'
    }
}

const statusStyles = {
    'On Track': 'bg-green-500',
    'At Risk': 'bg-yellow-500',
    'Achieved': 'bg-violet-500',
    'Upcoming': 'bg-slate-500',
}

const ProgressBar: React.FC<{ progress: number; target: number; color: string }> = ({ progress, target, color }) => {
    const percentage = target > 0 ? (progress / target) * 100 : 0;
    return (
        <div className="w-full bg-slate-700 rounded-full h-2">
            <div
                className="h-2 rounded-full"
                style={{ width: `${Math.min(percentage, 100)}%`, backgroundColor: color, transition: 'width 0.5s ease-in-out' }}
            ></div>
        </div>
    );
};

interface MetricChartProps {
    data: MetricEntry[];
    color: string;
    unit: string;
}

const MetricChart: React.FC<MetricChartProps> = ({ data, color, unit }) => {
    if (!data || data.length === 0) return null;

    return (
        <div className="h-32 w-full mt-2 bg-slate-800/50 rounded-md p-2 border border-slate-700/50">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
                            <stop offset="95%" stopColor={color} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis 
                        dataKey="date" 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}
                    />
                    <YAxis 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                        width={30}
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc', fontSize: '12px' }}
                        itemStyle={{ color: color }}
                        formatter={(value: number) => [`${value} ${unit}`, 'Progress']}
                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={color} 
                        fill={`url(#gradient-${color})`} 
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

const GoalItem: React.FC<{ goal: Goal }> = ({ goal }) => {
    const [showTrends, setShowTrends] = useState(false);
    const daysRemaining = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const pillarStyle = pillarStyles[goal.pillar];
    
    const hasHistory = goal.keyMetrics.some(m => m.history && m.history.length > 0);
    
    return (
        <div className={`p-4 rounded-lg border-l-4 ${pillarStyle.bgColor}`} style={{ borderColor: pillarStyle.borderColor }}>
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-semibold text-slate-100">{goal.title}</h4>
                    <p className="text-xs text-slate-400">{goal.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full text-slate-900 ${statusStyles[goal.status]}`}>{goal.status}</span>
                </div>
            </div>
            
            <div className="mt-4 space-y-4">
                {goal.keyMetrics.map(metric => (
                    <div key={metric.name}>
                        <div className="flex justify-between items-baseline text-xs mb-1">
                            <span className="text-slate-300 font-medium">{metric.name}</span>
                            <span className="text-slate-400 font-mono">
                                {metric.unit}{metric.progress} / {metric.unit}{metric.target}
                            </span>
                        </div>
                        <ProgressBar progress={metric.progress} target={metric.target} color={pillarStyle.borderColor} />
                        
                        {showTrends && metric.history && metric.history.length > 0 && (
                            <MetricChart 
                                data={metric.history} 
                                color={pillarStyle.borderColor} 
                                unit={metric.unit}
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-4 flex justify-between items-center">
                 <div className="text-xs text-slate-500 font-medium">
                    Target: {new Date(goal.targetDate).toLocaleDateString()}
                    {daysRemaining >= 0 && goal.status !== 'Achieved' && ` (${daysRemaining} days left)`}
                </div>
                
                {hasHistory && (
                    <button 
                        onClick={() => setShowTrends(!showTrends)}
                        className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium"
                    >
                        <TrendingUpIcon className="w-3 h-3" />
                        {showTrends ? 'Hide Trends' : 'View Trends'}
                    </button>
                )}
            </div>
        </div>
    );
};

interface GoalsTrackerProps {
    goals: Goal[];
    onAddGoals?: (newGoals: Goal[]) => void;
}

export const GoalsTracker: React.FC<GoalsTrackerProps> = ({ goals, onAddGoals }) => {
    const [showAiModal, setShowAiModal] = useState(false);

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                        <CardTitle className="flex items-center gap-2"><TargetIcon className="w-5 h-5 text-violet-400" /> Goals & Milestones</CardTitle>
                        <CardDescription>Your long-term objectives and their current progress.</CardDescription>
                    </div>
                    {onAddGoals && (
                        <button 
                            onClick={() => setShowAiModal(true)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-violet-300 hover:text-white text-xs font-bold uppercase tracking-wide rounded-lg transition-all"
                        >
                            <ZapIcon className="w-3 h-3" /> AI Coach
                        </button>
                    )}
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {goals.map(goal => <GoalItem key={goal.id} goal={goal} />)}
                        {goals.length === 0 && (
                            <div className="text-center py-8 text-slate-500">
                                No active goals. Use the AI Coach to create some!
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
            {showAiModal && onAddGoals && (
                <AiGoalGeneratorModal 
                    onClose={() => setShowAiModal(false)} 
                    onAddGoals={onAddGoals}
                    currentGoals={goals}
                />
            )}
        </>
    );
};
