import React, { useState } from 'react';
import { UserProfile, Pillar } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/Card';
import { Stepper } from '../components/Stepper';
import { getOnboardingPlan } from '../services/onboardingAiService';
import { BrainCircuitIcon, ZapIcon } from '../components/icons/IconComponents';

interface OnboardingPageProps {
    onComplete: (profile: UserProfile) => void;
}

const initialPillars: Pillar[] = [
  { name: 'Health', score: 3, target: 10, color: '#10b981' },
  { name: 'Wealth', score: 3, target: 9, color: '#f59e0b' },
  { name: 'Relationships', score: 4, target: 10, color: '#3b82f6' },
];

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [name, setName] = useState("Michael");
    const [mainGoal, setMainGoal] = useState("Launch a successful solar installation business and achieve personal mastery in health and relationships within 12 months.");
    const [pillars, setPillars] = useState<Pillar[]>(initialPillars);
    const [aiPlan, setAiPlan] = useState<any>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const steps = ['Welcome', 'Pillars', 'AI Plan', 'Launch'];

    const handlePillarChange = (index: number, field: 'score' | 'target', value: number) => {
        const newPillars = [...pillars];
        newPillars[index][field] = value;
        setPillars(newPillars);
    };

    const handleGeneratePlan = async () => {
        setIsGenerating(true);
        const plan = await getOnboardingPlan({ name, mainGoal, pillars });
        setAiPlan(plan);
        setIsGenerating(false);
        setStep(step + 1);
    }
    
    const handleComplete = () => {
        const profile: UserProfile = {
            name,
            mainGoal,
            pillars,
            aiStartingPlan: aiPlan,
        };
        onComplete(profile);
    }

    const renderStepContent = () => {
        switch (step) {
            case 0: // Welcome & Goal
                return (
                    <>
                        <CardHeader>
                            <CardTitle>Welcome to Your Transformation OS</CardTitle>
                            <CardDescription>Let's define your 12-month mission.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Your Name</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Your Primary 12-Month Goal</label>
                                <textarea value={mainGoal} onChange={(e) => setMainGoal(e.target.value)} className="w-full h-24 p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                            </div>
                            <button onClick={() => setStep(1)} className="w-full mt-2 px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors">Set Pillar Scores</button>
                        </CardContent>
                    </>
                );
            case 1: // Pillars
                return (
                     <>
                        <CardHeader>
                            <CardTitle>Configure Your Life Pillars</CardTitle>
                            <CardDescription>Rate your current score and set your 12-month target (1-10).</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {pillars.map((pillar, index) => (
                                <div key={pillar.name} className="space-y-2">
                                    <h4 className="font-semibold" style={{ color: pillar.color }}>{pillar.name}</h4>
                                    <div className="flex items-center gap-4">
                                        <label className="text-sm">Current:</label>
                                        <input type="range" min="1" max="10" step="0.5" value={pillar.score} onChange={(e) => handlePillarChange(index, 'score', parseFloat(e.target.value))} className="w-full" />
                                        <span className="font-bold w-10 text-center">{pillar.score}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <label className="text-sm">Target:</label>
                                        <input type="range" min="1" max="10" step="0.5" value={pillar.target} onChange={(e) => handlePillarChange(index, 'target', parseFloat(e.target.value))} className="w-full" />
                                        <span className="font-bold w-10 text-center">{pillar.target}</span>
                                    </div>
                                </div>
                            ))}
                             <button onClick={handleGeneratePlan} disabled={isGenerating} className="w-full mt-2 px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 disabled:bg-slate-600 transition-colors">
                                {isGenerating ? 'Generating...' : 'Generate AI Plan'}
                            </button>
                        </CardContent>
                    </>
                );
            case 2: // AI Plan
                 return (
                     <>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><ZapIcon className="w-5 h-5 text-yellow-400" /> Your AI Starting Plan</CardTitle>
                            <CardDescription>A systematic approach to kickstart your journey.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {aiPlan ? (
                               <div className="text-sm space-y-3">
                                   <h4 className="font-bold text-violet-300 text-base">{aiPlan.title}</h4>
                                   <ul className="list-disc list-inside space-y-2 text-slate-300">
                                       {aiPlan.steps.map((s: string, i: number) => <li key={i}>{s}</li>)}
                                   </ul>
                               </div>
                           ) : <p>Loading...</p>}
                            <button onClick={() => setStep(3)} className="w-full mt-2 px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors">Begin Transformation</button>
                        </CardContent>
                    </>
                 );
            case 3: // Launch
                return (
                     <>
                        <CardHeader className="text-center">
                             <BrainCircuitIcon className="w-16 h-16 mx-auto text-violet-400" />
                            <CardTitle className="mt-4">Setup Complete!</CardTitle>
                            <CardDescription>Your Personal Operating System is calibrated and ready for launch.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <button onClick={handleComplete} className="w-full mt-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">Enter Dashboard</button>
                        </CardContent>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl mx-auto">
                <Stepper steps={steps} currentStep={step} />
                <Card className="mt-6">
                    {renderStepContent()}
                </Card>
            </div>
        </div>
    );
};