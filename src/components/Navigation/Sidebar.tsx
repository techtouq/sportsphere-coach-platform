import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  LayoutDashboard,
  Trophy,
  Dumbbell,
  BarChart3,
  Video,
  Users2,
  Radar,
  Newspaper,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import { TabView } from '../../types/sports';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: TabView;
  onSelectTab: (tab: TabView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentTab,
  onSelectTab,
}) => {
  const menuItems = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard, count: '' },
    { key: 'tournaments', label: 'Tournaments', icon: Trophy, count: '28' },
    { key: 'radar', label: 'Performance Radar', icon: Radar, count: '6' },
    { key: 'training', label: 'Training Workspace', icon: Dumbbell, count: 'Today' },
    { key: 'rankings', label: 'Rankings & Leaderboards', icon: BarChart3, count: 'Top 50' },
    { key: 'highlights', label: 'Highlights & News', icon: Video, count: '4K' },
    { key: 'network', label: 'Scouting & Network', icon: Users2, count: '1.4k' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative w-[84%] max-w-[320px] bg-white h-full shadow-2xl z-10 flex flex-col pt-safe pb-safe border-r border-slate-200"
          >
            {/* Drawer Header */}
            <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0037B0] to-[#1D4ED8] flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
                  <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-sm tracking-tight">S</span>
                </div>
                <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-base tracking-tight text-[#131B2E]">
                  SportSphere
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Coach Profile Card */}
            <div className="p-3 mx-3 my-3 bg-[#F2F3FF] rounded-xl flex items-center gap-3 border border-blue-100">
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-full bg-[#0037B0] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  MV
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-['Plus_Jakarta_Sans'] font-bold text-xs text-slate-900 truncate">
                    Coach Marcus Vance
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-600 shrink-0" />
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider">
                  High Performance Lead
                </span>
                <span className="text-[10px] text-slate-500 truncate">
                  Metro High Performance Academy
                </span>
              </div>
            </div>

            {/* Navigation links */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
              <p className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Coach Intelligence
              </p>

              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      onSelectTab(item.key as TabView);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#1D4ED8] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.count && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold tabular-nums ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-200/70 text-slate-600'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Status Footer */}
            <div className="p-3 border-t border-slate-100 bg-slate-50/70 text-[11px] text-slate-500 flex items-center justify-between">
              <span className="font-medium">v2.4 Coach Build</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Synced
              </span>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
