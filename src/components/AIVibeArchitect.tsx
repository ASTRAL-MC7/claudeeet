import React, { useState } from 'react';
import { Sparkles, Send, Film, Wine, Moon, RefreshCw, Star } from 'lucide-react';
import { Movie, AIRecResponse } from '../types.ts';
import { MOVIES_DATABASE } from '../data/movies.ts';

interface AIVibeArchitectProps {
  onSelectMovie: (movie: Movie) => void;
}

const PRESET_PROMPTS = [
  'Rainy neon streets, saxophone jazz, and existential longing',
  'Cozy 90s autumn mystery with knit sweaters and witty banter',
  'Kinetic adrenaline rush with relentless forward momentum and heavy synths',
  'Mind-bending puzzle where reality unspools in quiet rooms',
  'Gentle studio Ghibli warmth in a live-action indie story'
];

export const AIVibeArchitect: React.FC<AIVibeArchitectProps> = ({ onSelectMovie }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIRecResponse | null>(null);

  const handleGenerate = async (queryText: string) => {
    const textToSearch = queryText.trim();
    if (!textToSearch) return;

    setIsLoading(true);

    try {
      // Send request to server-side proxy route
      const response = await fetch('/api/vibe-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSearch }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        // Fallback intelligent local matcher
        fallbackLocalAnalysis(textToSearch);
      }
    } catch {
      fallbackLocalAnalysis(textToSearch);
    } finally {
      setIsLoading(false);
    }
  };

  // Resilient fallback logic when offline or server unreachable
  const fallbackLocalAnalysis = (query: string) => {
    const lower = query.toLowerCase();
    
    // Fuzzy matching against vibes
    let matchedIds: string[] = [];
    let snack = 'Sea salt popcorn and chilled sparkling mineral water';
    let ambiance = 'Soft dim amber lamp, room lights at 20%';

    if (lower.includes('neon') || lower.includes('rain') || lower.includes('jazz') || lower.includes('blade')) {
      matchedIds = ['blade-runner-2049', 'drive', 'cure'];
      snack = 'Smoky Old Fashioned with dark chocolate orange peel';
      ambiance = 'Total darkness with one low-intensity cobalt backlight';
    } else if (lower.includes('cozy') || lower.includes('autumn') || lower.includes('sweater') || lower.includes('witty')) {
      matchedIds = ['knives-out', 'the-grand-budapest-hotel', 'before-sunrise'];
      snack = 'Hot spiced apple cider and cinnamon pastries';
      ambiance = 'Warm fairy lights, soft wool throw blanket';
    } else if (lower.includes('mind') || lower.includes('puzzle') || lower.includes('reality')) {
      matchedIds = ['arrival', 'severance-s1', 'everything-everywhere-all-at-once'];
      snack = 'Black pour-over coffee and artisan pretzels';
      ambiance = 'Minimalist silence, zero phone notifications';
    } else if (lower.includes('adrenaline') || lower.includes('momentum') || lower.includes('synth')) {
      matchedIds = ['mad-max-fury-road', 'whiplash', 'drive'];
      snack = 'Spicy Sichuan chili chips and cold ginger ale';
      ambiance = 'Subwoofer turned up, crisp volume levels';
    } else {
      matchedIds = ['past-lives', 'her', 'portrait-of-a-lady-on-fire'];
      snack = 'Chamomile tea and honey roasted almonds';
      ambiance = 'Soft candlelight and gentle room temperature';
    }

    setResult({
      vibeAnalysis: `Synthesizing frequency for "${query}". Your prompt calls for rich atmosphere, tactile sound design, and an emotional undercurrent that lingers long after the credits roll.`,
      recommendedMovieIds: matchedIds,
      customPicks: matchedIds.map(id => {
        const m = MOVIES_DATABASE.find(x => x.id === id);
        return {
          title: m ? m.title : 'Curated Feature',
          year: m ? m.year : 2022,
          director: m ? m.director : 'Featured Auteur',
          whyItFits: m ? m.whyItFitsVibe : 'Matches the tonal geometry of your prompt.',
          ambientTip: 'Best experienced in a single uninterrupted sitting.'
        };
      }),
      pairedSnackOrDrink: snack,
      ambianceSetting: ambiance
    });
  };

  const matchedMovies = result?.recommendedMovieIds
    ? result.recommendedMovieIds
        .map(id => MOVIES_DATABASE.find(m => m.id === id))
        .filter((m): m is Movie => m !== undefined)
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generative Cinema Sommelier</span>
        </div>
        <h2 className="text-3xl font-display font-bold text-white tracking-tight">
          AI Vibe Architect
        </h2>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Describe any sensory mood, aesthetic collision, or emotional state in your own words.
          Gemini 3.8 Flash will diagnose your frequency and prescribe the perfect feature.
        </p>
      </div>

      {/* Input Console */}
      <div className="bg-[#0E111A] border border-[#22283A] rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleGenerate(prompt);
              }
            }}
            placeholder="e.g. 'A rainy neon-drenched detective thriller where characters speak in quiet metaphors and the soundtrack is all low analog synths...'"
            rows={3}
            className="w-full bg-[#07090E] border border-[#1E2436] rounded-xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors resize-none"
          />

          <button
            onClick={() => handleGenerate(prompt)}
            disabled={isLoading || !prompt.trim()}
            className="absolute bottom-3 right-3 flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-semibold text-xs rounded-lg transition-all shadow-sm cursor-pointer"
          >
            {isLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>{isLoading ? 'Synthesizing...' : 'Synthesize Vibe'}</span>
          </button>
        </div>

        {/* Preset Prompt Buttons */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase text-slate-500">
            Or try an inspirational frequency:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(p);
                  handleGenerate(p);
                }}
                className="text-left text-xs text-slate-300 hover:text-amber-300 bg-[#141824] hover:bg-[#1A2030] border border-[#23293D] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results View */}
      {result && (
        <div className="bg-[#0E111A] border border-[#22283A] rounded-2xl p-6 space-y-6 shadow-xl animate-fadeIn">
          
          {/* Vibe Diagnosis */}
          <div className="border-b border-[#1E2333] pb-5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Vibe Diagnosis</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              {result.vibeAnalysis}
            </p>
          </div>

          {/* Curated Recommendations */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Prescribed Screenings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {matchedMovies.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => onSelectMovie(movie)}
                  className="bg-[#121622] hover:bg-[#181D2C] border border-[#1F2538] hover:border-amber-500/40 rounded-xl p-4 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span className="text-amber-400 font-semibold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {movie.rating.toFixed(1)}
                      </span>
                      <span>{movie.year} · {movie.runtime}m</span>
                    </div>

                    <h4 className="text-base font-display font-bold text-white group-hover:text-amber-300 transition-colors">
                      {movie.title}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {movie.whyItFitsVibe}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#1C202E] flex items-center justify-between text-xs text-amber-400 font-medium">
                    <span>Dir. {movie.director}</span>
                    <span className="group-hover:translate-x-1 transition-transform">Inspect →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sensory Ambiance & Pairing Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#1E2333]">
            <div className="p-4 rounded-xl bg-[#121622] border border-[#1F2538] flex items-start gap-3">
              <Wine className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase text-slate-400">
                  Sommelier Pairing
                </span>
                <p className="text-xs text-slate-200">
                  {result.pairedSnackOrDrink}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#121622] border border-[#1F2538] flex items-start gap-3">
              <Moon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase text-slate-400">
                  Viewing Ambiance
                </span>
                <p className="text-xs text-slate-200">
                  {result.ambianceSetting}
                </p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
