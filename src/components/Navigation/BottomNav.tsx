import React from 'react';
import { LayoutDashboard, Trophy, Dumbbell, Radar, Users2 } from 'lucide-react';
import { TabView } from '../../types/sports';

interface BottomNavProps {
  currentTab: TabView;
  onTabChange: (tab: TabView) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const tabs: { key: TabView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'tournaments', label: 'Tournaments', icon: Trophy },
    { key: 'radar', label: 'Radar', icon: Radar },
    { key: 'training', label: 'Training', icon: Dumbbell },
    { key: 'network', label: 'Athletes', icon: Users2 },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-2px_12px_rgba(19,27,46,0.06)] pb-safe">
      <div className="h-16 px-2 flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex flex-col items-center justify-center w-14 h-14 relative transition-colors cursor-pointer ${
                isActive ? 'text-[#1D4ED8]' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className={`text-[10px] font-['Plus_Jakarta_Sans'] mt-1 leading-none ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-6 h-0.5 rounded-full bg-[#1D4ED8]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
