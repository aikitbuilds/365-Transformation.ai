import React, { useState } from 'react';
import { Card, CardContent } from './Card';
import { IncomeChart } from './IncomeChart';
import { IncomeData } from '../types';

const mockIncomeData: IncomeData[] = [
    { month: 'Nov', sideBusiness: 200, solarCareer: 0, gigWork: 50 },
    { month: 'Dec', sideBusiness: 400, solarCareer: 0, gigWork: 100 },
    { month: 'Jan', sideBusiness: 550, solarCareer: 0, gigWork: 70 },
    { month: 'Feb', sideBusiness: 700, solarCareer: 3000, gigWork: 120 },
    { month: 'Mar', sideBusiness: 800, solarCareer: 4000, gigWork: 50 },
    { month: 'Apr', sideBusiness: 950, solarCareer: 4200, gigWork: 0 },
];

interface TabButtonProps {
    children: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ children, isActive, onClick }) => (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'bg-violet-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
        {children}
    </button>
)

export const PillarTabs = () => {
    const [activeTab, setActiveTab] = useState('Health');

    const renderContent = () => {
        switch (activeTab) {
            case 'Health':
                return (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                       <div><p className="text-2xl font-bold">4/wk</p><p className="text-xs text-slate-400">Cardio</p></div>
                       <div><p className="text-2xl font-bold">5/wk</p><p className="text-xs text-slate-400">Yoga</p></div>
                       <div><p className="text-2xl font-bold">7.5h</p><p className="text-xs text-slate-400">Avg Sleep</p></div>
                       <div><p className="text-2xl font-bold">150g</p><p className="text-xs text-slate-400">Avg Protein</p></div>
                    </div>
                );
            case 'Wealth':
                 return (
                    <div>
                        <h4 className="font-semibold mb-2 text-slate-200">Income Progress ($9,600 Target)</h4>
                        <IncomeChart data={mockIncomeData} />
                    </div>
                );
            case 'Relationships':
                return (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                       <div><p className="text-2xl font-bold">7/wk</p><p className="text-xs text-slate-400">Family Calls</p></div>
                       <div><p className="text-2xl font-bold">2/wk</p><p className="text-xs text-slate-400">Partner Check-in</p></div>
                       <div><p className="text-2xl font-bold">150</p><p className="text-xs text-slate-400">Solar Contacts</p></div>
                       <div><p className="text-2xl font-bold">3</p><p className="text-xs text-slate-400">Mentorship Hours</p></div>
                    </div>
                );
            default: return null;
        }
    }

    return (
        <Card>
            <CardContent>
                <div className="flex space-x-2 mb-4">
                    <TabButton isActive={activeTab === 'Health'} onClick={() => setActiveTab('Health')}>Health</TabButton>
                    <TabButton isActive={activeTab === 'Wealth'} onClick={() => setActiveTab('Wealth')}>Wealth</TabButton>
                    <TabButton isActive={activeTab === 'Relationships'} onClick={() => setActiveTab('Relationships')}>Relationships</TabButton>
                </div>
                <div>{renderContent()}</div>
            </CardContent>
        </Card>
    )
}