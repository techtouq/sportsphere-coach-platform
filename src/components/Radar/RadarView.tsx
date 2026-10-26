import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  ChevronDown,
  FileDown,
  PlusCircle,
  TrendingUp,
  Zap,
  Activity,
  Heart,
  Dumbbell,
  Compass,
  CheckCircle2,
  Sparkles,
  X,
  Target,
} from 'lucide-react';
import { ATHLETES_DATA } from '../../data/mockData';
import { Athlete } from '../../types/sports';

interface RadarViewProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning') => void;
  selectedAthleteId?: string;
}

export const RadarView: React.FC<RadarViewProps> = ({ onShowToast, selectedAthleteId }) => {
  const [activeAthlete, setActiveAthlete] = useState<Athlete>(() => {
    return (
      ATHLETES_DATA.find((a) => a.id === selectedAthleteId) ||
      ATHLETES_DATA[0]
    );
  });

  const [compareMode, setCompareMode] = useState<'team' | 'prev'>('team');
  const [activeTip, setActiveTip] = useState({
    title: 'Speed & Acceleration',
    score: 94,
    desc: '34.8 km/h top sprint speed logged in transition.',
    trend: '+3.2%',
  });

  const [isNewTestModalOpen, setIsNewTestModalOpen] = useState(false);
  const [isAthleteDropdownOpen, setIsAthleteDropdownOpen] = useState(false);
  const [newTestValues, setNewTestValues] = useState({
    speed: 95,
    agility: 92,
    technique: 90,
    consistency: 89,
    strength: 84,
    endurance: 88,
    coachNotes: 'Improved transition recovery during anaerobic test circuit.',
  });

  // Calculate radar polygon points based on 6 biomarker axes
  // Center is (0, 0), radius is 130
  // Angles:
  // 1. Speed (Top): 270 deg -> (0, -r)
  // 2. Agility (Top-Right): 330 deg -> (r * cos(-30), r * sin(-30)) -> (r * 0.866, -r * 0.5)
  // 3. Technique (Bot-Right): 30 deg -> (r * 0.866, r * 0.5)
  // 4. Consistency (Bottom): 90 deg -> (0, r)
  // 5. Strength (Bot-Left): 150 deg -> (-r * 0.866, r * 0.5)
  // 6. Endurance (Top-Left): 210 deg -> (-r * 0.866, -r * 0.5)

  const maxR = 130;
  const getCoordinates = (val: number, angleDeg: number) => {
    const r = (val / 100) * maxR;
    const rad = (angleDeg * Math.PI) / 180;
    const x = Math.round(r * Math.cos(rad) * 10) / 10;
    const y = Math.round(r * Math.sin(rad) * 10) / 10;
    return { x, y };
  };

  const athleteCoords = [
    getCoordinates(activeAthlete.biomarkers.speed, -90),
    getCoordinates(activeAthlete.biomarkers.agility, -30),
    getCoordinates(activeAthlete.biomarkers.technique, 30),
    getCoordinates(activeAthlete.biomarkers.consistency, 90),
    getCoordinates(activeAthlete.biomarkers.strength, 150),
    getCoordinates(activeAthlete.biomarkers.endurance, 210),
  ];

  const athletePointsStr = athleteCoords.map((c) => `${c.x},${c.y}`).join(' ');

  // Comparison benchmark coordinates
  // Team avg: Speed 80, Agility 77, Technique 82, Consistency 79, Strength 80, Endurance 78
  // Prev Aug test: Speed 91, Agility 89, Technique 89, Consistency 87, Strength 83, Endurance 82
  const compValues =
    compareMode === 'team'
      ? { speed: 80, agility: 77, technique: 82, consistency: 79, strength: 80, endurance: 78 }
      : { speed: 91, agility: 89, technique: 89, consistency: 87, strength: 83, endurance: 82 };

  const compCoords = [
    getCoordinates(compValues.speed, -90),
    getCoordinates(compValues.agility, -30),
    getCoordinates(compValues.technique, 30),
    getCoordinates(compValues.consistency, 90),
    getCoordinates(compValues.strength, 150),
    getCoordinates(compValues.endurance, 210),
  ];
  const compPointsStr = compCoords.map((c) => `${c.x},${c.y}`).join(' ');

  const handleVertexClick = (
    title: string,
    score: number,
    desc: string,
    trend: string
  ) => {
    setActiveTip({ title, score, desc, trend });
  };

  const handleExportPDF = () => {
    onShowToast(
      'Generating Telemetry PDF',
      `Exporting biometric radar report for ${activeAthlete.name}...`,
      'success'
    );
  };

  const handleSaveNewTest = () => {
    setActiveAthlete((prev) => ({
      ...prev,
      biomarkers: {
        speed: newTestValues.speed,
        agility: newTestValues.agility,
        technique: newTestValues.technique,
        consistency: newTestValues.consistency,
        strength: newTestValues.strength,
        endurance: newTestValues.endurance,
      },
      scoutingNotes: newTestValues.coachNotes,
      lastAssessment: `Today • Coach Marcus Vance`,
    }));
    setIsNewTestModalOpen(false);
    onShowToast('New Biometric Test Logged', `Updated profile for ${activeAthlete.name}`, 'success');
  };

  return (
    <div className="flex flex-col w-full pb-20 max-w-5xl mx-auto px-4 sm:px-6 space-y-4">
      {/* 1. Athlete Selector & Profile Summary */}
      <div className="w-full bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                src={activeAthlete.avatar}
                alt={activeAthlete.name}
                className="w-13 h-13 rounded-full object-cover ring-2 ring-blue-600/30"
              />
              <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white font-['Plus_Jakarta_Sans'] font-extrabold text-[10px] px-1.5 py-0.2 rounded-full shadow-xs">
                {activeAthlete.number}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-base sm:text-lg font-bold font-['Plus_Jakarta_Sans'] text-slate-900 truncate">
                  {activeAthlete.name}
                </h2>
                <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-600 shrink-0" />
              </div>
              <p className="text-xs text-slate-500 truncate">
                {activeAthlete.position} · {activeAthlete.team}
              </p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsAthleteDropdownOpen(!isAthleteDropdownOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              aria-label="Change Athlete"
              title="Change athlete"
            >
              <ChevronDown className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {isAthleteDropdownOpen && (
              <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-30">
                <p className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Squad Athlete
                </p>
                {ATHLETES_DATA.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      setActiveAthlete(a);
                      setIsAthleteDropdownOpen(false);
                      onShowToast('Athlete Swapped', `Displaying radar for ${a.name}`, 'info');
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs transition-colors ${
                      activeAthlete.id === a.id
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <img src={a.avatar} alt={a.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                    <div className="min-w-0 truncate">
                      <span>{a.name}</span>
                      <span className="text-[10px] text-slate-400 block">{a.position} · {a.overallRating}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Assessment Validation Metadata */}
        <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-xl text-xs border border-slate-100">
          <div className="flex items-center gap-1.5 min-w-0 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="truncate">{activeAthlete.lastAssessment}</span>
          </div>
          <span className="text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Validated
          </span>
        </div>

        {/* Comparison Segmented Control */}
        <div className="mt-3 p-1 bg-slate-100 rounded-xl flex items-center gap-1">
          <button
            onClick={() => setCompareMode('team')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold font-['Plus_Jakarta_Sans'] transition-all text-center ${
              compareMode === 'team'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            vs. Team Avg (79.4)
          </button>
          <button
            onClick={() => setCompareMode('prev')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold font-['Plus_Jakarta_Sans'] transition-all text-center ${
              compareMode === 'prev'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            vs. Aug 2025 Test (85.1)
          </button>
        </div>
      </div>

      {/* 2. RADAR VISUALIZATION MODULE */}
      <div className="w-full bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 relative overflow-hidden">
        {/* Header Metric Overview */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Comprehensive Radar
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-blue-600 font-['Plus_Jakarta_Sans'] tabular-nums">
                {activeAthlete.overallRating}
              </span>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                +3.8 percentile
              </span>
            </div>
          </div>

          {/* Legends */}
          <div className="flex flex-col items-end gap-1 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span className="font-semibold text-slate-900 font-['Plus_Jakarta_Sans']">
                {activeAthlete.name.split(' ')[0]}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="w-3 h-0.5 bg-slate-400 border-dashed" />
              <span>
                {compareMode === 'team' ? 'U19 Squad (79.4)' : 'Aug Test (85.1)'}
              </span>
            </div>
          </div>
        </div>

        {/* SVG Radar Chart Canvas */}
        <div className="relative w-full aspect-square max-w-[340px] mx-auto my-2 flex items-center justify-center select-none">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="-170 -170 340 340"
          >
            {/* Hexagonal Reference Rings (20, 40, 60, 80, 100) */}
            <polygon
              fill="none"
              points="0,-26 22.5,-13 22.5,13 0,26 -22.5,13 -22.5,-13"
              stroke="#EAEDFF"
              strokeDasharray="2 2"
              strokeWidth="1.2"
            />
            <polygon
              fill="none"
              points="0,-52 45,-26 45,26 0,52 -45,26 -45,-26"
              stroke="#EAEDFF"
              strokeDasharray="2 2"
              strokeWidth="1.2"
            />
            <polygon
              fill="none"
              points="0,-78 67.5,-39 67.5,39 0,78 -67.5,39 -67.5,-39"
              stroke="#EAEDFF"
              strokeDasharray="2 2"
              strokeWidth="1.2"
            />
            <polygon
              fill="none"
              points="0,-104 90,-52 90,52 0,104 -90,52 -90,-52"
              stroke="#DAE2FD"
              strokeWidth="1.2"
            />
            {/* Outer Hexagon boundary (100) */}
            <polygon
              fill="#FAF8FF"
              fillOpacity="0.5"
              points="0,-130 112.6,-65 112.6,65 0,130 -112.6,65 -112.6,-65"
              stroke="#CBD5E1"
              strokeWidth="1.5"
            />

            {/* Spoke Axes */}
            <line x1="0" y1="0" x2="0" y2="-130" stroke="#E2E8F0" strokeWidth="1.2" />
            <line x1="0" y1="0" x2="112.6" y2="-65" stroke="#E2E8F0" strokeWidth="1.2" />
            <line x1="0" y1="0" x2="112.6" y2="65" stroke="#E2E8F0" strokeWidth="1.2" />
            <line x1="0" y1="0" x2="0" y2="130" stroke="#E2E8F0" strokeWidth="1.2" />
            <line x1="0" y1="0" x2="-112.6" y2="65" stroke="#E2E8F0" strokeWidth="1.2" />
            <line x1="0" y1="0" x2="-112.6" y2="-65" stroke="#E2E8F0" strokeWidth="1.2" />

            {/* Benchmark / Comparison Polygon */}
            <polygon
              points={compPointsStr}
              fill="#434655"
              fillOpacity="0.08"
              stroke="#64748B"
              strokeDasharray="4 3"
              strokeWidth="1.8"
              strokeLinejoin="round"
              className="transition-all duration-500 ease-out"
            />

            {/* Active Athlete Polygon */}
            <polygon
              points={athletePointsStr}
              fill="#1D4ED8"
              fillOpacity="0.22"
              stroke="#1D4ED8"
              strokeWidth="2.5"
              strokeLinejoin="round"
              className="transition-all duration-500 ease-out"
            />

            {/* Athlete Knots with click handlers */}
            {athleteCoords.map((coord, i) => {
              const keys = ['speed', 'agility', 'technique', 'consistency', 'strength', 'endurance'] as const;
              const names = ['Speed & Burst', 'Agility & Cuts', 'Technique', 'Consistency', 'Strength', 'Endurance'];
              const key = keys[i];
              const score = activeAthlete.biomarkers[key];

              return (
                <circle
                  key={key}
                  cx={coord.x}
                  cy={coord.y}
                  r="5"
                  fill="#FFFFFF"
                  stroke="#1D4ED8"
                  strokeWidth="2.5"
                  className="cursor-pointer hover:r-6 transition-all"
                  onClick={() =>
                    handleVertexClick(
                      names[i],
                      score,
                      `Current score: ${score}/100 based on verified assessment metrics.`,
                      '+2.4% vs baseline'
                    )
                  }
                />
              );
            })}

            {/* Axis Label Groups */}
            {/* Speed (Top) */}
            <g
              className="cursor-pointer"
              onClick={() =>
                handleVertexClick(
                  'Speed & Burst',
                  activeAthlete.biomarkers.speed,
                  `${activeAthlete.metrics.topSpeed} top sprint velocity recorded in match transition.`,
                  '+3.2% vs baseline'
                )
              }
            >
              <text x="0" y="-142" fill="#131B2E" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="Plus Jakarta Sans">
                Speed
              </text>
              <rect x="-14" y="-160" width="28" height="15" rx="4" fill="#EAEDFF" />
              <text x="0" y="-149" fill="#0037B0" fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="Plus Jakarta Sans">
                {activeAthlete.biomarkers.speed}
              </text>
            </g>

            {/* Agility (Top-Right) */}
            <g
              className="cursor-pointer"
              onClick={() =>
                handleVertexClick(
                  'Agility & Cuts',
                  activeAthlete.biomarkers.agility,
                  'Pro-Agility 5-10-5 reactive cut speed: 4.12s.',
                  '+1.8% vs baseline'
                )
              }
            >
              <text x="122" y="-62" fill="#131B2E" fontSize="11" fontWeight="700" textAnchor="start" fontFamily="Plus Jakarta Sans">
                Agility
              </text>
              <rect x="122" y="-56" width="28" height="15" rx="4" fill="#EAEDFF" />
              <text x="136" y="-45" fill="#0037B0" fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="Plus Jakarta Sans">
                {activeAthlete.biomarkers.agility}
              </text>
            </g>

            {/* Technique (Bottom-Right) */}
            <g
              className="cursor-pointer"
              onClick={() =>
                handleVertexClick(
                  'Technique & Touch',
                  activeAthlete.biomarkers.technique,
                  '88% passing retention and clean ball control under pressure.',
                  'Stable'
                )
              }
            >
              <text x="118" y="70" fill="#131B2E" fontSize="11" fontWeight="700" textAnchor="start" fontFamily="Plus Jakarta Sans">
                Technique
              </text>
              <rect x="118" y="76" width="28" height="15" rx="4" fill="#EAEDFF" />
              <text x="132" y="87" fill="#0037B0" fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="Plus Jakarta Sans">
                {activeAthlete.biomarkers.technique}
              </text>
            </g>

            {/* Consistency (Bottom) */}
            <g
              className="cursor-pointer"
              onClick={() =>
                handleVertexClick(
                  'Consistency & Focus',
                  activeAthlete.biomarkers.consistency,
                  'Performance rating variance under 4.2% across last 8 matches.',
                  '+0.9% vs baseline'
                )
              }
            >
              <text x="0" y="145" fill="#131B2E" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="Plus Jakarta Sans">
                Consistency
              </text>
              <rect x="-14" y="150" width="28" height="15" rx="4" fill="#EAEDFF" />
              <text x="0" y="161" fill="#0037B0" fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="Plus Jakarta Sans">
                {activeAthlete.biomarkers.consistency}
              </text>
            </g>

            {/* Strength (Bottom-Left) */}
            <g
              className="cursor-pointer"
              onClick={() =>
                handleVertexClick(
                  'Strength Index',
                  activeAthlete.biomarkers.strength,
                  'Trap-bar deadlift 2.1x bodyweight force transfer ratio.',
                  '-0.5% vs baseline'
                )
              }
            >
              <text x="-120" y="70" fill="#131B2E" fontSize="11" fontWeight="700" textAnchor="end" fontFamily="Plus Jakarta Sans">
                Strength
              </text>
              <rect x="-148" y="76" width="28" height="15" rx="4" fill="#EAEDFF" />
              <text x="-134" y="87" fill="#0037B0" fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="Plus Jakarta Sans">
                {activeAthlete.biomarkers.strength}
              </text>
            </g>

            {/* Endurance (Top-Left) */}
            <g
              className="cursor-pointer"
              onClick={() =>
                handleVertexClick(
                  'Endurance & VO2',
                  activeAthlete.biomarkers.endurance,
                  'Yo-Yo Intermittent Recovery Level 2: 2,120m.',
                  '+4.5% vs baseline'
                )
              }
            >
              <text x="-120" y="-62" fill="#131B2E" fontSize="11" fontWeight="700" textAnchor="end" fontFamily="Plus Jakarta Sans">
                Endurance
              </text>
              <rect x="-148" y="-56" width="28" height="15" rx="4" fill="#EAEDFF" />
              <text x="-134" y="-45" fill="#0037B0" fontSize="9" fontWeight="800" textAnchor="middle" fontFamily="Plus Jakarta Sans">
                {activeAthlete.biomarkers.endurance}
              </text>
            </g>
          </svg>
        </div>

        {/* Interactive Tactical Tooltip Simulator */}
        <div className="bg-[#EAEDFF] rounded-xl p-3 flex items-start justify-between gap-3 border border-blue-200/60 transition-all">
          <div className="flex items-start gap-2.5 min-w-0">
            <Activity className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-slate-900 font-['Plus_Jakarta_Sans']">
                  {activeTip.title}
                </span>
                <span className="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded tabular-nums font-mono">
                  {activeTip.score}/100
                </span>
              </div>
              <p className="text-xs text-slate-600 truncate mt-0.5">
                {activeTip.desc}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full shrink-0">
            {activeTip.trend}
          </span>
        </div>
      </div>

      {/* 3. DIMENSION BREAKDOWN CARDS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-['Plus_Jakarta_Sans']">
            Dimension Analysis
          </h3>
          <span className="text-xs text-slate-400 font-medium">6 Biomarkers</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Speed */}
          <div className="bg-white rounded-xl p-3 shadow-xs border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                  Speed & Burst
                </h4>
                <span className="text-[11px] text-slate-500">Top Speed: {activeAthlete.metrics.topSpeed}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] tabular-nums block">
                {activeAthlete.biomarkers.speed}
              </span>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 justify-end">
                ↑ 3.2%
              </span>
            </div>
          </div>

          {/* Agility */}
          <div className="bg-white rounded-xl p-3 shadow-xs border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                  Agility & Cuts
                </h4>
                <span className="text-[11px] text-slate-500">Change of direction 4.12s</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] tabular-nums block">
                {activeAthlete.biomarkers.agility}
              </span>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 justify-end">
                ↑ 1.8%
              </span>
            </div>
          </div>

          {/* Technique */}
          <div className="bg-white rounded-xl p-3 shadow-xs border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                  Tactical & Technique
                </h4>
                <span className="text-[11px] text-slate-500">Attacking 3rd retention: 88%</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] tabular-nums block">
                {activeAthlete.biomarkers.technique}
              </span>
              <span className="text-[10px] font-bold text-slate-400 block">Stable</span>
            </div>
          </div>

          {/* Endurance */}
          <div className="bg-white rounded-xl p-3 shadow-xs border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                  Endurance & VO2
                </h4>
                <span className="text-[11px] text-slate-500">Yo-Yo IR2: 2,120m</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] tabular-nums block">
                {activeAthlete.biomarkers.endurance}
              </span>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 justify-end">
                ↑ 4.5%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. COACH'S SCOUTING & DEVELOPMENT NOTE */}
      <div className="w-full bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              MV
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
              Coach Marcus Evaluation
            </h4>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Logged 2d ago</span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-['Inter']">
            "{activeAthlete.scoutingNotes}"
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={handleExportPDF}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
          >
            <FileDown className="w-4 h-4 text-slate-500" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => setIsNewTestModalOpen(true)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Test</span>
          </button>
        </div>
      </div>

      {/* 5. QUICK SWITCH ROSTER CAROUSEL */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-['Plus_Jakarta_Sans']">
            Compare Squad Members
          </span>
          <span className="text-[11px] text-blue-600 font-bold">
            {ATHLETES_DATA.length} Tracked
          </span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          {ATHLETES_DATA.map((ath) => {
            const isCurrent = ath.id === activeAthlete.id;
            return (
              <div
                key={ath.id}
                onClick={() => {
                  setActiveAthlete(ath);
                  onShowToast('Athlete Switched', `Viewing telemetry for ${ath.name}`, 'info');
                }}
                className={`flex flex-col items-center shrink-0 w-24 p-2.5 rounded-2xl text-center cursor-pointer transition-all border ${
                  isCurrent
                    ? 'bg-blue-50/70 border-blue-500 shadow-xs'
                    : 'bg-white border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <div className="relative">
                  <img
                    src={ath.avatar}
                    alt={ath.name}
                    className="w-11 h-11 rounded-full object-cover shadow-xs"
                  />
                  {isCurrent && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500 rounded-full ring-2 ring-white" />
                  )}
                </div>
                <span className="text-xs font-bold text-slate-900 mt-1.5 truncate w-full font-['Plus_Jakarta_Sans']">
                  {ath.name.split(' ')[0]}
                </span>
                <span className="text-[10px] text-blue-700 font-bold tabular-nums">
                  {ath.position.slice(0, 3).toUpperCase()} · {ath.overallRating}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Test Modal */}
      {isNewTestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsNewTestModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl z-10 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                  Log New Biometric Assessment
                </h3>
                <p className="text-xs text-slate-500">{activeAthlete.name} · {activeAthlete.team}</p>
              </div>
              <button
                onClick={() => setIsNewTestModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Speed Index (0-100)</label>
                  <input
                    type="number"
                    value={newTestValues.speed}
                    onChange={(e) => setNewTestValues({ ...newTestValues, speed: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl tabular-nums font-mono focus:outline-blue-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Agility Index (0-100)</label>
                  <input
                    type="number"
                    value={newTestValues.agility}
                    onChange={(e) => setNewTestValues({ ...newTestValues, agility: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl tabular-nums font-mono focus:outline-blue-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Technique (0-100)</label>
                  <input
                    type="number"
                    value={newTestValues.technique}
                    onChange={(e) => setNewTestValues({ ...newTestValues, technique: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl tabular-nums font-mono focus:outline-blue-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Endurance (0-100)</label>
                  <input
                    type="number"
                    value={newTestValues.endurance}
                    onChange={(e) => setNewTestValues({ ...newTestValues, endurance: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl tabular-nums font-mono focus:outline-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Coach Observation Notes</label>
                <textarea
                  rows={3}
                  value={newTestValues.coachNotes}
                  onChange={(e) => setNewTestValues({ ...newTestValues, coachNotes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-blue-600 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setIsNewTestModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewTest}
                className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                Save Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
