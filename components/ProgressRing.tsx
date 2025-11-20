import React from 'react';

interface ProgressRingProps {
  radius: number;
  stroke: number;
  progress: number;
  color: string;
  target: number;
  label: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({ radius, stroke, progress, color, target, label }) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 10) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="-rotate-90"
      >
        <circle
          stroke="#334155"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-white">{progress.toFixed(1)}</span>
        <span className="text-sm text-slate-400">/ {target}</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 mt-1">{label}</span>
      </div>
    </div>
  );
};