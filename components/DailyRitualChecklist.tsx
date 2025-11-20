import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { useTimer } from '../hooks/useTimer';
import { CheckCircleIcon, PlayIcon, PauseIcon, RefreshCwIcon } from './icons/IconComponents';

const initialRituals = [
    { id: 'r1', text: '5:30 AM Wake Up', completed: true },
    { id: 'r2', text: '10 min Meditation', completed: false, timer: 600 },
    { id: 'r3', text: 'Journal Entry', completed: false },
    { id: 'r4', text: 'Plan Top 3 Tasks', completed: true },
];

export const DailyRitualChecklist: React.FC = () => {
    const [rituals, setRituals] = useState(initialRituals);
    const meditationTimer = useTimer(600);

    const handleToggleRitual = (id: string) => {
        setRituals(rituals.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Daily Rituals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {rituals.map(ritual => (
                    <div key={ritual.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <button onClick={() => handleToggleRitual(ritual.id)}>
                             {ritual.completed ? 
                                <CheckCircleIcon className="w-5 h-5 text-green-500" /> : 
                                <div className="w-5 h-5 rounded-full border-2 border-slate-600"></div>
                             }
                           </button>
                           <span className={`text-sm ${ritual.completed ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                               {ritual.text}
                           </span>
                        </div>
                        {ritual.timer && (
                            <div className="flex items-center gap-2 text-xs">
                                <span className="font-mono text-slate-400">{meditationTimer.formatTime()}</span>
                                <button onClick={meditationTimer.toggle} className="text-slate-400 hover:text-white transition-colors">
                                    {meditationTimer.isActive ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                                </button>
                                <button onClick={meditationTimer.reset} className="text-slate-400 hover:text-white transition-colors">
                                    <RefreshCwIcon className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};
