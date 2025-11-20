import React, { useContext, useState, useEffect } from 'react';
import { ProfileContext } from '../context/ProfileContext';
import { UserProfile, Pillar } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/Card';
import { getOnboardingPlan } from '../services/onboardingAiService';
import { ZapIcon } from '../components/icons/IconComponents';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
    const profileCtx = useContext(ProfileContext);
    const { signOut } = useAuth();
    const [profileData, setProfileData] = useState<UserProfile | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    
    useEffect(() => {
        if(profileCtx?.profile) {
            setProfileData(JSON.parse(JSON.stringify(profileCtx.profile)));
        }
    }, [profileCtx?.profile]);

    if (!profileCtx || !profileData) {
        return <div className="p-8 text-center">Loading profile...</div>;
    }
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handlePillarChange = (index: number, field: 'score' | 'target', value: number) => {
        if (!profileData) return;
        const newPillars = [...profileData.pillars];
        newPillars[index][field] = value;
        setProfileData({ ...profileData, pillars: newPillars });
    };

    const handleSave = () => {
        if (profileData) {
            profileCtx.saveProfile(profileData);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        }
    };
    
    const handleRegeneratePlan = async () => {
        if (!profileData) return;
        setIsGenerating(true);
        const plan = await getOnboardingPlan(profileData);
        setProfileData(prev => prev ? { ...prev, aiStartingPlan: plan } : null);
        setIsGenerating(false);
    }

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-white">Your Profile</h1>
                <p className="text-slate-400">Update your goals and recalibrate your journey.</p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>This information personalizes your dashboard and AI feedback.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Your Name</label>
                            <input type="text" name="name" value={profileData.name} onChange={handleInputChange} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Your Primary 12-Month Goal</label>
                            <textarea name="mainGoal" value={profileData.mainGoal} onChange={handleInputChange} className="w-full h-24 p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <h4 className="font-semibold text-slate-200">Life Pillars</h4>
                        {profileData.pillars.map((pillar, index) => (
                            <div key={pillar.name} className="space-y-2">
                                <h5 className="font-semibold" style={{ color: pillar.color }}>{pillar.name}</h5>
                                <div className="flex items-center gap-4">
                                    <label className="text-sm w-16">Current:</label>
                                    <input type="range" min="1" max="10" step="0.5" value={pillar.score} onChange={(e) => handlePillarChange(index, 'score', parseFloat(e.target.value))} className="w-full" />
                                    <span className="font-bold w-10 text-center">{pillar.score}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <label className="text-sm w-16">Target:</label>
                                    <input type="range" min="1" max="10" step="0.5" value={pillar.target} onChange={(e) => handlePillarChange(index, 'target', parseFloat(e.target.value))} className="w-full" />
                                    <span className="font-bold w-10 text-center">{pillar.target}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <button onClick={handleSave} className="px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors">
                            Save Profile
                        </button>
                        <button onClick={signOut} className="ml-4 px-4 py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors">
                            Sign Out
                        </button>
                         {showSuccess && <span className="ml-4 text-green-400 text-sm">Profile saved successfully!</span>}
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ZapIcon className="w-5 h-5 text-yellow-400" /> AI Starting Plan</CardTitle>
                    <CardDescription>Regenerate your initial action plan based on your current profile settings.</CardDescription>
                </CardHeader>
                <CardContent>
                    {profileData.aiStartingPlan ? (
                       <div className="text-sm space-y-3">
                           <h4 className="font-bold text-violet-300 text-base">{profileData.aiStartingPlan.title}</h4>
                           <ul className="list-disc list-inside space-y-2 text-slate-300">
                               {profileData.aiStartingPlan.steps.map((s: string, i: number) => <li key={i}>{s}</li>)}
                           </ul>
                       </div>
                   ) : <p>No plan generated yet.</p>}
                   <button onClick={handleRegeneratePlan} disabled={isGenerating} className="mt-4 px-4 py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 disabled:bg-slate-800 transition-colors">
                        {isGenerating ? 'Generating...' : 'Regenerate AI Plan'}
                    </button>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfilePage;