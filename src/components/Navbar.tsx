import React from 'react';
import { Film, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'matcher' | 'catalog' | 'ai' | 'watchlist';
  setActiveTab: (tab: 'matcher' | 'catalog' | 'ai' | 'watchlist') => void;
  watchlistCount: number;
  onSurpriseMe: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  watchlistCount,
  onSurpriseMe,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#07080B]/90 backdrop-blur-md border-b border-[#1E2230] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => setActiveTab('matcher')}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:border-amber-400 transition-colors">
            <Film className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white whitespace-nowrap shrink-0 group-hover:text-amber-300 transition-colors">
            CineVibe
          </span>
        </button>

        {/* Zone 2: 4-5 Concise Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => setActiveTab('matcher')}
            className={`whitespace-nowrap shrink-0 cursor-pointer transition-colors relative py-1 ${
              activeTab === 'matcher'
                ? 'text-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Mood Matcher
            {activeTab === 'matcher' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`whitespace-nowrap shrink-0 cursor-pointer transition-colors relative py-1 ${
              activeTab === 'catalog'
                ? 'text-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Catalog Lounge
            {activeTab === 'catalog' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`whitespace-nowrap shrink-0 cursor-pointer transition-colors relative py-1 ${
              activeTab === 'ai'
                ? 'text-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Sommelier
            {activeTab === 'ai' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('watchlist')}
            className={`whitespace-nowrap shrink-0 cursor-pointer transition-colors relative py-1 flex items-center gap-1.5 ${
              activeTab === 'watchlist'
                ? 'text-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>My Watchlist</span>
            {watchlistCount > 0 && (
              <span className="text-xs font-mono font-semibold text-amber-300">
                ({watchlistCount})
              </span>
            )}
            {activeTab === 'watchlist' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onSurpriseMe}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 transition-all rounded-lg shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spin the Reel</span>
          </button>
        </div>

      </div>

      {/* Mobile nav subrow */}
      <div className="md:hidden flex items-center justify-around px-4 py-2 border-t border-[#1E2230] text-xs font-medium text-slate-400 bg-[#0A0D14]">
        <button
          onClick={() => setActiveTab('matcher')}
          className={`py-1 ${activeTab === 'matcher' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Matcher
        </button>
        <button
          onClick={() => setActiveTab('catalog')}
          className={`py-1 ${activeTab === 'catalog' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Catalog
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`py-1 ${activeTab === 'ai' ? 'text-amber-400 font-semibold' : ''}`}
        >
          AI Vibe
        </button>
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`py-1 ${activeTab === 'watchlist' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Watchlist ({watchlistCount})
        </button>
      </div>
    </header>
  );
};
