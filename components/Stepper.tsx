import React from 'react';

interface StepperProps {
    steps: string[];
    currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
    return (
        <div className="flex items-center justify-center space-x-4">
            {steps.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;

                return (
                    <React.Fragment key={step}>
                        <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${
                                isActive ? 'bg-violet-600 text-white' : isCompleted ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-400'
                            }`}>
                                {isCompleted ? '✓' : index + 1}
                            </div>
                            <p className={`mt-2 text-xs font-medium ${isActive || isCompleted ? 'text-slate-200' : 'text-slate-500'}`}>{step}</p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`flex-1 h-1 rounded-full ${isCompleted ? 'bg-green-600' : 'bg-slate-700'}`}></div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};