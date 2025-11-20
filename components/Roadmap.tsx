import React from 'react';
import { RoadmapPhase } from '../types';
import { Card, CardContent } from './Card';

const statusStyles = {
  Completed: 'bg-green-500',
  'In Progress': 'bg-blue-500 animate-pulse',
  Upcoming: 'bg-slate-600',
};

export const Roadmap: React.FC<{ phases: RoadmapPhase[] }> = ({ phases }) => {
  return (
    <div>
        <h3 className="text-xl font-bold mb-4 text-white">Project Roadmap</h3>
        <Card>
            <CardContent>
                <div className="flex items-start">
                    {phases.map((phase, index) => (
                        <React.Fragment key={phase.name}>
                            <div className="flex flex-col items-center w-1/4">
                                <div className={`w-4 h-4 rounded-full ${statusStyles[phase.status]}`}></div>
                                <h4 className="mt-2 text-sm font-semibold text-center text-slate-200">{phase.name}</h4>
                                <p className="text-xs text-slate-400">{phase.weeks}</p>
                                <p className="mt-2 text-xs text-center text-slate-500 px-2">{phase.description}</p>
                            </div>
                            {index < phases.length - 1 && (
                                <div className="flex-1 mt-1.5 h-1 bg-slate-700 rounded-full"></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
  );
};