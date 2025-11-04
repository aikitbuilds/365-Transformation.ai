import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const pillarData = {
    health: {
        metrics: [
            { name: "Cardio", value: "8 mi/wk" },
            { name: "Yoga", value: "5 sessions/wk" },
            { name: "Sleep", value: "7.5 hr avg" },
            { name: "Nutrition", value: "150g protein avg" },
        ],
        chartData: Array.from({ length: 12 }, (_, i) => ({ week: i + 1, score: 3 + (i * 0.5) + Math.random() * 1.5 })),
        recommendation: "Increase meditation duration to 20 minutes to improve focus score."
    },
    wealth: {
        metrics: [
            { name: "Emergency Fund", value: "$500 / $2k" },
            { name: "Side Revenue", value: "$680/mo" },
            { name: "Solar Income", value: "$0 (projected)" },
            { name: "Savings Rate", value: "15%" },
        ],
        chartData: Array.from({ length: 12 }, (_, i) => ({ week: i + 1, score: 3 + (i * 0.45) + Math.random() })),
        recommendation: "Your chaeto revenue is trending 20% below projection. Let's analyze the eBay listings."
    },
    relationships: {
        metrics: [
            { name: "Family Connects", value: "7/7 days" },
            { name: "Accountability", value: "2 check-ins" },
            { name: "LinkedIn", value: "85 / 500" },
            { name: "Interviews", value: "1 informational" },
        ],
        chartData: Array.from({ length: 12 }, (_, i) => ({ week: i + 1, score: 4 + (i * 0.4) + Math.random() * 1.2 })),
        recommendation: "You've had 3 great conversations with solar team members. Suggest scheduling coffee meeting #4."
    }
}

type Pillar = 'health' | 'wealth' | 'relationships';

const pillarColors = {
    health: { text: 'text-green-400', border: 'border-green-400', accent: '#10b981' },
    wealth: { text: 'text-amber-400', border: 'border-amber-400', accent: '#f59e0b' },
    relationships: { text: 'text-blue-400', border: 'border-blue-400', accent: '#3b82f6' },
};

export const PillarTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Pillar>('health');

  const renderContent = () => {
    const data = pillarData[activeTab];
    const colors = pillarColors[activeTab];

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <div className="md:col-span-1 space-y-4">
            {data.metrics.map(metric => (
                <div key={metric.name} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <p className="text-sm text-slate-400">{metric.name}</p>
                    <p className={`text-2xl font-bold ${colors.text}`}>{metric.value}</p>
                </div>
            ))}
        </div>
        <div className="md:col-span-2">
            <div className="h-64 w-full">
                <ResponsiveContainer>
                    <LineChart data={data.chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="week" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]}/>
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', borderColor: '#334155' }}/>
                        <Legend wrapperStyle={{fontSize: '12px'}} />
                        <Line type="monotone" dataKey="score" name={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Score`} stroke={colors.accent} strokeWidth={2} dot={{r: 2}} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <p className="text-sm font-semibold text-slate-300">Recommended Action:</p>
                <p className="text-slate-400">{data.recommendation}</p>
            </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full">
        <CardHeader>
            <CardTitle>Pillar Deep Dives</CardTitle>
            <CardDescription>Explore detailed metrics and trends for each area of your transformation.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="border-b border-slate-700">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {(Object.keys(pillarColors) as Pillar[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`${
                                activeTab === tab
                                ? `${pillarColors[tab].border} ${pillarColors[tab].text}`
                                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors duration-200`}
                        >
                        {tab}
                        </button>
                    ))}
                </nav>
            </div>
            {renderContent()}
        </CardContent>
    </Card>
  );
};
