import React, { useState, useEffect } from 'react';
import { Timer, CalendarClock } from 'lucide-react';

interface ExamCountdownProps {
  targetDate: string;
  title: string;
}

const ExamCountdown: React.FC<ExamCountdownProps> = ({ targetDate, title }) => {
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      } else {
        return null; // Time passed
      }
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-900/80 to-blue-900/80 border border-indigo-500/50 rounded-xl p-4 mb-6 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
        <Timer className="w-32 h-32 -mr-8 -mt-8" />
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500/20 p-2 rounded-lg">
            <CalendarClock className="w-6 h-6 text-indigo-300" />
          </div>
          <div>
            <p className="text-xs text-indigo-300 uppercase tracking-wider font-semibold">Next Exam</p>
            <h3 className="text-lg font-bold text-white">{title}</h3>
          </div>
        </div>

        <div className="flex gap-3 text-center">
          <div className="bg-slate-900/60 rounded-lg p-2 min-w-[60px]">
            <div className="text-xl font-bold text-white">{timeLeft.days}</div>
            <div className="text-[10px] text-slate-400 uppercase">Days</div>
          </div>
          <div className="bg-slate-900/60 rounded-lg p-2 min-w-[60px]">
            <div className="text-xl font-bold text-white">{timeLeft.hours}</div>
            <div className="text-[10px] text-slate-400 uppercase">Hrs</div>
          </div>
          <div className="bg-slate-900/60 rounded-lg p-2 min-w-[60px]">
            <div className="text-xl font-bold text-white">{timeLeft.minutes}</div>
            <div className="text-[10px] text-slate-400 uppercase">Mins</div>
          </div>
          <div className="bg-slate-900/60 rounded-lg p-2 min-w-[60px]">
            <div className="text-xl font-bold text-white">{timeLeft.seconds}</div>
            <div className="text-[10px] text-slate-400 uppercase">Secs</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamCountdown;