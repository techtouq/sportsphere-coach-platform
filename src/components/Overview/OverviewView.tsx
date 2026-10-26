import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Zap,
  Clock,
  FileText,
  Dumbbell,
  Play,
  Bookmark,
  Calendar,
  MapPin,
  ChevronRight,
  Plus,
  Flame,
  Award,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { ATHLETES_DATA, TOURNAMENTS_DATA, HIGHLIGHT_REELS, NEWS_BULLETINS } from '../../data/mockData';
import { HighlightReel, SportCategory, TabView, Tournament } from '../../types/sports';

interface OverviewViewProps {
  onNavigate: (tab: TabView, targetId?: string) => void;
  onOpenVideo: (reel: HighlightReel) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning') => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onNavigate,
  onOpenVideo,
  onShowToast,
}) => {
  const [selectedSport, setSelectedSport] = useState<SportCategory>('all');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    title: 'Match Tactical Simulation & Pressing',
    squad: 'U19 Elite Football Squad',
    time: '04:30 PM',
    pitch: 'Pitch 3, National Sports Complex',
  });

  const [tournaments, setTournaments] = useState<Tournament[]>(TOURNAMENTS_DATA);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTournaments((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isBookmarked: !t.isBookmarked } : t))
    );
    onShowToast('Bookmark updated', 'Saved to your coach watchlist', 'info');
  };

  const filteredTournaments = tournaments.filter((t) => {
    if (selectedSport === 'all') return true;
    return t.sport === selectedSport;
  });

  const featuredReel = HIGHLIGHT_REELS[0];

  return (
    <div className="flex flex-col w-full pb-12 space-y-6 max-w-5xl mx-auto px-4 sm:px-6">
      {/* 1. Coach Personalized Greeting Card */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-blue-50/70 pointer-events-none" />
        <div className="flex items-start justify-between gap-4 relative z-10">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-full mb-2 border border-blue-100">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
              <span className="text-[10px] font-['Plus_Jakarta_Sans'] font-bold text-blue-700 uppercase tracking-wider">
                Verified Head Coach
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-['Plus_Jakarta_Sans'] font-extrabold text-slate-900 tracking-tight">
              Good morning, Coach Marcus
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-snug font-['Inter']">
              Discover verified prospects, follow live tournaments, and optimize squad biometrics.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 flex flex-wrap items-center gap-2 text-slate-600 bg-slate-50/90 rounded-xl p-2.5 border border-slate-100 relative z-10 text-xs">
          <span className="font-bold text-blue-700">Head Coach</span>
          <span className="text-slate-300">·</span>
          <span className="font-semibold text-slate-900">U19 Football & Athletics</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-600 truncate">Metro High Performance Academy</span>
        </div>
      </section>

      {/* 2. Quick Pulse: Operational Sports Metrics (with tabular figures) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-slate-900">
              Quick Pulse
            </h2>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Live Radar Active
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Metric 1 */}
          <div
            onClick={() => onNavigate('radar')}
            className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-slate-500">Athletes</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] tabular-nums leading-none">
              6
            </div>
            <div className="text-[11px] text-slate-500 mt-1 leading-snug">
              Competing this weekend
            </div>
          </div>

          {/* Metric 2 */}
          <div
            onClick={() => onNavigate('tournaments')}
            className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-200/80 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-slate-500">Deadlines</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-amber-700 font-['Plus_Jakarta_Sans'] tabular-nums leading-none">
              3
            </div>
            <div className="text-[11px] text-slate-500 mt-1 leading-snug">
              Closing in 72 hours
            </div>
          </div>

          {/* Metric 3 */}
          <div
            onClick={() => onNavigate('network')}
            className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-slate-500">Scout Reports</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] tabular-nums leading-none">
              14
            </div>
            <div className="text-[11px] text-slate-500 mt-1 leading-snug">
              New prospect evaluations
            </div>
          </div>

          {/* Metric 4 */}
          <div
            onClick={() => onNavigate('training')}
            className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-slate-500">Training</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Dumbbell className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] tabular-nums leading-none">
              2
            </div>
            <div className="text-[11px] text-slate-500 mt-1 leading-snug">
              Tactical sessions today
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Sports Highlight (Editorial Video Spotlight) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
            <h2 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-slate-900">
              Featured Highlight
            </h2>
          </div>
          <button
            onClick={() => onNavigate('highlights')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
          >
            Full Reel <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 flex flex-col">
          {/* Video Preview Frame */}
          <div className="relative w-full aspect-video sm:aspect-[21/9] bg-slate-900 overflow-hidden group">
            <img
              src={featuredReel.thumbnail}
              alt={featuredReel.title}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="bg-red-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                Match Highlight
              </span>
              <span className="bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] font-semibold">
                4K
              </span>
            </div>

            <div className="absolute top-3 right-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShowToast('Clip bookmarked', 'Added to coach playbook', 'success');
                }}
                className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                title="Bookmark Clip"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>

            {/* Play Button Overlay */}
            <button
              onClick={() => onOpenVideo(featuredReel)}
              className="absolute inset-0 flex items-center justify-center cursor-pointer group"
              aria-label="Play match film"
            >
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-110">
                <Play className="w-6 h-6 ml-1 fill-white" />
              </div>
            </button>

            {/* Duration */}
            <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-[11px] font-mono tabular-nums px-2 py-0.5 rounded">
              {featuredReel.videoDuration}
            </span>

            {/* Bottom title info */}
            <div className="absolute bottom-3 left-3 right-20 text-white">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300">
                {featuredReel.subtitle}
              </span>
              <h3 className="text-sm sm:text-base font-bold font-['Plus_Jakarta_Sans'] truncate text-white">
                St. Jude Academy vs Metro Stars (2-1)
              </h3>
            </div>
          </div>

          {/* Details & Action Bar */}
          <div className="p-4 sm:p-5 flex flex-col gap-3">
            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
              {featuredReel.summary}
            </p>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Yesterday
              </span>
              <span>·</span>
              <span>14.2k views</span>
              <span>·</span>
              <span className="text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
                Football
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => onOpenVideo(featuredReel)}
                className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-['Plus_Jakarta_Sans'] flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Watch Film</span>
              </button>
              <button
                onClick={() => {
                  onNavigate('radar', 'leo-sterling');
                  onShowToast('Loading scout notes', 'Displaying Leo Sterling biometric analysis', 'info');
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold font-['Plus_Jakarta_Sans'] flex items-center justify-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Scout Notes</span>
              </button>
            </div>
          </div>

          {/* Mini Reel Carousel */}
          <div className="bg-slate-50 border-t border-slate-100 px-4 py-3 flex items-center gap-3 overflow-x-auto no-scrollbar">
            {HIGHLIGHT_REELS.slice(1).map((reel) => (
              <div
                key={reel.id}
                onClick={() => onOpenVideo(reel)}
                className="flex items-center gap-2.5 bg-white p-2 rounded-xl border border-slate-200/80 shrink-0 w-60 shadow-xs hover:border-blue-300 cursor-pointer transition-all"
              >
                <div className="relative w-14 h-11 rounded-lg overflow-hidden shrink-0 bg-slate-800">
                  <img src={reel.thumbnail} alt={reel.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 text-white fill-white" />
                  </div>
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-blue-700 uppercase block truncate">
                    {reel.sport}
                  </span>
                  <span className="text-xs font-semibold text-slate-900 truncate block">
                    {reel.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Quick Coach Action Bar: Tactical Session Assessment */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4">
        <div className="min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
            Tactical Session Planner
          </span>
          <h3 className="text-base sm:text-lg font-bold font-['Plus_Jakarta_Sans'] text-white mt-0.5">
            Quick Practice Assessment
          </h3>
          <p className="text-xs text-blue-100 mt-0.5 truncate">
            Schedule today's squad drill load or log field biometrics
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold font-['Plus_Jakarta_Sans'] px-3.5 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule</span>
          </button>
        </div>
      </section>

      {/* 5. Upcoming Tournaments with Quick Category Filter */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-slate-900">
              Upcoming Tournaments
            </h2>
          </div>
          <button
            onClick={() => onNavigate('tournaments')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            View All (28)
          </button>
        </div>

        {/* Sport Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {(['all', 'football', 'athletics', 'basketball', 'cricket', 'badminton'] as SportCategory[]).map(
            (sport) => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 transition-all ${
                  selectedSport === sport
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sport}
              </button>
            )
          )}
        </div>

        {/* Tournament Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredTournaments.slice(0, 2).map((tourney) => (
            <div
              key={tourney.id}
              onClick={() => onNavigate('tournaments', tourney.id)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-3 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                      {tourney.level}
                    </span>
                    <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {tourney.urgency}
                    </span>
                  </div>
                  <button
                    onClick={(e) => toggleBookmark(tourney.id, e)}
                    className="p-1 rounded text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${tourney.isBookmarked ? 'fill-blue-600 text-blue-600' : ''}`}
                    />
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-slate-900 leading-snug">
                    {tourney.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{tourney.venue} · {tourney.dates}</span>
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div className="font-medium">
                  <span className="font-bold text-slate-900">{tourney.registeredSlots} / {tourney.maxSlots}</span> slots filled
                </div>
                <div className="text-blue-600 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Talent Radar Spotlight */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-slate-900">
              Talent Radar Spotlight
            </h2>
          </div>
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
            Uncommitted
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ATHLETES_DATA.slice(1, 3).map((ath) => (
            <div
              key={ath.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={ath.avatar}
                  alt={ath.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-slate-900 truncate">
                    {ath.name}
                  </h4>
                  <span className="text-xs text-slate-500 block truncate">
                    {ath.position} · Age {ath.age}
                  </span>
                </div>
              </div>

              <div className="my-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Pace</span>
                  <span className="text-base font-extrabold text-blue-600 font-['Plus_Jakarta_Sans'] tabular-nums">
                    {ath.biomarkers.speed}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Rating</span>
                  <span className="text-base font-extrabold text-emerald-600 font-['Plus_Jakarta_Sans'] tabular-nums">
                    {ath.overallRating}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('radar', ath.id)}
                className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Scout Card</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Federation Wire & Sports Bulletins */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-slate-900">
              Federation Wire
            </h2>
          </div>
          <button
            onClick={() => onNavigate('highlights')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            Sports News
          </button>
        </div>

        <div className="bg-white rounded-2xl divide-y divide-slate-100 border border-slate-200/80 shadow-sm overflow-hidden">
          {NEWS_BULLETINS.slice(0, 2).map((bulletin) => (
            <article
              key={bulletin.id}
              onClick={() => onNavigate('highlights', bulletin.id)}
              className="p-4 space-y-1.5 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                  {bulletin.tag}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-500 font-mono text-[11px] tabular-nums">
                  {bulletin.timestamp}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold font-['Plus_Jakarta_Sans'] text-slate-900 leading-snug">
                {bulletin.title}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {bulletin.summary}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Schedule Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsScheduleModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl z-10 space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
              Schedule Squad Tactical Session
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Session Title</label>
                <input
                  type="text"
                  value={sessionForm.title}
                  onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-blue-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Squad Roster</label>
                <input
                  type="text"
                  value={sessionForm.squad}
                  onChange={(e) => setSessionForm({ ...sessionForm, squad: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Time</label>
                  <input
                    type="text"
                    value={sessionForm.time}
                    onChange={(e) => setSessionForm({ ...sessionForm, time: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-blue-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Facility / Pitch</label>
                  <input
                    type="text"
                    value={sessionForm.pitch}
                    onChange={(e) => setSessionForm({ ...sessionForm, pitch: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-blue-600"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsScheduleModalOpen(false);
                  onShowToast('Session scheduled', `${sessionForm.title} added to Training calendar`, 'success');
                  onNavigate('training');
                }}
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
              >
                Confirm Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
