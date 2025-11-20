import React from 'react';
import { Streak } from '../types';

const getStreakColor = (days: number) => {
    if (days >= 30) return 'text-violet-400';
    if (days >= 7) return 'text-sky-400';
    if (days > 0) return 'text-amber-400';
    return 'text-slate-500';
};

const getGlowClass = (days: number) => {
    if (days >= 30) return 'shadow-[0_0_15px_rgba(139,92,246,0.7)]';
    if (days >= 7) return 'shadow-[0_0_10px_rgba(56,189,248,0.5)]';
    return '';
}

export const StreakIndicator: React.FC<{ streak: Streak }> = ({ streak }) => {
    const progress = (streak.days % 30) / 30; // Cycle every 30 days
    const circumference = 2 * Math.PI * 18;
    const offset = circumference - progress * circumference;

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 40 40">
          <circle
            className="text-slate-700"
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            r="18"
            cx="20"
            cy="20"
          />
          <circle
            className={getStreakColor(streak.days)}
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            r="18"
            cx="20"
cy="20"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-slate-800 ${getGlowClass(streak.days)} transition-shadow`}>
            <streak.icon className={`w-6 h-6 ${getStreakColor(streak.days)} ${streak.days > 0 ? 'animate-pulse' : ''}`} />
        </div>
      </div>
      <p className={`mt-2 text-lg font-bold ${getStreakColor(streak.days)}`}>{streak.days}</p>
      <p className="text-xs text-slate-400">{streak.name}</p>
    </div>
  );
};