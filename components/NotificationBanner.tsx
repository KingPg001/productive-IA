import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

interface NotificationBannerProps {
  overdueCount: number;
  dueSoonCount: number;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ overdueCount, dueSoonCount }) => {
  if (overdueCount === 0 && dueSoonCount === 0) return null;

  return (
    <div className="mb-6 flex flex-col gap-2">
      {overdueCount > 0 && (
        <div className="bg-red-900/30 border border-red-800/50 rounded-lg p-3 flex items-center gap-3 animate-pulse-slow">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <p className="text-sm text-red-200">
            <span className="font-bold">{overdueCount} Task{overdueCount !== 1 ? 's' : ''} Overdue!</span> Take action now to keep your streak alive.
          </p>
        </div>
      )}
      
      {dueSoonCount > 0 && overdueCount === 0 && (
        <div className="bg-amber-900/30 border border-amber-800/50 rounded-lg p-3 flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-400" />
          <p className="text-sm text-amber-200">
            <span className="font-bold">{dueSoonCount} Task{dueSoonCount !== 1 ? 's' : ''} Due Soon.</span> Finish them within 24 hours.
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationBanner;