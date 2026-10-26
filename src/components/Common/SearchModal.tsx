import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Trophy, User, Dumbbell, Newspaper, ArrowRight } from 'lucide-react';
import { ATHLETES_DATA, TOURNAMENTS_DATA, TRAINING_SESSIONS, NEWS_BULLETINS } from '../../data/mockData';
import { TabView } from '../../types/sports';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: TabView, targetId?: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();

    const matchedAthletes = ATHLETES_DATA.filter(
      (a) => a.name.toLowerCase().includes(q) || a.position.toLowerCase().includes(q) || a.team.toLowerCase().includes(q)
    );

    const matchedTournaments = TOURNAMENTS_DATA.filter(
      (t) => t.title.toLowerCase().includes(q) || t.venue.toLowerCase().includes(q) || t.sport.toLowerCase().includes(q)
    );

    const matchedDrills = TRAINING_SESSIONS.flatMap((s) => s.drills).filter(
      (d) => d.title.toLowerCase().includes(q) || d.subtitle.toLowerCase().includes(q)
    );

    const matchedNews = NEWS_BULLETINS.filter(
      (n) => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q)
    );

    return {
      athletes: matchedAthletes,
      tournaments: matchedTournaments,
      drills: matchedDrills,
      news: matchedNews,
    };
  }, [query]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 z-10 overflow-hidden flex flex-col max-h-[80vh]"
        >
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search athletes, tournaments, drills, bulletins..."
              autoFocus
              className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-['Inter']"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-2 py-1 rounded text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-200/60"
            >
              ESC
            </button>
          </div>

          {/* Search Body */}
          <div className="overflow-y-auto p-4 space-y-4">
            {!query.trim() && (
              <div className="text-center py-8">
                <p className="text-xs font-medium text-slate-400">
                  Type to search across SportSphere Coach Intelligence
                </p>
                <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
                  {['Leo Sterling', 'All-State Football', 'Speed Drills', 'Sprint Benchmarks'].map((item) => (
                    <button
                      key={item}
                      onClick={() => setQuery(item)}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {results && (
              <>
                {/* Athletes */}
                {results.athletes.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Athletes ({results.athletes.length})
                    </h4>
                    <div className="space-y-1">
                      {results.athletes.map((a) => (
                        <button
                          key={a.id}
                          onClick={() => {
                            onNavigate('radar', a.id);
                            onClose();
                          }}
                          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-blue-50/60 text-left transition-colors group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img src={a.avatar} alt={a.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                                {a.name}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate">
                                {a.position} · {a.team} · Overall {a.overallRating}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tournaments */}
                {results.tournaments.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5" /> Tournaments ({results.tournaments.length})
                    </h4>
                    <div className="space-y-1">
                      {results.tournaments.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            onNavigate('tournaments', t.id);
                            onClose();
                          }}
                          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-blue-50/60 text-left transition-colors group"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                              {t.title}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">
                              {t.dates} · {t.venue} · {t.fee}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Drills */}
                {results.drills.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <Dumbbell className="w-3.5 h-3.5" /> Drills & Tactics ({results.drills.length})
                    </h4>
                    <div className="space-y-1">
                      {results.drills.map((d) => (
                        <button
                          key={d.id}
                          onClick={() => {
                            onNavigate('training', d.id);
                            onClose();
                          }}
                          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-blue-50/60 text-left transition-colors group"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                              {d.title}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">
                              {d.subtitle} · {d.duration} mins
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* News */}
                {results.news.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <Newspaper className="w-3.5 h-3.5" /> Bulletins ({results.news.length})
                    </h4>
                    <div className="space-y-1">
                      {results.news.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => {
                            onNavigate('highlights', n.id);
                            onClose();
                          }}
                          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-blue-50/60 text-left transition-colors group"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                              {n.title}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">
                              {n.category} · {n.timestamp}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {results.athletes.length === 0 &&
                  results.tournaments.length === 0 &&
                  results.drills.length === 0 &&
                  results.news.length === 0 && (
                    <div className="text-center py-6 text-xs text-slate-400">
                      No matching records found for "{query}".
                    </div>
                  )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
