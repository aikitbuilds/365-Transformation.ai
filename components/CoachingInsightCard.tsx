import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './Card';
import { useTypewriter } from '../hooks/useTypewriter';
import { ZapIcon, BrainCircuitIcon, FileSearchIcon } from './icons/IconComponents';

interface CoachingInsightCardProps {
    insight: any;
    isLoading: boolean;
}

const InsightSection = ({ icon, title, text, color, useTypewriterEffect = false }: { icon: React.ReactNode, title: string, text: string, color: string, useTypewriterEffect?: boolean }) => {
    const displayText = useTypewriterEffect ? useTypewriter(text, 20) : text;
    return (
        <div className="flex items-start gap-4">
            <div className={`mt-1 flex-shrink-0 w-6 h-6 ${color}`}>
                {icon}
            </div>
            <div>
                <h4 className={`font-semibold ${color}`}>{title}</h4>
                <p className="text-slate-400 text-sm">{displayText}<span className="inline-block w-2 h-4 bg-slate-400 animate-pulse ml-1"></span></p>
            </div>
        </div>
    );
};


export const CoachingInsightCard: React.FC<CoachingInsightCardProps> = ({ insight, isLoading }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        if (!isLoading && insight) {
            // Delay flip slightly for a better visual effect
            setTimeout(() => setIsFlipped(true), 100);
        }
        if(isLoading) {
            setIsFlipped(false);
        }
    }, [isLoading, insight]);

    const SkeletonLoader = () => (
        <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-1/3"></div>
            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
            <div className="h-4 bg-slate-700 rounded w-5/6"></div>
        </div>
    );

    return (
        <div className="card-flip-container h-full">
            <div className={`card-flip ${isFlipped ? 'flipped' : ''}`}>
                <div className="card-front">
                     <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><ZapIcon className="w-5 h-5 text-yellow-400" /> AI Coaching Center</CardTitle>
                            <CardDescription>Generating insights from your recent activities...</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SkeletonLoader />
                        </CardContent>
                    </Card>
                </div>
                <div className="card-back">
                    <Card className="h-full">
                         <CardHeader>
                            <CardTitle className="flex items-center gap-2"><ZapIcon className="w-5 h-5 text-yellow-400" /> AI Coaching Center</CardTitle>
                            <CardDescription>A new insight has been generated for you.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {insight ? (
                                <>
                                    <InsightSection 
                                        icon={<FileSearchIcon />} 
                                        title="Pattern Detected"
                                        text={insight.pattern}
                                        color="text-slate-300"
                                    />
                                     <InsightSection 
                                        icon={<ZapIcon />} 
                                        title="Coaching Insight"
                                        text={insight.insight}
                                        color="text-violet-400"
                                        useTypewriterEffect={true}
                                    />
                                     <InsightSection 
                                        icon={<BrainCircuitIcon />} 
                                        title="First Principles Question"
                                        text={insight.first_principles_question}
                                        color="text-amber-400"
                                    />
                                </>
                            ) : (
                                <p>No insights available.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};