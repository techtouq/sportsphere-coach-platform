import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Search,
  CheckCircle2,
  Bookmark,
  Share2,
  Copy,
  Check,
  Send,
  MessageSquare,
  Shield,
  ChevronDown,
  Building2,
  GraduationCap,
  Sparkles,
  MapPin,
  X,
  UserPlus,
} from 'lucide-react';
import { NETWORK_CONNECTIONS } from '../../data/mockData';
import { NetworkConnection } from '../../types/sports';

interface NetworkViewProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning') => void;
}

export const NetworkView: React.FC<NetworkViewProps> = ({ onShowToast }) => {
  const [connections, setConnections] = useState<NetworkConnection[]>(NETWORK_CONNECTIONS);
  const [activeTab, setActiveTab] = useState<'all' | 'athlete' | 'coach' | 'scout' | 'academy'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState<NetworkConnection | null>(null);
  const [messageText, setMessageText] = useState('');

  const pendingRequests = connections.filter((c) => c.status === 'pending');

  const handleAccept = (id: string) => {
    setConnections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'connected' } : c))
    );
    const conn = connections.find((c) => c.id === id);
    onShowToast('Connection Accepted', `Added ${conn?.name} to your verified network`, 'success');
  };

  const handleDecline = (id: string) => {
    setConnections((prev) => prev.filter((c) => c.id !== id));
    onShowToast('Request Dismissed', 'Connection request removed', 'info');
  };

  const handleCopyInvite = () => {
    navigator.clipboard?.writeText('https://sportsphere.pro/invite/coach-marcus-vance');
    setIsCopied(true);
    onShowToast('Invite Link Copied', 'Share URL copied to clipboard', 'success');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSendMessage = () => {
    if (!messageRecipient || !messageText.trim()) return;
    onShowToast('Message Sent', `Dispatched to ${messageRecipient.name}`, 'success');
    setMessageRecipient(null);
    setMessageText('');
  };

  const filteredConnections = connections.filter((c) => {
    if (activeTab !== 'all' && c.type !== activeTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.organization.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full pb-20 max-w-5xl mx-auto px-4 sm:px-6 space-y-4">
      {/* Network Header */}
      <div className="pt-2 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans']">
            Scouting & Pro Network
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Connect, scout, and collaborate across high-performance sports
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 text-[11px] font-bold">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          <span>Live Hub</span>
        </div>
      </div>

      {/* Network Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 text-xs">
        {[
          { key: 'all', label: 'All (1.4k)' },
          { key: 'athlete', label: 'Athletes & Prospects' },
          { key: 'coach', label: 'Coaches' },
          { key: 'scout', label: 'Scouts & Evaluators' },
          { key: 'academy', label: 'Sports Academies' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3.5 py-1.5 rounded-full font-semibold shrink-0 transition-all ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Quick Filter Bar */}
      <div className="bg-white p-3 rounded-2xl shadow-xs border border-slate-200/80 space-y-2.5">
        <div className="relative flex items-center bg-slate-50 rounded-xl px-3 border border-slate-200/60">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, sport, specialization, club..."
            className="w-full bg-transparent py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => setSearchQuery('Prospect')}
            className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold shrink-0 hover:bg-blue-100 transition-colors"
          >
            Uncommitted Prospects
          </button>
          <button
            onClick={() => setSearchQuery('Academy')}
            className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold shrink-0 hover:bg-slate-200 transition-colors"
          >
            Verified Academies
          </button>
          <button
            onClick={() => onShowToast('Location Filter', 'Searching within 50 miles radius', 'info')}
            className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold shrink-0 hover:bg-slate-200 transition-colors"
          >
            Within 50 miles
          </button>
        </div>
      </div>

      {/* Pending Connection Requests Widget */}
      {pendingRequests.length > 0 && (
        <section className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            className="p-3.5 bg-slate-50 flex items-center justify-between cursor-pointer border-b border-slate-100"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-extrabold font-mono tabular-nums">
                {pendingRequests.length}
              </span>
              <span className="font-bold text-xs sm:text-sm text-slate-900 font-['Plus_Jakarta_Sans']">
                Pending Connection Requests
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform ${isAccordionOpen ? 'rotate-180' : ''}`}
            />
          </div>

          {isAccordionOpen && (
            <div className="p-3 space-y-3">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex flex-col gap-3"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={req.avatar}
                      alt={req.name}
                      className="w-11 h-11 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-900 truncate font-['Plus_Jakarta_Sans']">
                          {req.name}
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono tabular-nums">
                          {req.timeAgo}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 truncate">{req.role} · {req.organization}</p>
                      {req.note && (
                        <p className="text-[11px] text-teal-700 mt-0.5 truncate">{req.note}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => handleDecline(req.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-200/80 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAccept(req.id)}
                      className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-['Plus_Jakarta_Sans'] shadow-xs transition-colors"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Professional Profile Cards Feed */}
      <div className="space-y-3">
        {filteredConnections
          .filter((c) => c.status === 'connected')
          .map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {item.avatar ? (
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-13 h-13 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
                    />
                  ) : (
                    <div className="w-13 h-13 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-slate-900 font-['Plus_Jakarta_Sans'] truncate">
                        {item.name}
                      </h3>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-600 shrink-0" />
                    </div>
                    <p className="text-xs font-semibold text-blue-700 truncate">{item.role}</p>
                    <p className="text-[11px] text-slate-500 truncate">{item.organization}</p>
                  </div>
                </div>

                <button
                  onClick={() => onShowToast('Profile Bookmarked', `Saved ${item.name} to scout dossier`, 'info')}
                  className="p-1 rounded text-slate-400 hover:text-blue-600 transition-colors"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>

              {/* Stats Grid if available */}
              {item.stats && (
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      {item.stats.primaryLabel}
                    </span>
                    <span className="font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                      {item.stats.primary}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      {item.stats.secondaryLabel}
                    </span>
                    <span className="font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                      {item.stats.secondary}
                    </span>
                  </div>
                </div>
              )}

              {item.specialty && (
                <div className="p-2.5 rounded-xl bg-blue-50/40 border border-blue-100 text-xs text-slate-700">
                  <span className="font-bold text-blue-800">Specialty: </span>
                  {item.specialty}
                </div>
              )}

              {/* Card Actions */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    setMessageRecipient(item);
                  }}
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-['Plus_Jakarta_Sans'] flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Message</span>
                </button>
                <button
                  onClick={() => onShowToast('Scout Dossier', `Exporting dossier for ${item.name}`, 'info')}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                >
                  View Profile
                </button>
              </div>
            </article>
          ))}
      </div>

      {/* Bottom Quick Action: Invite with Share Link */}
      <section className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold font-['Plus_Jakarta_Sans'] text-slate-900">
              Invite Athlete or Coach to Network
            </h3>
            <p className="text-xs text-slate-500">
              Expand your scouting circle with verified credentials.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 bg-slate-50 px-3 py-2 rounded-xl text-xs text-slate-600 font-mono select-all truncate border border-slate-200/80">
            sportsphere.pro/invite/coach-marcus-vance
          </div>
          <button
            onClick={handleCopyInvite}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-['Plus_Jakarta_Sans'] flex items-center gap-1.5 shadow-xs active:scale-95 transition-all shrink-0"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{isCopied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-400 text-center font-['Inter']">
          FERPA & SafeSport privacy-compliant invitation pipeline.
        </p>
      </section>

      {/* Direct Messaging Modal */}
      {messageRecipient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMessageRecipient(null)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                  Message {messageRecipient.name}
                </h3>
                <p className="text-xs text-slate-500">{messageRecipient.role}</p>
              </div>
              <button
                onClick={() => setMessageRecipient(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              rows={4}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Hi, I would like to discuss scouting evaluation protocols for upcoming regional qualifiers..."
              className="w-full p-3 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-blue-600 font-['Inter']"
            />

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMessageRecipient(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Direct Message</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
