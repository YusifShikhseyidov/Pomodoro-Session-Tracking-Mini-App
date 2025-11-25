import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { getProductivityInsight } from '../services/geminiService';
import { Session } from '../types';

interface AIInsightProps {
  sessions: Session[];
  isOpen: boolean;
}

export const AIInsight: React.FC<AIInsightProps> = ({ sessions, isOpen }) => {
  const [insight, setInsight] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchInsight = async () => {
    setLoading(true);
    const text = await getProductivityInsight(sessions);
    setInsight(text);
    setLoading(false);
    setHasFetched(true);
  };

  // Auto fetch when opened if not fetched yet
  useEffect(() => {
    if (isOpen && !hasFetched && !loading) {
      fetchInsight();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="mt-8 bg-gradient-to-r from-violet-50 to-fuchsia-50 border border-violet-100 rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-2 -mr-2 w-24 h-24 bg-violet-200 rounded-full opacity-20 blur-2xl"></div>
      
      <div className="flex items-start gap-4 relative z-10">
        <div className="p-3 bg-white rounded-xl shadow-sm">
          <Sparkles className="w-6 h-6 text-violet-600" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-800">AI Productivity Insight</h3>
            <button 
              onClick={fetchInsight} 
              disabled={loading}
              className="text-xs flex items-center gap-1 text-violet-600 hover:text-violet-700 font-medium transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          
          <div className="text-gray-600 leading-relaxed text-sm min-h-[40px]">
             {loading ? (
               <span className="animate-pulse">Analyzing your flow...</span>
             ) : (
               insight || "Start your first session to get insights!"
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
