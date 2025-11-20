import React, { useState, useContext } from 'react';
import { ProfileContext } from './context/ProfileContext';
import { AuthContext } from './context/AuthContext';
import { OnboardingPage } from './pages/OnboardingPage';
import { LoginPage } from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProjectDashboardPage from './pages/ProjectDashboardPage';
import ProfilePage from './pages/ProfilePage';
import { BookOpenIcon, LayersIcon, UserCircleIcon } from './components/icons/IconComponents';

type View = 'TRANSFORMATION' | 'PROJECT' | 'PROFILE';

const NavButton: React.FC<{
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ isActive, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all duration-200 ${
      isActive
        ? 'bg-slate-700/80 text-white shadow-md'
        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
    }`}
  >
    {children}
  </button>
);

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('TRANSFORMATION');
  const profileCtx = useContext(ProfileContext);
  const authCtx = useContext(AuthContext);

  if (authCtx?.loading || profileCtx?.isLoading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><p className="text-lg text-slate-400 animate-pulse">Loading Transformation OS...</p></div>;
  }

  if (!authCtx?.user) {
    return <LoginPage />;
  }

  if (!profileCtx?.onboardingComplete) {
    return <OnboardingPage onComplete={profileCtx.saveProfile} />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'TRANSFORMATION':
        return <DashboardPage />;
      case 'PROJECT':
        return <ProjectDashboardPage />;
      case 'PROFILE':
        return <ProfilePage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      <main className="max-w-screen-2xl mx-auto">
        <nav className="p-4 flex justify-center items-center">
          <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-700/50 rounded-xl p-2 flex items-center space-x-2">
            <NavButton isActive={activeView === 'TRANSFORMATION'} onClick={() => setActiveView('TRANSFORMATION')}>
              <BookOpenIcon className="w-4 h-4" />
              Transformation OS
            </NavButton>
            <NavButton isActive={activeView === 'PROJECT'} onClick={() => setActiveView('PROJECT')}>
              <LayersIcon className="w-4 h-4" />
              Project OS
            </NavButton>
            <NavButton isActive={activeView === 'PROFILE'} onClick={() => setActiveView('PROFILE')}>
              <UserCircleIcon className="w-4 h-4" />
              Profile
            </NavButton>
          </div>
        </nav>
        {renderView()}
      </main>
    </div>
  );
};

export default App;
