import React, { useState } from 'react';
import { generateProductivityInsight } from '../services/geminiService';
import { Task, UserStats } from '../types';
import { BrainCircuit, Loader2, RefreshCcw } from 'lucide-react';

interface AIInsightProps {
  tasks: Task[];
  stats: UserStats;
}

const AIInsight: React.FC<AIInsightProps> = ({ tasks, stats }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetInsight = async () => {
    setLoading(true);
    const result = await generateProductivityInsight(tasks, stats);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-xl p-6 mb-8 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-indigo-300">
            <BrainCircuit className="w-6 h-6" />
            <h3 className="font-bold text-lg">Gemini Coach</h3>
          </div>
          
          <button 
            onClick={handleGetInsight}
            disabled={loading}
            className="flex items-center gap-2 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCcw className="w-3 h-3" />}
            {insight ? 'Refresh Insight' : 'Analyze Performance'}
          </button>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-4 border border-indigo-500/20 min-h-[80px] flex items-center">
          {loading ? (
             <div className="flex items-center space-x-2 text-indigo-300 animate-pulse">
                <span>Analyzing your task patterns...</span>
             </div>
          ) : insight ? (
            <p className="text-slate-200 text-sm leading-relaxed italic">
              "{insight}"
            </p>
          ) : (
            <p className="text-slate-500 text-sm">
              Tap the button to generate an AI-powered review of your productivity, streak, and pending tasks.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIInsight;