import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeftRight,
  TrendingUp,
  Sliders,
  CheckCircle2,
  Award,
  ChevronDown,
  Info,
  Bookmark,
  Shield,
  X,
  Radar,
  ArrowUp,
  Minus,
} from 'lucide-react';
import { ATHLETES_DATA } from '../../data/mockData';
import { Athlete, TabView } from '../../types/sports';

interface RankingsViewProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning') => void;
  onNavigate: (tab: TabView, athleteId?: string) => void;
}

export const RankingsView: React.FC<RankingsViewProps> = ({ onShowToast, onNavigate }) => {
  const [selectedSport, setSelectedSport] = useState<'football' | 'cricket' | 'basketball' | 'athletics'>('football');
  const [activeCategoryTab, setActiveCategoryTab] = useState<'Athletes' | 'Teams' | 'Academies' | 'Coaches'>('Athletes');

  // Comparison Athletes
  const [athleteA, setAthleteA] = useState<Athlete>(ATHLETES_DATA[0]); // Leo Sterling
  const [athleteB, setAthleteB] = useState<Athlete>(ATHLETES_DATA[1]); // Ethan Vance

  // Metric Weights Modal
  const [isWeightsModalOpen, setIsWeightsModalOpen] = useState(false);
  const [weights, setWeights] = useState({
    pace: 30,
    technical: 35,
    physical: 20,
    decisionMaking: 15,
  });

  const handleWeightChange = (key: keyof typeof weights, val: number) => {
    setWeights((prev) => ({ ...prev, [key]: val }));
  };

  const handleSwapCompetitors = () => {
    const temp = athleteA;
    setAthleteA(athleteB);
    setAthleteB(temp);
    onShowToast('Positions Swapped', `${athleteB.name} is now Athlete 1`, 'info');
  };

  return (
    <div className="flex flex-col w-full pb-20 max-w-5xl mx-auto px-4 sm:px-6 space-y-4">
      {/* Top Header & Standard Badge */}
      <div className="pt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-['Plus_Jakarta_Sans']">
            Official Scout Matrix
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200/60">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-[11px] font-semibold">FIFA & IOC Standard</span>
        </div>
      </div>

      {/* Primary Category Segmented Control */}
      <div className="p-1 rounded-2xl bg-slate-100 flex items-center justify-between border border-slate-200/50">
        {(['Athletes', 'Teams', 'Academies', 'Coaches'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategoryTab(cat)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold font-['Plus_Jakarta_Sans'] transition-all text-center ${
              activeCategoryTab === cat
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Multi-Sport Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {(['football', 'cricket', 'basketball', 'athletics'] as const).map((sport) => {
          const isActive = selectedSport === sport;
          return (
            <button
              key={sport}
              onClick={() => setSelectedSport(sport)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all capitalize ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <span>{sport}</span>
            </button>
          );
        })}
      </div>

      {/* Secondary Metadata Filters */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 font-semibold shrink-0">
          <span>U19 Boys</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 font-semibold shrink-0">
          <span>State & National Level</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 font-semibold shrink-0">
          <span>2025/26 Season</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {/* PROMINENT ATHLETE COMPARISON TOOL DOCK */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-slate-900">
              Head-to-Head Athlete Comparison
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSwapCompetitors}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
              title="Swap athlete sides"
            >
              Swap
            </button>
            <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-bold uppercase tracking-wider">
              Live Sim
            </span>
          </div>
        </div>

        {/* Competitor Cards Face-off */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Athlete A */}
          <div className="flex flex-col p-3 rounded-xl bg-slate-50 border border-slate-100 relative">
            <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-blue-600 text-white font-extrabold text-[10px] font-mono">
              #{athleteA.rank}
            </span>
            <div className="flex items-center gap-2.5 mb-2">
              <img
                src={athleteA.avatar}
                alt={athleteA.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100 shrink-0"
              />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate font-['Plus_Jakarta_Sans']">
                  {athleteA.name}
                </h4>
                <p className="text-[11px] text-teal-700 font-semibold truncate">
                  {athleteA.position} · {athleteA.team.split(' ')[0]}
                </p>
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-auto pt-1">
              <span className="text-[11px] text-slate-500">Overall</span>
              <div className="flex items-center gap-1">
                <span className="text-xl font-extrabold text-blue-600 font-['Plus_Jakarta_Sans'] tabular-nums">
                  {athleteA.overallRating}
                </span>
                <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 mt-2 p-1.5 rounded-lg bg-white border border-slate-100 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Pace</span>
                <span className="font-bold text-slate-900 font-mono tabular-nums">{athleteA.metrics.pace}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Finishing</span>
                <span className="font-bold text-slate-900 font-mono tabular-nums">{athleteA.metrics.finishingOrPower}</span>
              </div>
            </div>
          </div>

          {/* Athlete B */}
          <div className="flex flex-col p-3 rounded-xl bg-slate-50 border border-slate-100 relative">
            <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-extrabold text-[10px] font-mono">
              #{athleteB.rank}
            </span>
            <div className="flex items-center gap-2.5 mb-2">
              <img
                src={athleteB.avatar}
                alt={athleteB.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200 shrink-0"
              />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate font-['Plus_Jakarta_Sans']">
                  {athleteB.name}
                </h4>
                <p className="text-[11px] text-teal-700 font-semibold truncate">
                  {athleteB.position} · {athleteB.team.split(' ')[0]}
                </p>
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-auto pt-1">
              <span className="text-[11px] text-slate-500">Overall</span>
              <div className="flex items-center gap-1">
                <span className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] tabular-nums">
                  {athleteB.overallRating}
                </span>
                <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 mt-2 p-1.5 rounded-lg bg-white border border-slate-100 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Pace</span>
                <span className="font-bold text-slate-900 font-mono tabular-nums">{athleteB.metrics.pace}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Finishing</span>
                <span className="font-bold text-slate-900 font-mono tabular-nums">{athleteB.metrics.finishingOrPower}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comparative Stat Differential Bars */}
        <div className="space-y-2.5 pt-2">
          {/* Top Sprint Speed */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-['Plus_Jakarta_Sans']">
              <span className="font-bold text-blue-700 font-mono tabular-nums">
                {athleteA.metrics.topSpeed}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Top Sprint Speed
              </span>
              <span className="font-bold text-slate-900 font-mono tabular-nums">
                {athleteB.metrics.topSpeed}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 flex overflow-hidden">
              <div className="h-full bg-blue-600 rounded-l-full transition-all duration-500" style={{ width: '53%' }} />
              <div className="h-full bg-slate-300 rounded-r-full transition-all duration-500" style={{ width: '47%' }} />
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-['Plus_Jakarta_Sans']">
              <span className="font-bold text-blue-700 font-mono tabular-nums">
                {athleteA.metrics.conversionRate}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Conversion Rate
              </span>
              <span className="font-bold text-slate-900 font-mono tabular-nums">
                {athleteB.metrics.conversionRate}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 flex overflow-hidden">
              <div className="h-full bg-blue-600 rounded-l-full transition-all duration-500" style={{ width: '58%' }} />
              <div className="h-full bg-slate-300 rounded-r-full transition-all duration-500" style={{ width: '42%' }} />
            </div>
          </div>

          {/* Match Impact Index */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-['Plus_Jakarta_Sans']">
              <span className="font-bold text-blue-700 font-mono tabular-nums">
                {athleteA.metrics.matchImpact}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Match Impact Index
              </span>
              <span className="font-bold text-slate-900 font-mono tabular-nums">
                {athleteB.metrics.matchImpact}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 flex overflow-hidden">
              <div className="h-full bg-blue-600 rounded-l-full transition-all duration-500" style={{ width: '52%' }} />
              <div className="h-full bg-slate-300 rounded-r-full transition-all duration-500" style={{ width: '48%' }} />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            onNavigate('radar', athleteA.id);
            onShowToast('Radar Compare Launched', `Comparing ${athleteA.name} with squad metrics`, 'success');
          }}
          className="w-full mt-2 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-['Plus_Jakarta_Sans'] text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
        >
          <Radar className="w-4 h-4" />
          <span>Launch Full Radar Compare</span>
        </button>
      </div>

      {/* Leaderboard Section Header */}
      <div className="flex items-center justify-between pt-2 px-1">
        <div className="flex items-baseline gap-2">
          <h3 className="text-base font-extrabold font-['Plus_Jakarta_Sans'] text-slate-900">
            Official Leaderboard
          </h3>
          <span className="text-[11px] text-slate-400 font-semibold">Tier-1 Sanctioned</span>
        </div>

        <button
          onClick={() => setIsWeightsModalOpen(true)}
          className="flex items-center gap-1.5 text-xs text-blue-600 font-bold hover:underline"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Metric Weights</span>
        </button>
      </div>

      {/* Leaderboard Cards Stack */}
      <div className="space-y-3">
        {ATHLETES_DATA.map((ath, idx) => {
          const rank = idx + 1;
          const posDelta = rank === 1 ? '+2' : rank === 2 ? '0' : rank === 3 ? '+4' : '+1';

          return (
            <div
              key={ath.id}
              className={`rounded-2xl bg-white p-4 shadow-xs border transition-all ${
                rank === 1 ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-['Plus_Jakarta_Sans'] text-xs font-extrabold shrink-0 shadow-xs ${
                      rank === 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {rank}
                  </div>

                  <img
                    src={ath.avatar}
                    alt={ath.name}
                    className="w-11 h-11 rounded-full object-cover shrink-0 ring-2 ring-slate-100"
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 truncate font-['Plus_Jakarta_Sans']">
                        {ath.name}
                      </span>
                      {ath.isVerified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-600 shrink-0" />
                      )}
                    </div>
                    <span className="text-xs text-slate-500 truncate block">
                      {ath.team} · {ath.position}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-lg font-extrabold text-blue-600 font-['Plus_Jakarta_Sans'] tabular-nums leading-none">
                    {ath.overallRating}
                  </div>
                  <div
                    className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 ${
                      posDelta.startsWith('+')
                        ? 'bg-teal-50 text-teal-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {posDelta.startsWith('+') ? <ArrowUp className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                    <span>{posDelta === '0' ? 'Stable' : `${posDelta} Pos`}</span>
                  </div>
                </div>
              </div>

              {/* Quick Metrics Strip */}
              <div className="grid grid-cols-3 gap-2 my-3 py-2 px-3 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Matches</span>
                  <span className="font-bold text-slate-900 font-mono tabular-nums">{ath.metrics.matches}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Goals / Medals</span>
                  <span className="font-bold text-slate-900 font-mono tabular-nums">{ath.metrics.goalsOrMedals}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Impact Split</span>
                  <span className="font-bold text-slate-900 truncate block">{ath.metrics.assistsOrReaction}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('radar', ath.id)}
                  className="flex-1 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-['Plus_Jakarta_Sans'] text-xs font-bold transition-colors"
                >
                  View Profile
                </button>
                <button
                  onClick={() => {
                    setAthleteB(ath);
                    onShowToast('Added to Comparison', `${ath.name} set as Challenger in face-off`, 'success');
                  }}
                  className="flex-1 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-['Plus_Jakarta_Sans'] text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>Compare</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Official Scoring Methodology Footnote */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h5 className="font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
            Official Scoring Methodology
          </h5>
          <p className="leading-relaxed">
            Rankings calculated from sanctioned tournament performance metrics, physical biomarker combines, and verified referee match reports. Updated weekly every Sunday at 23:59 UTC.
          </p>
        </div>
      </div>

      {/* Metric Weights Modal */}
      {isWeightsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsWeightsModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                  Tune Leaderboard Weights
                </h3>
                <span className="text-xs text-slate-500">Customize scouting scoring distribution</span>
              </div>
              <button
                onClick={() => setIsWeightsModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-slate-700">Pace & Sprint Velocity</span>
                  <span className="font-bold text-blue-700 tabular-nums">{weights.pace}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={weights.pace}
                  onChange={(e) => handleWeightChange('pace', Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-slate-700">Technical Skill & Execution</span>
                  <span className="font-bold text-blue-700 tabular-nums">{weights.technical}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={weights.technical}
                  onChange={(e) => handleWeightChange('technical', Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-slate-700">Physical Endurance & Strength</span>
                  <span className="font-bold text-blue-700 tabular-nums">{weights.physical}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={weights.physical}
                  onChange={(e) => handleWeightChange('physical', Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-slate-700">Tactical Game Sense</span>
                  <span className="font-bold text-blue-700 tabular-nums">{weights.decisionMaking}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={weights.decisionMaking}
                  onChange={(e) => handleWeightChange('decisionMaking', Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  setWeights({ pace: 30, technical: 35, physical: 20, decisionMaking: 15 });
                  setIsWeightsModalOpen(false);
                  onShowToast('Weights Reset', 'Standard scout weights restored', 'info');
                }}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Reset Default
              </button>
              <button
                onClick={() => {
                  setIsWeightsModalOpen(false);
                  onShowToast('Weights Applied', 'Leaderboard recalculated with tailored weights', 'success');
                }}
                className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                Apply Weights
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
