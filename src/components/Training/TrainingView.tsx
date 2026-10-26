import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  PlusCircle,
  Users,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Droplets,
  BookOpen,
  Activity,
  Heart,
  Shield,
  MapPin,
  ChevronRight,
  X,
  Dumbbell,
  Check,
} from 'lucide-react';
import { TRAINING_SESSIONS, ATHLETES_DATA } from '../../data/mockData';
import { Drill, TrainingSession } from '../../types/sports';

interface TrainingViewProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning') => void;
}

export const TrainingView: React.FC<TrainingViewProps> = ({ onShowToast }) => {
  const [selectedDay, setSelectedDay] = useState<number>(21);
  const [sessions, setSessions] = useState<TrainingSession[]>(TRAINING_SESSIONS);

  const activeSession = sessions.find((s) => s.dateNumber === selectedDay) || sessions[0];

  // Interactive Stopwatch Timer state
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isBiometricsModalOpen, setIsBiometricsModalOpen] = useState(false);

  // Attendance state for squad members
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'present' | 'excused' | 'absent'>>({
    'leo-sterling': 'present',
    'ethan-vance': 'present',
    'priya-sharma': 'present',
    'marcus-rivera': 'present',
    'tyler-chen': 'excused',
    'samira-patel': 'present',
  });

  // Biometrics input form
  const [biometricsForm, setBiometricsForm] = useState({
    athleteName: 'Leo Sterling',
    heartRate: '168 bpm',
    rpeExertion: '8.5 / 10',
    lactateSplit: '3.8 mmol/L',
  });

  // Stopwatch effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const toggleDrillCompletion = (drillId: string) => {
    setSessions((prev) =>
      prev.map((s) => ({
        ...s,
        drills: s.drills.map((d) => (d.id === drillId ? { ...d, completed: !d.completed } : d)),
      }))
    );
    const drill = activeSession.drills.find((d) => d.id === drillId);
    if (drill?.completed) {
      onShowToast('Drill Re-opened', `Set "${drill.title}" back in progress`, 'info');
    } else {
      onShowToast('Drill Completed', `Marked "${drill?.title}" finished for the session`, 'success');
    }
  };

  const handleStartTimer = () => {
    setIsTimerRunning(!isTimerRunning);
    if (!isTimerRunning) {
      onShowToast('Session Clock Running', 'Tactical interval stopwatch started', 'info');
    }
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
    onShowToast('Timer Reset', 'Session stopwatch returned to 00:00', 'info');
  };

  const handleSaveBiometrics = () => {
    setIsBiometricsModalOpen(false);
    onShowToast(
      'Biometrics Logged',
      `Telemetry recorded: HR ${biometricsForm.heartRate}, RPE ${biometricsForm.rpeExertion}`,
      'success'
    );
  };

  return (
    <div className="flex flex-col w-full pb-20 max-w-5xl mx-auto px-4 sm:px-6 space-y-5">
      {/* Header & Quick Action */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider font-['Plus_Jakarta_Sans']">
            Coach Tactical Hub
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans'] truncate">
            Training Workspace
          </h1>
        </div>
        <button
          onClick={() => onShowToast('New Session Blueprint', 'Opening tactical session architect', 'info')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-['Plus_Jakarta_Sans'] shadow-sm active:scale-95 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Session</span>
        </button>
      </div>

      {/* Date Ribbon Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { day: 'Mon', num: 20 },
          { day: 'Tue · Today', num: 21, isToday: true },
          { day: 'Wed', num: 22 },
          { day: 'Thu', num: 23 },
          { day: 'Fri', num: 24 },
          { day: 'Sat', num: 25 },
        ].map((item) => {
          const isSelected = selectedDay === item.num;
          return (
            <button
              key={item.num}
              onClick={() => setSelectedDay(item.num)}
              className={`flex flex-col items-center justify-center min-w-[62px] py-2 px-2 rounded-2xl transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                {item.day}
              </span>
              <span className="text-base font-extrabold font-['Plus_Jakarta_Sans'] tabular-nums leading-tight">
                {item.num}
              </span>
              {item.isToday && (
                <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? 'bg-teal-300' : 'bg-blue-600'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Featured Session Card: Today's Active Session */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-bold uppercase tracking-wider font-['Plus_Jakarta_Sans'] border border-teal-200">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse" />
              Starts in 45m
            </span>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold font-['Plus_Jakarta_Sans']">
              High Intensity
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-400 uppercase">
            {activeSession.squad}
          </span>
        </div>

        <h2 className="text-base sm:text-lg font-bold font-['Plus_Jakarta_Sans'] text-slate-900 leading-snug">
          {activeSession.title}
        </h2>

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-teal-600" />
            <span className="font-semibold text-slate-900">{activeSession.athleteCount} Athletes</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>{activeSession.timeRange}</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span className="truncate">{activeSession.location}</span>
          </div>
        </div>

        {/* Core Focus Block */}
        <div className="p-3 rounded-xl bg-slate-50 text-slate-700 text-xs border border-slate-100 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-800 font-bold uppercase text-[10px] tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Core Focus</span>
          </div>
          <p className="leading-relaxed font-['Inter']">
            {activeSession.focus}
          </p>
        </div>

        {/* Visual Tactical Pitch Preview */}
        {activeSession.pitchImage && (
          <div className="relative w-full h-32 rounded-xl overflow-hidden bg-slate-900 shadow-inner flex items-center justify-center">
            <img
              src={activeSession.pitchImage}
              alt="Tactical Pitch"
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
              <div className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-sm flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-blue-600" />
                <span className="text-[11px] font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                  Tactical Pitch 3 Layout Active
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Attendance Bar */}
        <div
          onClick={() => setIsAttendanceModalOpen(true)}
          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 font-['Plus_Jakarta_Sans'] leading-tight">
                {activeSession.confirmedAttendance} / {activeSession.totalRoster} Confirmed Present
              </p>
              <span className="text-[11px] text-slate-500">
                {activeSession.excusedCount} Excused Medical Check · Tap to manage
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-bold font-mono tabular-nums">
            89% Roster
          </span>
        </div>

        {/* Interactive Stopwatch Timer Dock */}
        <div className="p-3 rounded-xl bg-[#0F172A] text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm border border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Session Timer
              </span>
              <span className="text-2xl font-extrabold font-mono tabular-nums text-white">
                {formatTimer(timerSeconds)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleStartTimer}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold font-['Plus_Jakarta_Sans'] flex items-center justify-center gap-1.5 transition-colors shadow-xs ${
                isTimerRunning
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isTimerRunning ? 'Pause Timer' : 'Start Session Timer'}</span>
            </button>
            <button
              onClick={handleResetTimer}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => onShowToast('Drill Plan Loaded', 'Displaying tactical drills on Pitch 3', 'info')}
            className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold font-['Plus_Jakarta_Sans'] flex items-center justify-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>View Drill Plan</span>
          </button>
          <button
            onClick={() => setIsBiometricsModalOpen(true)}
            className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold font-['Plus_Jakarta_Sans'] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Activity className="w-4 h-4 text-teal-600" />
            <span>Log Biometrics</span>
          </button>
        </div>
      </div>

      {/* Squad Readiness Metrics (4 Mini-Cards) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-['Plus_Jakarta_Sans']">
            Squad Readiness Metrics
          </h3>
          <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
            Sync: 12m ago
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Readiness */}
          <div className="p-3.5 rounded-2xl bg-white shadow-xs border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Readiness</span>
              <Activity className="w-4 h-4 text-teal-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] tabular-nums">
                {activeSession.readiness}%
              </span>
              <span className="text-[10px] font-bold text-teal-700">Optimal</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-teal-600 rounded-full" style={{ width: `${activeSession.readiness}%` }} />
            </div>
          </div>

          {/* Fatigue Risk */}
          <div className="p-3.5 rounded-2xl bg-white shadow-xs border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Fatigue Risk</span>
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-red-600 font-['Plus_Jakarta_Sans'] tabular-nums">
                {activeSession.fatigueRiskCount}
              </span>
              <span className="text-[10px] font-bold text-red-600">Athletes</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-red-600 rounded-full" style={{ width: '20%' }} />
            </div>
          </div>

          {/* Hydration Target */}
          <div className="p-3.5 rounded-2xl bg-white shadow-xs border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Hydration</span>
              <Droplets className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] tabular-nums">
                {activeSession.hydrationRate}%
              </span>
              <span className="text-[10px] font-bold text-blue-600">+3% wk</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${activeSession.hydrationRate}%` }} />
            </div>
          </div>

          {/* Attendance Rate */}
          <div className="p-3.5 rounded-2xl bg-white shadow-xs border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Attendance</span>
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans'] tabular-nums">
                {activeSession.attendanceTarget}%
              </span>
              <span className="text-[10px] font-bold text-teal-700">Target</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-teal-600 rounded-full" style={{ width: `${activeSession.attendanceTarget}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Drill Modules Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
              Session Drill Modules
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold font-mono">
              3 Drills · 60m Total
            </span>
          </div>
          <button
            onClick={() => onShowToast('Reorder Mode Active', 'Drag handle enabled on drill blocks', 'info')}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            Reorder
          </button>
        </div>

        <div className="space-y-2.5">
          {activeSession.drills.map((drill) => (
            <div
              key={drill.id}
              className={`p-4 rounded-2xl bg-white shadow-xs border transition-all ${
                drill.completed
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => toggleDrillCompletion(drill.id)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs cursor-pointer transition-colors ${
                      drill.completed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
                    title="Toggle Completion"
                  >
                    {drill.completed ? <Check className="w-4 h-4" /> : drill.number}
                  </div>
                  <div>
                    <h4
                      className={`text-xs sm:text-sm font-bold font-['Plus_Jakarta_Sans'] ${
                        drill.completed ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {drill.title}
                    </h4>
                    <span className="text-[11px] text-slate-500">{drill.subtitle}</span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                    drill.intensity === 'High Intensity'
                      ? 'bg-red-50 text-red-700'
                      : drill.intensity === 'Physical'
                      ? 'bg-teal-50 text-teal-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {drill.intensity}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-2 text-slate-500 text-xs">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span className="tabular-nums font-mono">{drill.duration} mins</span>
                </span>
                <span>·</span>
                <span>{drill.setsOrReps}</span>
                <span>·</span>
                <span className="font-semibold text-slate-700">{drill.category}</span>
              </div>

              <div className="mt-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <img
                  src={drill.thumbnail}
                  alt={drill.title}
                  className="w-14 h-11 rounded-lg object-cover shrink-0"
                />
                <p className="text-xs text-slate-600 leading-snug">
                  {drill.instructions}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Scheduled Sessions */}
      <div className="space-y-2 pt-2">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-['Plus_Jakarta_Sans'] px-1">
          Upcoming Scheduled Sessions
        </h3>
        <div className="space-y-2">
          {sessions.slice(1).map((s) => (
            <div
              key={s.id}
              onClick={() => {
                setSelectedDay(s.dateNumber);
                onShowToast('Session Selected', `Switched to ${s.title}`, 'info');
              }}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-white shadow-xs border border-slate-200/80 hover:border-blue-300 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold uppercase leading-none">{s.day}</span>
                  <span className="text-sm font-extrabold font-['Plus_Jakarta_Sans'] leading-tight tabular-nums">
                    {s.dateNumber}
                  </span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold font-['Plus_Jakarta_Sans'] text-slate-900 truncate">
                    {s.title}
                  </h4>
                  <span className="text-[11px] text-slate-500 truncate block">
                    {s.timeRange} · {s.location}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Modal */}
      {isAttendanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsAttendanceModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl z-10 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                  Squad Attendance Roll
                </h3>
                <span className="text-xs text-slate-500">U19 Football Squad · Pitch 3</span>
              </div>
              <button
                onClick={() => setIsAttendanceModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {ATHLETES_DATA.map((ath) => {
                const status = attendanceMap[ath.id] || 'present';
                return (
                  <div
                    key={ath.id}
                    className="p-2.5 rounded-xl border border-slate-200 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={ath.avatar} alt={ath.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-bold text-slate-900 leading-tight">{ath.name}</p>
                        <span className="text-[10px] text-slate-400">{ath.position}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[11px]">
                      {(['present', 'excused', 'absent'] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => setAttendanceMap({ ...attendanceMap, [ath.id]: s })}
                          className={`px-2 py-1 rounded-lg font-semibold capitalize transition-colors ${
                            status === s
                              ? s === 'present'
                                ? 'bg-emerald-600 text-white'
                                : s === 'excused'
                                ? 'bg-amber-600 text-white'
                                : 'bg-red-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setIsAttendanceModalOpen(false);
                  onShowToast('Attendance Saved', 'Squad presence synced with coaching log', 'success');
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
              >
                Save Attendance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Biometrics Modal */}
      {isBiometricsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsBiometricsModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                  Log Pitch Biometrics
                </h3>
                <span className="text-xs text-slate-500">Real-time physiological load monitor</span>
              </div>
              <button
                onClick={() => setIsBiometricsModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Athlete</label>
                <select
                  value={biometricsForm.athleteName}
                  onChange={(e) => setBiometricsForm({ ...biometricsForm, athleteName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-blue-600"
                >
                  {ATHLETES_DATA.map((a) => (
                    <option key={a.id} value={a.name}>
                      {a.name} ({a.position})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Heart Rate (Peak)</label>
                  <input
                    type="text"
                    value={biometricsForm.heartRate}
                    onChange={(e) => setBiometricsForm({ ...biometricsForm, heartRate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl tabular-nums font-mono focus:outline-blue-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">RPE Exertion (1-10)</label>
                  <input
                    type="text"
                    value={biometricsForm.rpeExertion}
                    onChange={(e) => setBiometricsForm({ ...biometricsForm, rpeExertion: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl tabular-nums font-mono focus:outline-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Lactate / Threshold Split</label>
                <input
                  type="text"
                  value={biometricsForm.lactateSplit}
                  onChange={(e) => setBiometricsForm({ ...biometricsForm, lactateSplit: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl tabular-nums font-mono focus:outline-blue-600"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setIsBiometricsModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBiometrics}
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
              >
                Record Telemetry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
