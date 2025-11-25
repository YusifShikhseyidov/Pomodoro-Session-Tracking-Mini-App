import React, { useMemo } from 'react';
import { Session, TimerMode } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { X, TrendingUp } from 'lucide-react';

interface StatsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: Session[];
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ isOpen, onClose, sessions }) => {
  const statsData = useMemo(() => {
    // Generate last 7 days data
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
      
      // Filter sessions for this day (Work only)
      const dayStart = new Date(d.setHours(0,0,0,0)).getTime();
      const dayEnd = new Date(d.setHours(23,59,59,999)).getTime();
      
      const dayMinutes = sessions
        .filter(s => s.timestamp >= dayStart && s.timestamp <= dayEnd && s.mode === TimerMode.WORK && s.completed)
        .reduce((acc, curr) => acc + curr.duration, 0) / 60;

      days.push({ name: dayStr, minutes: Math.round(dayMinutes) });
    }
    return days;
  }, [sessions]);

  const totalFocusTime = useMemo(() => {
    return Math.floor(sessions
      .filter(s => s.mode === TimerMode.WORK && s.completed)
      .reduce((acc, curr) => acc + curr.duration, 0) / 60);
  }, [sessions]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-bold text-gray-800">Activity Report</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
              <p className="text-sm text-rose-600 font-medium">Total Focus Time</p>
              <p className="text-3xl font-bold text-rose-900">{totalFocusTime}<span className="text-base font-normal text-rose-700 ml-1">mins</span></p>
            </div>
             <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
              <p className="text-sm text-indigo-600 font-medium">Total Sessions</p>
              <p className="text-3xl font-bold text-indigo-900">
                {sessions.filter(s => s.mode === TimerMode.WORK && s.completed).length}
              </p>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-gray-500 mb-4">Focus Time (Last 7 Days)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#F3F4F6'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
                  {statsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 6 ? '#F43F5E' : '#E5E7EB'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
