import React, { useContext, useState, useEffect } from 'react';
import { ProfileContext } from '../context/ProfileContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { ProgressRing } from '../components/ProgressRing';
import { StreakIndicator } from '../components/StreakIndicator';
import { PillarTabs } from '../components/PillarTabs';
import { DailyRitualChecklist } from '../components/DailyRitualChecklist';
import { CoachingInsightCard } from '../components/CoachingInsightCard';
import { GoalsTracker } from '../components/GoalsTracker';
import { getCoachingInsight } from '../services/geminiService';
import { BookOpenIcon, DumbbellIcon, HeartIcon, ZapIcon } from '../components/icons/IconComponents';
import { Streak, Goal } from '../types';

const mockStreaks: Streak[] = [
    { name: 'Workout', icon: DumbbellIcon, days: 32 },
    { name: 'Reading', icon: BookOpenIcon, days: 12 },
    { name: 'Meditation', icon: HeartIcon, days: 7 },
    { name: 'Journaling', icon: ZapIcon, days: 0 },
];

const mockGoals: Goal[] = [
    {
        id: 'g1',
        title: 'Launch Solar Installation Business',
        description: 'Achieve first paying customer and establish a legal entity.',
        targetDate: '2024-12-31',
        status: 'On Track',
        pillar: 'Wealth',
        keyMetrics: [
            { name: 'Revenue', progress: 500, target: 5000, unit: '$' },
            { name: 'Leads', progress: 15, target: 50, unit: '' },
        ]
    },
    {
        id: 'g2',
        title: 'Complete a 10k Run',
        description: 'Improve cardiovascular health and endurance.',
        targetDate: '2024-09-30',
        status: 'At Risk',
        pillar: 'Health',
        keyMetrics: [
            { name: 'Longest Run', progress: 4, target: 10, unit: 'km' },
            { name: 'Weekly Runs', progress: 2, target: 4, unit: 'sessions' },
        ]
    },
    {
        id: 'g3',
        title: 'Build 5 Key Professional Relationships',
        description: 'Network with mentors and peers in the solar industry.',
        targetDate: '2024-11-15',
        status: 'Achieved',
        pillar: 'Relationships',
        keyMetrics: [
            { name: 'Contacts Met', progress: 5, target: 5, unit: '' },
        ]
    },
];

const DashboardPage: React.FC = () => {
    const profileCtx = useContext(ProfileContext);
    const [coachingInsight, setCoachingInsight] = useState<any>(null);
    const [isLoadingInsight, setIsLoadingInsight] = useState(true);

    useEffect(() => {
        const fetchInsight = async () => {
            setIsLoadingInsight(true);
            // In a real app, you would pass real journal entries.
            const recentEntries = "Journal entry from Tuesday: struggling with solar study motivation. Another entry: felt low energy during my solar studies again.";
            const insight = await getCoachingInsight(recentEntries);
            setCoachingInsight(insight);
            setIsLoadingInsight(false);
        };

        fetchInsight();
    }, []);

    if (!profileCtx?.profile) {
        return <div className="p-8 text-center">Loading profile...</div>;
    }

    const { name, mainGoal, pillars } = profileCtx.profile;

    return (
        <div className="p-4 md:p-8 space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-white">Welcome, {name}</h1>
                <p className="text-slate-400 max-w-3xl">{mainGoal}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {pillars.map(pillar => (
                    <Card key={pillar.name} className="flex items-center justify-center">
                        <ProgressRing
                            radius={80}
                            stroke={12}
                            progress={pillar.score}
                            target={pillar.target}
                            color={pillar.color}
                            label={pillar.name}
                        />
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <CoachingInsightCard insight={coachingInsight} isLoading={isLoadingInsight} />
                </div>
                <div className="grid grid-rows-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Streak Tracker</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-around items-center h-full">
                            {mockStreaks.map(streak => <StreakIndicator key={streak.name} streak={streak} />)}
                        </CardContent>
                    </Card>
                    <DailyRitualChecklist />
                </div>
            </div>
            
            <PillarTabs />

            <GoalsTracker goals={mockGoals} />
        </div>
    );
};

export default DashboardPage;