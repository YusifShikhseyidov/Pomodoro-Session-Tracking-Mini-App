import { useState, useEffect, useRef, useCallback } from 'react';
import { TimerMode, TimerState, Settings, Session } from '../types';
import { playNotificationSound } from '../utils/sound';
import { saveSession } from '../utils/storage';

export const useTimer = (settings: Settings) => {
  const [mode, setMode] = useState<TimerMode>(TimerMode.WORK);
  const [state, setState] = useState<TimerState>(TimerState.IDLE);
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [sessions, setSessions] = useState<Session[]>([]);

  const endTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // Sync timeLeft when settings change if IDLE
  useEffect(() => {
    if (state === TimerState.IDLE) {
      const duration = 
        mode === TimerMode.WORK ? settings.workDuration :
        mode === TimerMode.SHORT_BREAK ? settings.shortBreakDuration :
        settings.longBreakDuration;
      setTimeLeft(duration * 60);
    }
  }, [settings, mode, state]);

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setState(TimerState.IDLE);
    const duration = 
      newMode === TimerMode.WORK ? settings.workDuration :
      newMode === TimerMode.SHORT_BREAK ? settings.shortBreakDuration :
      settings.longBreakDuration;
    setTimeLeft(duration * 60);
  }, [settings]);

  const handleComplete = useCallback(() => {
    playNotificationSound();
    
    // Save session if it was work
    if (mode === TimerMode.WORK) {
      const newSession: Session = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        duration: settings.workDuration * 60,
        mode: TimerMode.WORK,
        completed: true
      };
      setSessions(prev => [...prev, newSession]);
      saveSession(newSession);
    }

    // Determine next mode
    if (mode === TimerMode.WORK) {
      // Simple logic: After work, go to short break. 
      // In a real app, track cycle count for long break.
      const workSessionsToday = sessions.filter(s => 
        s.mode === TimerMode.WORK && 
        new Date(s.timestamp).toDateString() === new Date().toDateString()
      ).length + 1; // +1 because we just finished one

      if (workSessionsToday % 4 === 0) {
        switchMode(TimerMode.LONG_BREAK);
        if (settings.autoStartBreaks) startTimer();
      } else {
        switchMode(TimerMode.SHORT_BREAK);
        if (settings.autoStartBreaks) startTimer();
      }
    } else {
      switchMode(TimerMode.WORK);
      if (settings.autoStartWork) startTimer();
    }
  }, [mode, settings, sessions, switchMode]);

  const tick = useCallback(() => {
    if (!endTimeRef.current) return;
    
    const now = Date.now();
    const remaining = Math.ceil((endTimeRef.current - now) / 1000);

    if (remaining <= 0) {
      setTimeLeft(0);
      setState(TimerState.IDLE);
      endTimeRef.current = null;
      handleComplete();
    } else {
      setTimeLeft(remaining);
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [handleComplete]);

  const startTimer = useCallback(() => {
    setState(TimerState.RUNNING);
    endTimeRef.current = Date.now() + timeLeft * 1000;
    rafRef.current = requestAnimationFrame(tick);
  }, [timeLeft, tick]);

  const pauseTimer = useCallback(() => {
    setState(TimerState.PAUSED);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    endTimeRef.current = null;
  }, []);

  const resetTimer = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    endTimeRef.current = null;
    setState(TimerState.IDLE);
    const duration = 
      mode === TimerMode.WORK ? settings.workDuration :
      mode === TimerMode.SHORT_BREAK ? settings.shortBreakDuration :
      settings.longBreakDuration;
    setTimeLeft(duration * 60);
  }, [mode, settings]);

  // Load initial sessions
  useEffect(() => {
    const stored = localStorage.getItem('focusflow_sessions');
    if (stored) {
      setSessions(JSON.parse(stored));
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return {
    mode,
    state,
    timeLeft,
    sessions,
    switchMode,
    startTimer,
    pauseTimer,
    resetTimer
  };
};
