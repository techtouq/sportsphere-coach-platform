import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Bookmark,
  Clock,
  Eye,
  Film,
  Newspaper,
  Shield,
  ChevronRight,
  Flame,
  ArrowRight,
  BookmarkPlus,
  Share2,
  X,
} from 'lucide-react';
import { HIGHLIGHT_REELS, NEWS_BULLETINS } from '../../data/mockData';
import { HighlightReel, NewsBulletin, SportCategory } from '../../types/sports';

interface HighlightsViewProps {
  onOpenVideo: (reel: HighlightReel) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning') => void;
}

export const HighlightsView: React.FC<HighlightsViewProps> = ({ onOpenVideo, onShowToast }) => {
  const [activeSection, setActiveSection] = useState<'highlights' | 'news'>('highlights');
  const [selectedSport, setSelectedSport] = useState<SportCategory>('all');
  const [reels, setReels] = useState<HighlightReel[]>(HIGHLIGHT_REELS);
  const [news, setNews] = useState<NewsBulletin[]>(NEWS_BULLETINS);
  const [selectedArticle, setSelectedArticle] = useState<NewsBulletin | null>(null);

  const heroReel = reels[0];

  const filteredReels = reels.filter((r) => {
    if (selectedSport === 'all') return true;
    return r.sport === selectedSport;
  });

  const toggleBookmarkReel = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReels((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isBookmarked: !r.isBookmarked } : r))
    );
    onShowToast('Bookmark updated', 'Saved to coaching playbook', 'info');
  };

  const toggleBookmarkNews = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNews((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isBookmarked: !n.isBookmarked } : n))
    );
    onShowToast('Bulletin saved', 'Added to offline regulations library', 'info');
  };

  return (
    <div className="flex flex-col w-full pb-20 max-w-5xl mx-auto px-4 sm:px-6 space-y-4">
      {/* Segment Control Switcher */}
      <div className="pt-2">
        <div className="bg-slate-100 p-1 rounded-2xl flex items-center justify-between border border-slate-200/60 shadow-xs">
          <button
            onClick={() => setActiveSection('highlights')}
            className={`flex-1 py-2 px-3 rounded-xl font-['Plus_Jakarta_Sans'] text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeSection === 'highlights'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Match Highlights</span>
          </button>
          <button
            onClick={() => setActiveSection('news')}
            className={`flex-1 py-2 px-3 rounded-xl font-['Plus_Jakarta_Sans'] text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeSection === 'news'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>Federation Wire</span>
          </button>
        </div>
      </div>

      {/* Sport Category Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {(['all', 'football', 'cricket', 'basketball', 'athletics', 'badminton'] as SportCategory[]).map(
          (sport) => {
            const isActive = selectedSport === sport;
            return (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize shrink-0 transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                {sport === 'all' ? 'All Sports' : sport}
              </button>
            );
          }
        )}
      </div>

      {/* Highlights Content */}
      {activeSection === 'highlights' && (
        <div className="space-y-4">
          {/* Hero Featured Highlight Card */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 flex flex-col">
            <div className="relative w-full aspect-video sm:aspect-[21/9] bg-slate-950 overflow-hidden group">
              <img
                src={heroReel.thumbnail}
                alt={heroReel.title}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

              {/* Badges */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-300 animate-ping" />
                    MATCH RECAP · 4K
                  </span>
                  <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase">
                    {heroReel.sport}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-white text-[10px] font-mono tabular-nums flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {heroReel.videoDuration}
                </span>
              </div>

              {/* Center Play Button Overlay */}
              <button
                onClick={() => onOpenVideo(heroReel)}
                className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                aria-label="Play video"
              >
                <div className="w-16 h-16 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white flex items-center justify-center shadow-xl transition-transform duration-200 group-hover:scale-110">
                  <Play className="w-7 h-7 ml-1 fill-white" />
                </div>
              </button>

              {/* Lower Metadata Overlay */}
              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between z-10 text-white">
                <div className="flex items-center gap-1.5 text-blue-200 text-xs">
                  <Shield className="w-3.5 h-3.5 text-teal-400" />
                  <span>National Youth League</span>
                </div>
                <span className="text-[11px] text-slate-300 opacity-90">Today · 2 hours ago</span>
              </div>
            </div>

            {/* Details */}
            <div className="p-4 sm:p-5 flex flex-col gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold font-['Plus_Jakarta_Sans'] text-slate-900 leading-snug">
                  {heroReel.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {heroReel.summary}
                </p>
              </div>

              {/* CTAs */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onOpenVideo(heroReel)}
                  className="flex-1 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-['Plus_Jakarta_Sans'] flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Watch Film</span>
                </button>
                <button
                  onClick={(e) => toggleBookmarkReel(heroReel.id, e)}
                  className="h-10 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <BookmarkPlus className="w-4 h-4 text-slate-500" />
                  <span>Save to Playbook</span>
                </button>
              </div>
            </div>
          </div>

          {/* Trending Analysis Reels */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-slate-900">
                  Trending Analysis Reels
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">All Sports</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {filteredReels.slice(1).map((reel) => (
                <div
                  key={reel.id}
                  onClick={() => onOpenVideo(reel)}
                  className="bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 group cursor-pointer hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative w-full aspect-[4/3] bg-slate-950 overflow-hidden">
                    <img
                      src={reel.thumbnail}
                      alt={reel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono tabular-nums">
                      {reel.videoDuration}
                    </span>
                    <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-xs">
                      <Play className="w-3.5 h-3.5 ml-0.5 fill-white" />
                    </div>
                  </div>

                  <div className="p-3 flex flex-col justify-between flex-1 gap-2">
                    <span className="text-xs font-bold font-['Plus_Jakarta_Sans'] text-slate-900 line-clamp-2 leading-snug">
                      {reel.title}
                    </span>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                      <span className="capitalize text-blue-700 font-semibold">{reel.sport}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {reel.views}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Federation Wire / News Bulletins Content */}
      {activeSection === 'news' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-slate-900">
              Official Regulations & Press Bulletins
            </h3>
            <span className="text-xs text-slate-400 font-medium">Updated 2h ago</span>
          </div>

          <div className="space-y-3">
            {news.map((item) => (
              <article
                key={item.id}
                onClick={() => setSelectedArticle(item)}
                className="p-4 rounded-2xl bg-white shadow-xs border border-slate-200/80 hover:border-blue-300 transition-all cursor-pointer space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-bold font-['Plus_Jakarta_Sans'] uppercase tracking-wider">
                      {item.tag}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500">{item.category}</span>
                  </div>
                  <button
                    onClick={(e) => toggleBookmarkNews(item.id, e)}
                    className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                  >
                    <Bookmark className={`w-4 h-4 ${item.isBookmarked ? 'fill-blue-600 text-blue-600' : ''}`} />
                  </button>
                </div>

                <h4 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-slate-900 leading-snug">
                  {item.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.summary}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {item.readTime}
                    </span>
                    <span>·</span>
                    <span>{item.timestamp}</span>
                  </div>
                  <span className="text-blue-600 font-semibold flex items-center gap-0.5">
                    Read Article <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Article Detail Drawer Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setSelectedArticle(null)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl z-10 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                {selectedArticle.tag} · {selectedArticle.category}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans'] leading-snug">
              {selectedArticle.title}
            </h3>

            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span>{selectedArticle.readTime}</span>
              <span>·</span>
              <span>{selectedArticle.timestamp}</span>
              <span>·</span>
              <span className="text-emerald-600 font-semibold">Verified Mandate</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed font-['Inter'] space-y-2">
              <p>{selectedArticle.summary}</p>
              {selectedArticle.fullBody && <p>{selectedArticle.fullBody}</p>}
              <p>Coaching directors are advised to download and review the updated medical verification packet prior to submitting tournament rosters.</p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedArticle(null);
                  onShowToast('Article Shared', 'Link copied to clipboard', 'success');
                }}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Mandate</span>
              </button>
              <button
                onClick={() => setSelectedArticle(null)}
                className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
