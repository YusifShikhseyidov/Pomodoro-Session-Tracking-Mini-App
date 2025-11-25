import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, BarChart2, Play, Pause, RotateCcw, Coffee, Brain, Armchair } from 'lucide-react';
import { TimerMode, TimerState, Settings, DEFAULT_SETTINGS } from './types';
import { useTimer } from './hooks/useTimer';
import { SettingsModal } from './components/SettingsModal';
import { StatsPanel } from './components/StatsPanel';
import { AIInsight } from './components/AIInsight';
import { getStoredSettings, saveSettings } from './utils/storage';

function App() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  // Load settings on mount
  useEffect(() => {
    setSettings(getStoredSettings());
  }, []);

  const handleSaveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const {
    mode,
    state,
    timeLeft,
    sessions,
    switchMode,
    startTimer,
    pauseTimer,
    resetTimer
  } = useTimer(settings);

  // Styling based on mode
  const getThemeColor = () => {
    switch (mode) {
      case TimerMode.WORK: return 'text-rose-500';
      case TimerMode.SHORT_BREAK: return 'text-teal-500';
      case TimerMode.LONG_BREAK: return 'text-indigo-500';
    }
  };

  const getBgTheme = () => {
    switch (mode) {
      case TimerMode.WORK: return 'bg-rose-50';
      case TimerMode.SHORT_BREAK: return 'bg-teal-50';
      case TimerMode.LONG_BREAK: return 'bg-indigo-50';
    }
  };

  const getButtonTheme = () => {
    switch (mode) {
      case TimerMode.WORK: return 'bg-rose-500 hover:bg-rose-600 text-white';
      case TimerMode.SHORT_BREAK: return 'bg-teal-500 hover:bg-teal-600 text-white';
      case TimerMode.LONG_BREAK: return 'bg-indigo-500 hover:bg-indigo-600 text-white';
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = (() => {
    const total = (
      mode === TimerMode.WORK ? settings.workDuration :
      mode === TimerMode.SHORT_BREAK ? settings.shortBreakDuration :
      settings.longBreakDuration
    ) * 60;
    return ((total - timeLeft) / total) * 100;
  })();

  const modeLabel = {
    [TimerMode.WORK]: 'Focus Time',
    [TimerMode.SHORT_BREAK]: 'Short Break',
    [TimerMode.LONG_BREAK]: 'Long Break',
  };

  return (
    <div className={`min-h-screen ${getBgTheme()} theme-transition flex flex-col items-center relative`}>
      
      {/* Header */}
      <header className="w-full max-w-3xl p-6 flex justify-between items-center z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getButtonTheme()}`}>
            <Brain className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">FocusFlow</h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsStatsOpen(true)}
            className="p-2 bg-white/50 hover:bg-white rounded-xl text-gray-600 transition-colors"
          >
            <BarChart2 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 bg-white/50 hover:bg-white rounded-xl text-gray-600 transition-colors"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-md mx-auto flex flex-col items-center z-0 flex-1 justify-center px-4 pb-32">
        
        {/* Mode Toggles */}
        <div className="bg-white/60 p-1 rounded-full flex mb-8 shadow-sm backdrop-blur-sm">
          {(Object.keys(TimerMode) as TimerMode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                mode === m ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {m === TimerMode.WORK ? 'Focus' : m === TimerMode.SHORT_BREAK ? 'Short Break' : 'Long Break'}
            </button>
          ))}
        </div>

        {/* Timer Display */}
        <div className="relative mb-8 group">
          {/* Progress Ring */}
          <div className="w-72 h-72 sm:w-80 sm:h-80 relative flex items-center justify-center">
             <svg className="w-full h-full transform -rotate-90" viewBox="0 0 320 320">
                <circle
                  cx="160"
                  cy="160"
                  r="150"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="160"
                  cy="160"
                  r="150"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 150}
                  strokeDashoffset={2 * Math.PI * 150 * (1 - progress / 100)}
                  strokeLinecap="round"
                  className={`${getThemeColor()} transition-all duration-1000 ease-linear`}
                />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-7xl sm:text-8xl font-bold tracking-tighter text-gray-800 tabular-nums`}>
                  {formatTime(timeLeft)}
                </span>
                <span className="text-gray-500 text-lg mt-2 font-medium tracking-wide">
                  {state === TimerState.PAUSED ? 'PAUSED' : modeLabel[mode]}
                </span>
             </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-6 items-center mb-8">
           <button 
             onClick={resetTimer}
             className="p-4 rounded-2xl bg-white text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
           >
             <RotateCcw className="w-6 h-6" />
           </button>

           <button 
             onClick={state === TimerState.RUNNING ? pauseTimer : startTimer}
             className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center shadow-lg transform active:scale-95 transition-all ${getButtonTheme()}`}
           >
             {state === TimerState.RUNNING ? (
               <Pause className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
             ) : (
               <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
             )}
           </button>
           
           {/* Spacer to balance reset button visually */}
           <div className="w-14" />
        </div>

        {/* AI Insight Section */}
        <div className="w-full">
          <AIInsight sessions={sessions} isOpen={true} />
        </div>

      </main>

      {/* Footer / Today's Stats Summary */}
      <div className="fixed bottom-0 w-full p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 flex justify-center items-center gap-8 text-sm text-gray-600 z-20">
        <div className="flex flex-col items-center">
          <span className="font-bold text-gray-900 text-lg">
            {sessions.filter(s => s.mode === TimerMode.WORK && s.completed && new Date(s.timestamp).toDateString() === new Date().toDateString()).length}
            <span className="text-gray-400 font-normal text-sm ml-1">/ {settings.targetSessions}</span>
          </span>
          <span className="text-xs uppercase tracking-wider text-gray-400">Sessions</span>
        </div>
        <div className="w-px h-8 bg-gray-200"></div>
        <div className="flex flex-col items-center">
           <span className="font-bold text-gray-900 text-lg">
             {Math.floor(sessions
               .filter(s => s.mode === TimerMode.WORK && s.completed && new Date(s.timestamp).toDateString() === new Date().toDateString())
               .reduce((acc, curr) => acc + curr.duration, 0) / 60)}
             <span className="text-xs font-normal text-gray-400 ml-1">m</span>
           </span>
           <span className="text-xs uppercase tracking-wider text-gray-400">Focused</span>
        </div>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={settings}
        onSave={handleSaveSettings}
      />

      <StatsPanel
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        sessions={sessions}
      />
    </div>
  );
}

export default App;