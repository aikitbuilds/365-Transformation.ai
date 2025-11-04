import React from 'react';

interface ProgressRingProps {
  radius: number;
  stroke: number;
  progress: number; // 0 to 100
  color: string;
  label: string;
  score: number;
  target: number;
  isLarge?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  radius,
  stroke,
  progress,
  color,
  label,
  score,
  target,
  isLarge = false
}) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

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
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-out' }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        {isLarge && <span className="text-sm font-medium text-slate-400 mb-1">{label}</span>}
        <span className={`${isLarge ? 'text-5xl' : 'text-2xl'} font-bold text-white`}>
          {score}
          <span className={`${isLarge ? 'text-2xl' : 'text-lg'} text-slate-400`}>/{target}</span>
        </span>
         {!isLarge && <span className="text-xs font-medium text-slate-400 mt-1">{label}</span>}
      </div>
    </div>
  );
};
