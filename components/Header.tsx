import React from 'react';
import { UserStats } from '../types';
import { Zap, LayoutDashboard, BarChart2, Calendar } from 'lucide-react';

interface HeaderProps {
  stats: UserStats;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ stats, activeTab, setActiveTab }) => {
  const pointsPerLevel = 500;
  const progress = (stats.totalPoints % pointsPerLevel) / pointsPerLevel * 100;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="bg-gradient-to-tr from-accent-600 to-purple-600 p-2 rounded-lg shadow-lg shadow-accent-500/20">
              <Zap className="text-white w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white tracking-tight leading-none">ProductivAI</h1>
            </div>
          </div>

          {/* Navigation Tabs (Center) */}
          <nav className="flex items-center bg-slate-900/50 p-1 rounded-xl border border-slate-800/50">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-slate-800 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Stats (Right) */}
          <div className="flex items-center gap-4">
             {/* Level Bar */}
            <div className="hidden md:flex flex-col w-32">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">
                <span>Lvl {stats.level}</span>
                <span>{stats.totalPoints} XP</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-accent-500 to-purple-500 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            
            {/* Streak Badge */}
            <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full text-orange-400">
              <span className="text-lg font-bold leading-none">{stats.currentStreak}</span>
              <span className="text-[10px] uppercase font-bold tracking-wide">Day Streak</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;