import React from 'react';
import { Menu, Search, Bell, ShieldCheck } from 'lucide-react';
import { TabView } from '../../types/sports';

interface NavbarProps {
  currentTab: TabView;
  onTabChange: (tab: TabView) => void;
  onOpenSidebar: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unreadCount?: number;
  userRole: 'Ath' | 'Org' | 'Coach';
  onRoleChange: (role: 'Ath' | 'Org' | 'Coach') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onOpenSidebar,
  onOpenSearch,
  onOpenNotifications,
  unreadCount = 2,
  userRole,
  onRoleChange,
}) => {
  const navItems: { key: TabView; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'tournaments', label: 'Tournaments' },
    { key: 'radar', label: 'Radar' },
    { key: 'training', label: 'Training' },
    { key: 'rankings', label: 'Rankings' },
    { key: 'highlights', label: 'Highlights' },
    { key: 'network', label: 'Network' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#FAF8FF]/95 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_8px_rgba(0,0,0,0.03)] pt-safe">
      <div className="h-16 px-4 md:px-6 flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Zone 1: Menu toggle + Brand Wordmark */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSidebar}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100/80 transition-colors cursor-pointer"
            aria-label="Toggle navigation drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => onTabChange('overview')}
            className="flex items-center gap-2 text-left group"
          >
            {/* SportSphere Emblem */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0037B0] to-[#1D4ED8] flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-sm tracking-tight">S</span>
            </div>
            <div className="flex flex-col">
              <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-base tracking-tight text-[#131B2E]">
                SportSphere
              </span>
              <span className="hidden sm:inline text-[10px] font-bold text-blue-700 uppercase tracking-widest leading-none">
                Coach Platform
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Desktop 1440px / Large Screen) */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#EAEDFF]/70 p-1 rounded-full border border-slate-200/50">
          {navItems.map((item) => {
            const isActive = currentTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onTabChange(item.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-[#1D4ED8] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Role Switcher & Action Affordances */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Role Segmented Pill */}
          <div className="flex items-center bg-[#E2E7FF] p-0.5 rounded-full border border-blue-200/40">
            {(['Ath', 'Org', 'Coach'] as const).map((role) => (
              <button
                key={role}
                onClick={() => onRoleChange(role)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-['Plus_Jakarta_Sans'] font-bold transition-all ${
                  userRole === role
                    ? 'bg-[#1D4ED8] text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Universal Search Button */}
          <button
            onClick={onOpenSearch}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Search (athletes, tournaments, tactics)"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={onOpenNotifications}
            className="relative w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Coach Marcus Vance Avatar with status dot */}
          <button
            onClick={() => onTabChange('radar')}
            className="relative shrink-0 ml-1 group focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-full"
            title="Coach Marcus Vance profile"
          >
            <div className="w-8 h-8 rounded-full bg-[#0037B0] text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-blue-100 group-hover:ring-blue-300 transition-all">
              MV
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </button>
        </div>
      </div>
    </header>
  );
};
