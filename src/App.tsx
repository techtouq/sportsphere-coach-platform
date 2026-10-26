/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navigation/Navbar';
import { Sidebar } from './components/Navigation/Sidebar';
import { BottomNav } from './components/Navigation/BottomNav';
import { OverviewView } from './components/Overview/OverviewView';
import { TournamentsView } from './components/Tournaments/TournamentsView';
import { RadarView } from './components/Radar/RadarView';
import { TrainingView } from './components/Training/TrainingView';
import { RankingsView } from './components/Rankings/RankingsView';
import { HighlightsView } from './components/Highlights/HighlightsView';
import { NetworkView } from './components/Network/NetworkView';
import { VideoModal } from './components/Common/VideoModal';
import { SearchModal } from './components/Common/SearchModal';
import { NotificationsDrawer } from './components/Common/NotificationsDrawer';
import { ToastContainer, ToastMessage } from './components/Common/Toast';
import { HighlightReel, TabView } from './types/sports';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabView>('overview');
  const [selectedTargetId, setSelectedTargetId] = useState<string | undefined>(undefined);

  // Modal & Drawer states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeVideoReel, setActiveVideoReel] = useState<HighlightReel | null>(null);

  // Role selector state
  const [userRole, setUserRole] = useState<'Ath' | 'Org' | 'Coach'>('Coach');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    title: string,
    message?: string,
    type: 'success' | 'info' | 'warning' = 'success'
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleNavigate = (tab: TabView, targetId?: string) => {
    setCurrentTab(tab);
    setSelectedTargetId(targetId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRoleChange = (role: 'Ath' | 'Org' | 'Coach') => {
    setUserRole(role);
    if (role === 'Coach') {
      addToast('Coach Workspace', 'Full tactical control and athlete biometrics unlocked', 'success');
    } else if (role === 'Ath') {
      addToast('Athlete Perspective', 'Viewing individual player metrics and competition calendar', 'info');
    } else {
      addToast('Organizer Mode', 'Tournament sanctioning and facility scheduler activated', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-[#131B2E] flex flex-col font-['Inter'] relative selection:bg-[#1D4ED8] selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => handleNavigate(tab)}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadCount={2}
        userRole={userRole}
        onRoleChange={handleRoleChange}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-20 pb-safe">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {currentTab === 'overview' && (
              <OverviewView
                onNavigate={handleNavigate}
                onOpenVideo={(reel) => setActiveVideoReel(reel)}
                onShowToast={addToast}
              />
            )}

            {currentTab === 'tournaments' && (
              <TournamentsView
                onShowToast={addToast}
                initialTournamentId={selectedTargetId}
              />
            )}

            {currentTab === 'radar' && (
              <RadarView
                onShowToast={addToast}
                selectedAthleteId={selectedTargetId}
              />
            )}

            {currentTab === 'training' && (
              <TrainingView onShowToast={addToast} />
            )}

            {currentTab === 'rankings' && (
              <RankingsView
                onShowToast={addToast}
                onNavigate={handleNavigate}
              />
            )}

            {currentTab === 'highlights' && (
              <HighlightsView
                onOpenVideo={(reel) => setActiveVideoReel(reel)}
                onShowToast={addToast}
              />
            )}

            {currentTab === 'network' && (
              <NetworkView onShowToast={addToast} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => handleNavigate(tab)}
      />

      {/* Slide-out Coach Navigation Drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentTab={currentTab}
        onSelectTab={(tab) => handleNavigate(tab)}
      />

      {/* Universal Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Coach Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectAction={(target) => handleNavigate(target as TabView)}
      />

      {/* Match Film Video Player Modal */}
      <VideoModal
        reel={activeVideoReel}
        onClose={() => setActiveVideoReel(null)}
        onBookmarkToggle={(id) => {
          addToast('Playbook Updated', 'Film clip bookmarked for tactical review', 'success');
        }}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
