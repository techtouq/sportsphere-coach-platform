export type SportCategory =
  | 'all'
  | 'football'
  | 'cricket'
  | 'athletics'
  | 'basketball'
  | 'badminton'
  | 'tennis'
  | 'volleyball'
  | 'swimming';

export type TabView =
  | 'overview'
  | 'tournaments'
  | 'radar'
  | 'training'
  | 'rankings'
  | 'highlights'
  | 'network';

export interface Athlete {
  id: string;
  name: string;
  number: string;
  position: string;
  team: string;
  avatar: string;
  age: number;
  overallRating: number;
  rank: number;
  category: 'football' | 'athletics' | 'basketball' | 'cricket';
  isVerified?: boolean;
  biomarkers: {
    speed: number;       // 0-100
    agility: number;     // 0-100
    technique: number;   // 0-100
    consistency: number; // 0-100
    strength: number;    // 0-100
    endurance: number;   // 0-100
  };
  metrics: {
    topSpeed: string;
    pace: number;
    finishingOrPower: number;
    conversionRate: string;
    matchImpact: string;
    matches: number;
    goalsOrMedals: number;
    assistsOrReaction: string;
  };
  lastAssessment: string;
  scoutingNotes: string;
}

export interface Tournament {
  id: string;
  title: string;
  sport: SportCategory;
  level: string; // 'State Level' | 'National Qualifier' | 'District Level'
  tag: string; // 'Sanctioned' | 'Olympic Path' | 'Sponsored'
  urgency: string; // 'Closes in 48h' | 'Deadline: Nov 01 (Open)' | 'Reg Deadline: Nov 10'
  image: string;
  dates: string;
  venue: string;
  location: string;
  eligibility: string;
  division: string;
  fee: string;
  registeredSlots: number;
  maxSlots: number;
  isBookmarked?: boolean;
  scoutPresence: string;
  criteria?: string;
}

export interface Drill {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  intensity: 'High Intensity' | 'Physical' | 'Tactical' | 'Recovery';
  duration: number; // in mins
  setsOrReps: string;
  category: string;
  instructions: string;
  thumbnail: string;
  completed?: boolean;
}

export interface TrainingSession {
  id: string;
  day: string;
  dateNumber: number;
  isToday?: boolean;
  title: string;
  squad: string;
  athleteCount: number;
  timeRange: string;
  location: string;
  focus: string;
  pitchImage: string;
  confirmedAttendance: number;
  totalRoster: number;
  excusedCount: number;
  drills: Drill[];
  readiness: number;
  fatigueRiskCount: number;
  hydrationRate: number;
  attendanceTarget: number;
}

export interface HighlightReel {
  id: string;
  title: string;
  subtitle: string;
  sport: SportCategory;
  videoDuration: string;
  thumbnail: string;
  views: string;
  timestamp: string;
  badge: string;
  is4K?: boolean;
  isBookmarked?: boolean;
  summary: string;
}

export interface NewsBulletin {
  id: string;
  tag: string;
  category: string;
  title: string;
  summary: string;
  readTime: string;
  timestamp: string;
  image?: string;
  isOfficial?: boolean;
  isBookmarked?: boolean;
  fullBody?: string;
}

export interface NetworkConnection {
  id: string;
  name: string;
  role: string;
  organization: string;
  avatar: string;
  mutualCount: number;
  status: 'pending' | 'connected' | 'declined';
  timeAgo: string;
  type: 'coach' | 'scout' | 'athlete' | 'academy';
  sportBadge?: string;
  specialty?: string;
  stats?: {
    primary: string;
    primaryLabel: string;
    secondary: string;
    secondaryLabel: string;
  };
  note?: string;
}
