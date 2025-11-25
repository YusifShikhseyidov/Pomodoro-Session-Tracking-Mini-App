import { Session, Settings, DEFAULT_SETTINGS } from '../types';

const SESSIONS_KEY = 'focusflow_sessions';
const SETTINGS_KEY = 'focusflow_settings';

export const getStoredSessions = (): Session[] => {
  try {
    const data = localStorage.getItem(SESSIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveSession = (session: Session) => {
  const sessions = getStoredSessions();
  sessions.push(session);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};

export const getStoredSettings = (): Settings => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: Settings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};
