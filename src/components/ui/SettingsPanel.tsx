import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, HelpCircle, Eye, Grid, Zap } from 'lucide-react';

export interface UserSettings {
  animationSpeed: number; // 0 (instant) to 2 (fast)
  showLabels: boolean;
  showGrid: boolean;
}

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
  onReplayGuide: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onReplayGuide,
}) => {
  
  const handleToggleLabels = () => {
    onUpdateSettings({ ...settings, showLabels: !settings.showLabels });
  };

  const handleToggleGrid = () => {
    onUpdateSettings({ ...settings, showGrid: !settings.showGrid });
  };

  const handleSpeedChange = (speed: number) => {
    onUpdateSettings({ ...settings, animationSpeed: speed });
  };

  const handleReset = () => {
    onUpdateSettings({
      animationSpeed: 1.0,
      showLabels: true,
      showGrid: true,
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        
        {/* Settings Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-sm glass-panel border border-cyan-500/25 glow-cyan p-6 bg-slate-950/90 text-left space-y-6"
        >
          {/* Header */}
          <div className="flex justify-between items-center pb-3 border-b border-white/5">
            <h2 className="text-base font-extrabold font-heading text-slate-100 flex items-center gap-2">
              ⚙️ Preference Settings
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 cursor-pointer transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4">
            
            {/* 1. Animation Speed Slider */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold flex items-center gap-1.5">
                <Zap size={12} className="text-amber-400" />
                Transition Speed
              </label>
              <div className="grid grid-cols-4 gap-1 bg-slate-900/50 p-1 rounded-lg border border-white/5 font-mono text-[9px] font-bold">
                {[
                  { label: 'Instant', value: 0 },
                  { label: 'Slow', value: 0.4 },
                  { label: 'Normal', value: 1.0 },
                  { label: 'Fast', value: 1.8 }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSpeedChange(option.value)}
                    className={`py-1.5 rounded transition-all cursor-pointer ${
                      settings.animationSpeed === option.value
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <span className="text-[9px] text-slate-500 font-mono block">
                Adjusts statevector rotation animation speed on the Bloch sphere.
              </span>
            </div>

            {/* 2. Pole Labels Toggle */}
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <div className="space-y-0.5 pr-4 text-left">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold flex items-center gap-1.5">
                  <Eye size={12} className="text-cyan-400" />
                  Show Pole Labels
                </span>
                <span className="text-[9px] text-slate-500 font-mono block leading-normal">
                  Renders basis markers (|0⟩, |1⟩, X, Y) on sphere poles.
                </span>
              </div>
              <button
                onClick={handleToggleLabels}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.showLabels ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.showLabels ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 3. Wireframe Grid Toggle */}
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <div className="space-y-0.5 pr-4 text-left">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold flex items-center gap-1.5">
                  <Grid size={12} className="text-indigo-400" />
                  Show Grid Lines
                </span>
                <span className="text-[9px] text-slate-500 font-mono block leading-normal">
                  Draws longitudinal meridians and equator lines on sphere.
                </span>
              </div>
              <button
                onClick={handleToggleGrid}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.showGrid ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.showGrid ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 4. Onboarding Guide trigger */}
            <button
              onClick={() => {
                onClose();
                onReplayGuide();
              }}
              className="w-full py-2 rounded-lg border border-cyan-500/20 text-cyan-400 bg-cyan-950/15 font-bold flex items-center justify-center gap-1.5 hover:bg-cyan-950/30 cursor-pointer text-xs transition-colors"
            >
              <HelpCircle size={14} />
              Replay Workspace Guide
            </button>
          </div>

          {/* Footer controls: Reset preferences */}
          <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-6">
            <span className="text-[9px] text-slate-500 font-mono">QubitScope Preferences</span>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-[10px] text-rose-400 hover:text-rose-300 font-semibold cursor-pointer font-mono"
            >
              <RotateCcw size={10} />
              Reset Settings
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default SettingsPanel;
