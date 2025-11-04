import React, { useState, useEffect } from 'react';
import { ProgressRing } from './components/ProgressRing';
import { IncomeChart } from './components/IncomeChart';
import { PillarTabs } from './components/PillarTabs';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './components/Card';
import { FlameIcon, CheckCircleIcon, TargetIcon, BrainCircuitIcon, ZapIcon, BookIcon, RepeatIcon } from './components/icons/IconComponents';
import { getAiInsights } from './services/geminiService';
import { IncomeData, LifeAssessment, Ritual, Streak, GogginsChallenge, Cookie, ScheduleEvent } from './types';

// MOCK DATA
const pillarProgress = { health: { score: 7, target: 10 }, wealth: { score: 5, target: 9 }, relationships: { score: 6, target: 10 } };
const incomeData: IncomeData[] = [
    { month: 'Nov \'25', sideBusiness: 300, solarCareer: 0, gigWork: 100 }, { month: 'Dec \'25', sideBusiness: 450, solarCareer: 0, gigWork: 150 },
    { month: 'Jan \'26', sideBusiness: 600, solarCareer: 0, gigWork: 100 }, { month: 'Feb \'26', sideBusiness: 550, solarCareer: 0, gigWork: 200 },
    { month: 'Mar \'26', sideBusiness: 700, solarCareer: 2000, gigWork: 50 }, { month: 'Apr \'26', sideBusiness: 750, solarCareer: 4200, gigWork: 0 },
];
const lifeAssessments: LifeAssessment = { physical_health: 8, mental_health: 7, spiritual_health: 6, financial_security: 4, wealth_building: 5, financial_mindset: 6, personal_relationships: 7, professional_relationships: 5, social_impact: 4 };
const initialRituals: Ritual[] = [
    { id: '1', name: '5:30am Wake-up', time: '05:30', completed: true, category: 'morning' }, { id: '2', name: 'Meditation', time: '05:40', completed: true, category: 'morning' },
    { id: '3', name: 'Yoga', time: '05:55', completed: false, category: 'morning' }, { id: '4', name: 'Nutrition Log', time: '06:25', completed: true, category: 'morning' },
    { id: '5', name: 'Solar Micro-learning', time: '06:40', completed: false, category: 'morning' }, { id: '6', name: 'Financial Tracking', time: '20:00', completed: false, category: 'evening' },
    { id: '7', name: 'Kin Journaling', time: '20:30', completed: false, category: 'evening' }, { id: '8', name: 'First Principles', time: '20:45', completed: false, category: 'evening' },
];
const streaks: Streak[] = [{ id: '1', name: '5:30am Wake', count: 12 }, { id: '2', name: 'Meditation', count: 12 }, { id: '3', name: 'Journaling', count: 25 }];
const gogginsChallenge: GogginsChallenge = { week: 4, description: "Study 2 hours after class every day.", completed: false };
const cookieJar: Cookie[] = [{ id: '1', description: "HCC Application Sent", date: "Nov 1, 2025" }, { id: '2', description: "First Lion's Mane Harvest", date: "Nov 10, 2025" }, { id: '3', description: "WIOA Application Approved", date: "Nov 15, 2025" }];
const schedule: ScheduleEvent[] = [
    { day: 'Mon', time: '07:00-16:00', title: 'HCC Training', category: 'Solar Career' }, { day: 'Tue', time: '16:30-17:30', title: 'Cardio', category: 'Health' },
    { day: 'Wed', time: '19:00-21:00', title: 'Side Business', category: 'Wealth' }, { day: 'Thu', time: '18:00-19:00', title: 'Networking', category: 'Relationships' },
    { day: 'Fri', time: '07:00-16:00', title: 'HCC Training', category: 'Solar Career' }
];
const weeklySummary = { "Hours Studied": 12.5, "eBay Revenue": "$680", "Meditation Streak": "7/7", "WIOA Progress": "Approved" };

const App: React.FC = () => {
    const [rituals, setRituals] = useState<Ritual[]>(initialRituals);
    const [aiInsights, setAiInsights] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchInsights = async () => {
            setIsLoading(true);
            const insights = await getAiInsights("Sample journal entry about struggling with solar study time.");
            setAiInsights(insights);
            setIsLoading(false);
        };
        fetchInsights();
    }, []);

    const toggleRitual = (id: string) => {
        setRituals(rituals.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
    };

    const PillarRing: React.FC<{ pillar: 'health' | 'wealth' | 'relationships' }> = ({ pillar }) => {
        const colors = { health: '#10b981', wealth: '#f59e0b', relationships: '#3b82f6' };
        const data = pillarProgress[pillar];
        return <ProgressRing radius={100} stroke={12} progress={(data.score / data.target) * 100} color={colors[pillar]} label={pillar.charAt(0).toUpperCase() + pillar.slice(1)} score={data.score} target={data.target} isLarge={true}/>;
    };
    
    const LifeAssessmentCircles: React.FC = () => (
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-9 gap-4">
            {Object.entries(lifeAssessments).map(([key, value]) => {
                const colors = key.includes('health') ? '#10b981' : key.includes('financ') || key.includes('wealth') ? '#f59e0b' : '#3b82f6';
                return <ProgressRing key={key} radius={45} stroke={5} progress={value * 10} color={colors} label={key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} score={value} target={10}/>
            })}
        </div>
    );
    
    const RitualChecklist: React.FC<{ category: 'morning' | 'evening' }> = ({ category }) => (
        <div>
            <h4 className="text-lg font-semibold text-slate-200 capitalize mb-3">{category} Ritual</h4>
            <div className="space-y-3">
                {rituals.filter(r => r.category === category).map(ritual => (
                    <div key={ritual.id} onClick={() => toggleRitual(ritual.id)} className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${ritual.completed ? 'bg-purple-500/20 border-purple-500' : 'bg-slate-800 border-slate-700'} border`}>
                        <div className={`w-5 h-5 rounded-full border-2 ${ritual.completed ? 'bg-purple-500 border-purple-400' : 'border-slate-500'} flex items-center justify-center mr-3`}>
                            {ritual.completed && <CheckCircleIcon className="w-4 h-4 text-white"/>}
                        </div>
                        <div className="flex-grow">
                            <p className="font-medium text-slate-100">{ritual.name}</p>
                            <p className="text-xs text-slate-400">{ritual.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
    
    const InsightCard: React.FC<{icon: React.ReactNode, title: string, content: string | null}> = ({icon, title, content}) => (
        <Card className="bg-slate-800/80">
            <CardHeader className="flex flex-row items-center space-x-3 pb-2">
                <div className="text-purple-400">{icon}</div>
                <CardTitle className="text-md text-purple-300">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? <div className="h-10 bg-slate-700 rounded animate-pulse"></div> : <p className="text-slate-300">{content}</p>}
            </CardContent>
        </Card>
    );

    return (
        <div className="min-h-screen bg-slate-900 text-slate-300 p-4 sm:p-6 lg:p-8">
            <div className="max-w-screen-2xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-extrabold text-white">Michael's Personal OS</h1>
                        <p className="text-slate-400">Transformation Journey: Nov 5, 2025 - Nov 5, 2026</p>
                    </div>
                    <div className="flex items-center space-x-4 bg-slate-800/50 border border-slate-700 rounded-full px-4 py-2">
                        <div className="relative flex items-center justify-center">
                            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </div>
                        <span className="text-sm font-medium text-green-400">Status: Online & Operational</span>
                    </div>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area (2 columns) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Section 1: Transformation Overview */}
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>Transformation Overview</CardTitle>
                                <CardDescription>Real-time progress towards your 12-month goals.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="flex flex-col md:flex-row justify-around items-center gap-8">
                                    <PillarRing pillar="health" />
                                    <PillarRing pillar="wealth" />
                                    <PillarRing pillar="relationships" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-200 mb-2">Transformation Timeline: Week 4/52</h4>
                                    <div className="w-full bg-slate-700 rounded-full h-4">
                                        <div className="bg-purple-600 h-4 rounded-full" style={{ width: `${(4/52)*100}%` }}></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-slate-200">Income Projection (Target: $9,600/mo)</h4>
                                    <IncomeChart data={incomeData} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-200 mb-2">45-Point Life Assessment</h4>
                                    <LifeAssessmentCircles />
                                </div>
                            </CardContent>
                        </Card>
                        
                        {/* Section 3: AI Insights */}
                         <Card>
                            <CardHeader>
                                <CardTitle>AI Insights & Coaching</CardTitle>
                                <CardDescription>Your AI mentor's analysis of today's journal entry.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <InsightCard icon={<BrainCircuitIcon/>} title="Pattern Recognition" content={aiInsights?.pattern} />
                               <InsightCard icon={<ZapIcon/>} title="Coaching Prompt" content={aiInsights?.coaching} />
                               <InsightCard icon={<RepeatIcon/>} title="Redundancy Alert" content={aiInsights?.redundancy} />
                               <InsightCard icon={<ZapIcon/>} title="Energy Optimization" content={aiInsights?.optimization} />
                               <InsightCard icon={<BookIcon/>} title="First Principles Question" content={aiInsights?.firstPrinciples} />
                                <Card className="bg-slate-800/80">
                                    <CardHeader className="flex flex-row items-center space-x-3 pb-2"><CardTitle className="text-md">This Week in Numbers</CardTitle></CardHeader>
                                    <CardContent>
                                        <ul className="text-sm text-slate-300 space-y-1">
                                            {Object.entries(weeklySummary).map(([key, value]) => (
                                                <li key={key} className="flex justify-between"><span>{key}:</span> <span className="font-bold text-white">{value}</span></li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Sidebar (1 column) */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Section 2: Today's OS */}
                        <Card>
                             <CardHeader>
                                <CardTitle>Today's Operating System</CardTitle>
                                <CardDescription>Execute your daily rituals for guaranteed progress.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex justify-around text-center">
                                    {streaks.map(streak => (
                                        <div key={streak.id} className="flex flex-col items-center">
                                            <FlameIcon className={`w-8 h-8 ${streak.count > 10 ? 'text-amber-400' : 'text-slate-500'}`} />
                                            <span className="text-xl font-bold text-white">{streak.count}</span>
                                            <span className="text-xs text-slate-400">{streak.name}</span>
                                        </div>
                                    ))}
                                </div>
                                <RitualChecklist category="morning" />
                                <RitualChecklist category="evening" />
                                {/* ... Daily Score Submission */}
                            </CardContent>
                        </Card>
                        {/* Section 4: Goggins Tracker */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Goggins Mental Toughness</CardTitle>
                                <CardDescription>Stay hard.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-black p-4 rounded-lg border border-red-500/50 text-center">
                                    <p className="text-slate-400 text-sm">ACCOUNTABILITY MIRROR</p>
                                    <p className="font-bold text-white text-lg">"Today I will conquer my solar studies. No excuses."</p>
                                </div>
                                <div className="border border-slate-700 p-3 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-slate-400">Challenge of the Week</p>
                                            <p className="font-semibold text-slate-100">{gogginsChallenge.description}</p>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${gogginsChallenge.completed ? 'bg-green-500' : 'border-2 border-slate-500'}`}>
                                            {gogginsChallenge.completed && <CheckCircleIcon className="w-5 h-5 text-white" />}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-200 mb-2">Cookie Jar</h4>
                                    <div className="space-y-2">
                                    {cookieJar.map(cookie => (
                                        <div key={cookie.id} className="bg-slate-800 p-2 rounded-md flex items-center text-sm">
                                            <TargetIcon className="w-4 h-4 mr-2 text-amber-400" />
                                            <span className="text-slate-300">{cookie.description}</span>
                                        </div>
                                    ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
                
                {/* Full-width sections */}
                <div className="space-y-8">
                    {/* Section 5: Pillar Deep Dives */}
                    <PillarTabs />
                    {/* Section 6: Weekly Execution */}
                     <Card>
                        <CardHeader>
                            <CardTitle>Week-by-Week Execution</CardTitle>
                            <CardDescription>Structured activities for the current week.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {schedule.map(item => {
                                    const colors = { 'Health': 'bg-green-500/10 text-green-400 border-green-500/30', 'Wealth': 'bg-amber-500/10 text-amber-400 border-amber-500/30', 'Relationships': 'bg-blue-500/10 text-blue-400 border-blue-500/30', 'Solar Career': 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
                                    return (
                                        <div key={item.day + item.title} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                            <p className="font-bold text-white">{item.day}</p>
                                            <p className="text-sm text-slate-400">{item.time}</p>
                                            <div className={`mt-2 text-xs font-semibold px-2 py-1 rounded-full inline-block ${colors[item.category]}`}>{item.title}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default App;
