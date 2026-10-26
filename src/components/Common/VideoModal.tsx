import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, X, Bookmark, Volume2, VolumeX, Maximize2, RotateCcw, FastForward } from 'lucide-react';
import { HighlightReel } from '../../types/sports';

interface VideoModalProps {
  reel: HighlightReel | null;
  onClose: () => void;
  onBookmarkToggle?: (id: string) => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ reel, onClose, onBookmarkToggle }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(24);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState<'0.5x' | '1.0x' | '1.5x' | '2.0x'>('1.0x');
  const [showTacticalOverlay, setShowTacticalOverlay] = useState(true);

  // Playback timer simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!reel) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0F172A]/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative w-full max-w-3xl bg-[#0F172A] text-white rounded-2xl overflow-hidden shadow-2xl border border-slate-700/60 z-10 flex flex-col"
        >
          {/* Top Video Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800">
            <div className="flex items-center gap-2 min-w-0">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white">
                Film Session
              </span>
              <span className="text-xs font-semibold truncate text-slate-200">
                {reel.title}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onBookmarkToggle?.(reel.id)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Bookmark Clip"
              >
                <Bookmark className={`w-4 h-4 ${reel.isBookmarked ? 'fill-blue-500 text-blue-500' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Close Viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Simulated Video Canvas */}
          <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group">
            <img
              src={reel.thumbnail}
              alt={reel.title}
              className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-102"
            />

            {/* Tactical Vector Simulation Overlay */}
            {showTacticalOverlay && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-85">
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#38BDF8" />
                  </marker>
                </defs>
                {/* Simulated Tactical Passing Vector & Pressing Zone */}
                <circle cx="48%" cy="58%" r="32" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4 3" className="animate-pulse" />
                <path d="M 320 220 Q 380 180 440 210" fill="none" stroke="#FBBF24" strokeWidth="3" markerEnd="url(#arrow)" />
                <text x="50%" y="30%" fill="#F8FAFC" fontSize="12" fontWeight="700" textAnchor="middle" className="bg-black/60">
                  DEFENSIVE RECOVERY ZONE
                </text>
              </svg>
            )}

            {/* Center Big Play/Pause Toggle on Click */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/35 transition-colors group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-110">
                {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
              </div>
            </button>

            {/* Bottom Scrim */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

            {/* Video Controls Dock */}
            <div className="absolute inset-x-0 bottom-0 p-3 flex flex-col gap-2 z-20">
              {/* Scrubber Bar */}
              <div className="relative w-full h-2 bg-slate-700/80 rounded-full cursor-pointer overflow-hidden group/bar"
                   onClick={(e) => {
                     const rect = e.currentTarget.getBoundingClientRect();
                     const clickX = e.clientX - rect.left;
                     setProgress((clickX / rect.width) * 100);
                   }}>
                <div
                  className="h-full bg-blue-500 rounded-full relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md scale-0 group-hover/bar:scale-100 transition-transform" />
                </div>
              </div>

              {/* Controls Strip */}
              <div className="flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="hover:text-white transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setProgress(0)}
                    className="hover:text-white transition-colors"
                    title="Rewind"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="hover:text-white transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <span className="tabular-nums font-mono text-[11px] text-slate-400">
                    {Math.floor((progress / 100) * 258 / 60)}:
                    {String(Math.floor((progress / 100) * 258 % 60)).padStart(2, '0')} / {reel.videoDuration}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowTacticalOverlay(!showTacticalOverlay)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                      showTacticalOverlay ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Tactical Overlay
                  </button>
                  <button
                    onClick={() => {
                      const speeds: ('0.5x' | '1.0x' | '1.5x' | '2.0x')[] = ['0.5x', '1.0x', '1.5x', '2.0x'];
                      const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
                      setSpeed(next);
                    }}
                    className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white tabular-nums text-[11px] font-medium"
                    title="Playback Rate"
                  >
                    {speed}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Film Coaching Details */}
          <div className="p-4 bg-slate-900 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-200">{reel.subtitle}</span>
              <span>·</span>
              <span className="capitalize">{reel.sport}</span>
              <span>·</span>
              <span>{reel.views}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {reel.summary}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
