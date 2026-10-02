import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Flame,
  Megaphone,
  X,
  ExternalLink,
} from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notifications, dismissNotification, setActiveTab, setLatestReceipt, setIsReceiptModalOpen } = useApp();

  // Request browser Notification permission on mount if available
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
      }
    }
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {notifications.map((n) => {
        const getIcon = () => {
          switch (n.type) {
            case 'withdrawal_approved':
              return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
            case 'high_value_task':
              return <Sparkles className="w-5 h-5 text-blue-400 shrink-0" />;
            case 'streak_reward':
              return <Flame className="w-5 h-5 text-amber-400 shrink-0" />;
            case 'advertiser_deposit':
              return <Megaphone className="w-5 h-5 text-purple-400 shrink-0" />;
            default:
              return <Bell className="w-5 h-5 text-emerald-400 shrink-0" />;
          }
        };

        const handleAction = () => {
          if (n.actionTab) {
            setActiveTab(n.actionTab);
          }
          dismissNotification(n.id);
        };

        return (
          <div
            key={n.id}
            className="pointer-events-auto bg-slate-900/95 border border-slate-700/80 backdrop-blur-md p-4 rounded-xl shadow-2xl flex items-start gap-3 transition-all animate-in slide-in-from-right duration-300"
          >
            <div className="p-1 rounded-lg bg-slate-800/80">{getIcon()}</div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-white">{n.title}</h5>
                <span className="text-[10px] text-slate-500 font-mono">{n.timestamp}</span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">{n.message}</p>

              {n.actionLabel && (
                <button
                  onClick={handleAction}
                  className="mt-1 text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>{n.actionLabel}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => dismissNotification(n.id)}
              className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
