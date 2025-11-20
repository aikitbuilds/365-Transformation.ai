import React from 'react';

// Base interface for all Card components
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// Main Card component with glassmorphism effect
export const Card: React.FC<CardProps> = ({ children, className, ...props }) => (
  <div
    className={`bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl shadow-lg ${className}`}
    {...props}
  >
    {children}
  </div>
);

// CardHeader component for titles and descriptions
export const CardHeader: React.FC<CardProps> = ({ children, className, ...props }) => (
  <div className={`p-6 border-b border-slate-700/50 ${className}`} {...props}>
    {children}
  </div>
);

// CardTitle component for the main heading within the header
export const CardTitle: React.FC<CardProps> = ({ children, className, ...props }) => (
  <h3 className={`text-lg font-semibold text-slate-100 ${className}`} {...props}>
    {children}
  </h3>
);

// CardDescription component for supplementary text in the header
export const CardDescription: React.FC<CardProps> = ({ children, className, ...props }) => (
  <p className={`text-sm text-slate-400 mt-1 ${className}`} {...props}>
    {children}
  </p>
);

// CardContent component for the main body of the card
export const CardContent: React.FC<CardProps> = ({ children, className, ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

// CardFooter component for actions or closing remarks
export const CardFooter: React.FC<CardProps> = ({ children, className, ...props }) => (
  <div className={`p-6 border-t border-slate-700/50 ${className}`} {...props}>
    {children}
  </div>
);