import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';
import { Settings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (newSettings: Settings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleChange = (key: keyof Settings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">Settings</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Timer Durations */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Timer (minutes)</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work</label>
                <input 
                  type="number" 
                  value={localSettings.workDuration}
                  onChange={(e) => handleChange('workDuration', Number(e.target.value))}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Break</label>
                <input 
                  type="number" 
                  value={localSettings.shortBreakDuration}
                  onChange={(e) => handleChange('shortBreakDuration', Number(e.target.value))}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Long Break</label>
                <input 
                  type="number" 
                  value={localSettings.longBreakDuration}
                  onChange={(e) => handleChange('longBreakDuration', Number(e.target.value))}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Preferences</h3>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Auto-start Breaks</span>
              <button 
                onClick={() => handleChange('autoStartBreaks', !localSettings.autoStartBreaks)}
                className={`w-11 h-6 flex items-center rounded-full transition-colors ${localSettings.autoStartBreaks ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <span className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${localSettings.autoStartBreaks ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Auto-start Work</span>
              <button 
                onClick={() => handleChange('autoStartWork', !localSettings.autoStartWork)}
                className={`w-11 h-6 flex items-center rounded-full transition-colors ${localSettings.autoStartWork ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <span className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${localSettings.autoStartWork ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-700">Sound Notifications</span>
                {localSettings.soundEnabled ? <Volume2 className="w-4 h-4 text-gray-400" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
              </div>
              <button 
                onClick={() => handleChange('soundEnabled', !localSettings.soundEnabled)}
                className={`w-11 h-6 flex items-center rounded-full transition-colors ${localSettings.soundEnabled ? 'bg-rose-500' : 'bg-gray-300'}`}
              >
                <span className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${localSettings.soundEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
          
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Daily Goal (Sessions)</label>
              <input 
                type="number" 
                value={localSettings.targetSessions}
                onChange={(e) => handleChange('targetSessions', Number(e.target.value))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
              />
            </div>
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};