
import React, { useState } from 'react';
import { Goal } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './Card';
import { TargetIcon, ZapIcon } from './icons/IconComponents';
import { AiGoalGeneratorModal } from './AiGoalGeneratorModal';

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

const GoalItem: React.FC<{ goal: Goal }> = ({ goal }) => {
    const daysRemaining = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const pillarStyle = pillarStyles[goal.pillar];
    
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
            
            <div className="mt-4 space-y-3">
                {goal.keyMetrics.map(metric => (
                    <div key={metric.name}>
                        <div className="flex justify-between items-baseline text-xs mb-1">
                            <span className="text-slate-300 font-medium">{metric.name}</span>
                            <span className="text-slate-400 font-mono">
                                {metric.unit}{metric.progress} / {metric.unit}{metric.target}
                            </span>
                        </div>
                        <ProgressBar progress={metric.progress} target={metric.target} color={pillarStyle.borderColor} />
                    </div>
                ))}
            </div>

            <div className="mt-4 text-right text-xs text-slate-500 font-medium">
                Target: {new Date(goal.targetDate).toLocaleDateString()}
                {daysRemaining >= 0 && goal.status !== 'Achieved' && ` (${daysRemaining} days left)`}
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
                />
            )}
        </>
    );
};
