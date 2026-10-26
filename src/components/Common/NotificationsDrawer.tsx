import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, AlertTriangle, Calendar, Award, Check } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  type: 'alert' | 'tournament' | 'combine';
}

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (targetView: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'High Fatigue Flag: 2 Athletes',
      desc: 'Leo Sterling & Tyler Chen exceed 85% weekly anaerobic load. Recommended recovery protocol before State Finals.',
      time: '12m ago',
      unread: true,
      type: 'alert',
    },
    {
      id: 'notif-2',
      title: 'Registration Closing: All-State Youth Championship',
      desc: 'Only 8 slots remaining in U19 Boys tier. Final roster submission closes in 48 hours.',
      time: '1h ago',
      unread: true,
      type: 'tournament',
    },
    {
      id: 'notif-3',
      title: 'New Scout Invitation: National Combine',
      desc: 'Marcus Thorne requested permission to observe sprint trials at Olympic Park next weekend.',
      time: '3h ago',
      unread: false,
      type: 'combine',
    },
    {
      id: 'notif-4',
      title: 'Biometric Test Validated',
      desc: 'Priya Sharma 100m sprint laser gate logged at 11.42s PB (ranked #2 in State).',
      time: 'Yesterday',
      unread: false,
      type: 'combine',
    },
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full max-w-sm bg-white h-full shadow-2xl border-l border-slate-200 z-10 flex flex-col pt-safe pb-safe"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                  Coach Notifications
                </h3>
                <span className="text-[11px] text-slate-500">
                  {notifications.filter((n) => n.unread).length} unread updates
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={markAllRead}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 p-1.5 rounded"
              >
                Mark all read
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.type === 'alert') onSelectAction('training');
                  else if (item.type === 'tournament') onSelectAction('tournaments');
                  else onSelectAction('network');
                  onClose();
                }}
                className={`p-3 rounded-xl transition-all cursor-pointer hover:bg-slate-50 ${
                  item.unread ? 'bg-blue-50/40 border border-blue-100/80' : ''
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      item.type === 'alert'
                        ? 'bg-amber-100 text-amber-700'
                        : item.type === 'tournament'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {item.type === 'alert' && <AlertTriangle className="w-4 h-4" />}
                    {item.type === 'tournament' && <Calendar className="w-4 h-4" />}
                    {item.type === 'combine' && <Award className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {item.title}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono tabular-nums shrink-0 ml-1">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/50">
            <button
              onClick={onClose}
              className="w-full py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
