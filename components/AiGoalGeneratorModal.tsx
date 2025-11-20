
import React, { useState, useContext } from 'react';
import { ProfileContext } from '../context/ProfileContext';
import { Goal } from '../types';
import { generateSmartGoals } from '../services/geminiService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './Card';
import { ZapIcon, XIcon, CheckCircleIcon, TargetIcon } from './icons/IconComponents';

interface AiGoalGeneratorModalProps {
    onClose: () => void;
    onAddGoals: (goals: Goal[]) => void;
    currentGoals: Goal[];
}

export const AiGoalGeneratorModal: React.FC<AiGoalGeneratorModalProps> = ({ onClose, onAddGoals, currentGoals }) => {
    const profileCtx = useContext(ProfileContext);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedGoals, setGeneratedGoals] = useState<Goal[]>([]);
    const [selectedGoalIds, setSelectedGoalIds] = useState<Set<string>>(new Set());

    const handleGenerate = async () => {
        if (!profileCtx?.profile) return;
        
        setIsGenerating(true);
        const goals = await generateSmartGoals(profileCtx.profile, currentGoals);
        setGeneratedGoals(goals);
        // Auto-select all by default
        setSelectedGoalIds(new Set(goals.map(g => g.id)));
        setIsGenerating(false);
    };

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedGoalIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedGoalIds(newSet);
    };

    const handleConfirm = () => {
        const goalsToAdd = generatedGoals.filter(g => selectedGoalIds.has(g.id));
        onAddGoals(goalsToAdd);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <Card className="border-violet-500/30">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-violet-200">
                                <ZapIcon className="w-5 h-5 text-violet-400" />
                                AI Goal Coach
                            </CardTitle>
                            <CardDescription>
                                Analyzing {currentGoals.length} active goals and your profile to suggest next steps.
                            </CardDescription>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-white">
                            <XIcon className="w-6 h-6" />
                        </button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {generatedGoals.length === 0 && !isGenerating && (
                            <div className="text-center py-8">
                                <TargetIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-400 mb-6">Ready to find your next breakthrough?</p>
                                <button 
                                    onClick={handleGenerate}
                                    className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                                >
                                    Generate Suggested Goals
                                </button>
                            </div>
                        )}

                        {isGenerating && (
                            <div className="text-center py-12 space-y-4">
                                <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                <p className="text-violet-300 animate-pulse">Analyzing pillar gaps and progress trends...</p>
                            </div>
                        )}

                        {generatedGoals.length > 0 && (
                            <div className="space-y-4">
                                <p className="text-sm text-slate-400">Based on your progress, we suggest these next steps:</p>
                                <div className="space-y-3">
                                    {generatedGoals.map(goal => (
                                        <div 
                                            key={goal.id} 
                                            onClick={() => toggleSelection(goal.id)}
                                            className={`p-4 rounded-lg border cursor-pointer transition-all ${
                                                selectedGoalIds.has(goal.id) 
                                                ? 'bg-violet-900/20 border-violet-500/50' 
                                                : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center ${
                                                    selectedGoalIds.has(goal.id) 
                                                    ? 'bg-violet-500 border-violet-500' 
                                                    : 'border-slate-500'
                                                }`}>
                                                    {selectedGoalIds.has(goal.id) && <CheckCircleIcon className="w-4 h-4 text-white" />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between">
                                                        <h4 className="font-semibold text-slate-200">{goal.title}</h4>
                                                        <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300">{goal.pillar}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-400 mt-1">{goal.description}</p>
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {goal.keyMetrics.map((m, i) => (
                                                            <span key={i} className="text-xs bg-slate-900/50 text-slate-500 px-2 py-1 rounded border border-slate-700">
                                                                {m.name}: Target {m.target} {m.unit}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                                    <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                                    <button 
                                        onClick={handleConfirm}
                                        disabled={selectedGoalIds.size === 0}
                                        className="px-6 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                                    >
                                        Add {selectedGoalIds.size} Goal{selectedGoalIds.size !== 1 ? 's' : ''}
                                    </button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
