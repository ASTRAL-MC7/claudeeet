import React from 'react';
import { 
  Sparkles, 
  Zap, 
  Tv, 
  Orbit, 
  CloudRain, 
  Coffee, 
  Moon, 
  Flame, 
  Laugh, 
  Compass, 
  Clock, 
  Users, 
  RotateCcw,
  Sliders,
  Filter
} from 'lucide-react';
import { VIBE_OPTIONS, STREAMING_PLATFORMS } from '../data/movies.ts';
import { VibeFilterState, EnergyLevel, AudienceSetting } from '../types.ts';

interface VibeConsoleProps {
  filters: VibeFilterState;
  setFilters: React.Dispatch<React.SetStateAction<VibeFilterState>>;
  onReset: () => void;
  onSpinTheReel: () => void;
  matchCount: number;
}

export const VibeConsole: React.FC<VibeConsoleProps> = ({
  filters,
  setFilters,
  onReset,
  onSpinTheReel,
  matchCount,
}) => {
  // Map icon names to lucide components
  const getIcon = (name: string) => {
    switch (name) {
      case 'Zap': return <Zap className="w-4 h-4" />;
      case 'Tv': return <Tv className="w-4 h-4" />;
      case 'Orbit': return <Orbit className="w-4 h-4" />;
      case 'CloudRain': return <CloudRain className="w-4 h-4" />;
      case 'Coffee': return <Coffee className="w-4 h-4" />;
      case 'Moon': return <Moon className="w-4 h-4" />;
      case 'Flame': return <Flame className="w-4 h-4" />;
      case 'Laugh': return <Laugh className="w-4 h-4" />;
      case 'Compass': return <Compass className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const handleMoodSelect = (moodId: string) => {
    setFilters(prev => ({
      ...prev,
      mood: prev.mood === moodId && moodId !== 'all' ? 'all' : moodId
    }));
  };

  const handleEnergySelect = (energy: EnergyLevel | 'all') => {
    setFilters(prev => ({ ...prev, energy }));
  };

  const handleAudienceSelect = (audience: AudienceSetting) => {
    setFilters(prev => ({ ...prev, audience }));
  };

  return (
    <div className="bg-[#0B0E17] border-y border-[#1E2333] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header line with match counter and quick reset */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <h2 className="text-xl font-display font-bold text-white tracking-tight">
                Mood & Vibe Matcher
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Select your desired emotional frequency to recalibrate the lounge in real time
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">
              <strong className="text-amber-400">{matchCount}</strong> titles tuned
            </span>
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-[#141824] hover:bg-[#1A2030] border border-[#23293D] rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={onSpinTheReel}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Surprise Me</span>
            </button>
          </div>
        </div>

        {/* 1. Mood Frequency Grid */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            1. Emotional Frequency
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {VIBE_OPTIONS.map((vibe) => {
              const isSelected = filters.mood === vibe.id;
              return (
                <button
                  key={vibe.id}
                  onClick={() => handleMoodSelect(vibe.id)}
                  className={`text-left p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-400/80 text-white shadow-sm ring-1 ring-amber-400/30'
                      : 'bg-[#121622] border-[#1F2538] text-slate-300 hover:border-[#2F3752] hover:bg-[#161C2C]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={isSelected ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'}>
                      {getIcon(vibe.iconName)}
                    </span>
                    <span className="text-xs font-semibold leading-tight truncate">
                      {vibe.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 leading-normal">
                    {vibe.tagline}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Secondary Filter Controls: Energy + Runtime + Audience + Streaming */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 border-t border-[#1C2030]">
          
          {/* Energy Level */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Energy Pace</span>
            </label>
            <div className="flex items-center gap-1 bg-[#121622] p-1 rounded-xl border border-[#1F2538]">
              {(['all', 'low', 'medium', 'high'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => handleEnergySelect(lvl)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors cursor-pointer ${
                    filters.energy === lvl
                      ? 'bg-amber-400 text-slate-950 font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lvl === 'all' ? 'Any' : lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Maximum Runtime Budget */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Max Runtime</span>
              </label>
              <span className="text-xs font-mono font-semibold text-amber-400">
                {filters.maxRuntime >= 210 ? 'No Limit' : `≤ ${filters.maxRuntime} min`}
              </span>
            </div>
            <div className="bg-[#121622] p-2.5 rounded-xl border border-[#1F2538]">
              <input
                type="range"
                min="90"
                max="210"
                step="15"
                value={filters.maxRuntime}
                onChange={(e) => setFilters(prev => ({ ...prev, maxRuntime: Number(e.target.value) }))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>90m (Quick)</span>
                <span>120m (Standard)</span>
                <span>210m+ (Epic)</span>
              </div>
            </div>
          </div>

          {/* Audience / Company */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Viewing Context</span>
            </label>
            <div className="flex items-center gap-1 bg-[#121622] p-1 rounded-xl border border-[#1F2538]">
              {[
                { id: 'all', label: 'All' },
                { id: 'solo', label: 'Solo' },
                { id: 'date_night', label: 'Date' },
                { id: 'group', label: 'Group' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleAudienceSelect(item.id as AudienceSetting)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    filters.audience === item.id
                      ? 'bg-amber-400 text-slate-950 font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Streaming Platform */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              <span>Streaming Platform</span>
            </label>
            <div className="bg-[#121622] p-1 rounded-xl border border-[#1F2538]">
              <select
                value={filters.streamingPlatform}
                onChange={(e) => setFilters(prev => ({ ...prev, streamingPlatform: e.target.value }))}
                className="w-full bg-transparent text-xs text-slate-200 py-1.5 px-2 focus:outline-none cursor-pointer"
              >
                {STREAMING_PLATFORMS.map((platform) => (
                  <option key={platform} value={platform} className="bg-[#10131C] text-slate-200">
                    {platform}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
