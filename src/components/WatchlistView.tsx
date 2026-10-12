import React, { useState } from 'react';
import { 
  Bookmark, 
  Check, 
  Star, 
  Trash2, 
  Play, 
  Sparkles, 
  Ticket, 
  Clock, 
  Share2,
  Film
} from 'lucide-react';
import { Movie, UserReview } from '../types.ts';
import { DOUBLE_FEATURE_PAIRINGS, MOVIES_DATABASE } from '../data/movies.ts';

interface WatchlistViewProps {
  watchlistIds: string[];
  watchedReviews: Record<string, UserReview>;
  onRemoveFromWatchlist: (movieId: string) => void;
  onOpenMovie: (movie: Movie) => void;
  allMovies: Movie[];
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  watchlistIds,
  watchedReviews,
  onRemoveFromWatchlist,
  onOpenMovie,
  allMovies,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'queue' | 'history' | 'double_feature'>('queue');
  const [selectedPairingIndex, setSelectedPairingIndex] = useState(0);

  const watchlistedMovies = allMovies.filter(m => watchlistIds.includes(m.id));
  const watchedMovieIds = Object.keys(watchedReviews);
  const watchedMovies = allMovies.filter(m => watchedMovieIds.includes(m.id));

  const currentPairing = DOUBLE_FEATURE_PAIRINGS[selectedPairingIndex];
  const pairMovie1 = allMovies.find(m => m.id === currentPairing.movie1Id);
  const pairMovie2 = allMovies.find(m => m.id === currentPairing.movie2Id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header and Subtabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2333] pb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Personal Cinema Vault
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track your queued screenings, viewing ratings, and curated double-feature passes.
          </p>
        </div>

        {/* Subtabs Segmented Control */}
        <div className="flex items-center gap-1 bg-[#121622] p-1 rounded-xl border border-[#1F2538]">
          <button
            onClick={() => setActiveSubTab('queue')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'queue'
                ? 'bg-amber-400 text-slate-950 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Watch Next ({watchlistedMovies.length})
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'history'
                ? 'bg-amber-400 text-slate-950 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Watched Log ({watchedMovies.length})
          </button>
          <button
            onClick={() => setActiveSubTab('double_feature')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'double_feature'
                ? 'bg-amber-400 text-slate-950 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Double Feature Stubs
          </button>
        </div>
      </div>

      {/* Tab 1: Queue (Watch Next) */}
      {activeSubTab === 'queue' && (
        <div className="space-y-4">
          {watchlistedMovies.length === 0 ? (
            <div className="text-center py-16 bg-[#0E111A] border border-[#1E2333] rounded-2xl p-8 space-y-3">
              <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-lg font-display font-bold text-slate-200">
                Your Watchlist is empty
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Explore the Mood Matcher or Catalog Lounge and click the bookmark button on any movie to save it for your next movie night.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {watchlistedMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-[#0E111A] border border-[#1E2333] hover:border-amber-500/30 rounded-xl p-4 flex gap-4 transition-all group"
                >
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-20 h-28 object-cover rounded-lg shrink-0 cursor-pointer"
                    onClick={() => onOpenMovie(movie)}
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                        <span className="text-amber-400 font-semibold flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          {movie.rating.toFixed(1)}
                        </span>
                        <span>{movie.runtime}m</span>
                      </div>
                      <h4
                        onClick={() => onOpenMovie(movie)}
                        className="font-display font-bold text-base text-white group-hover:text-amber-300 transition-colors cursor-pointer line-clamp-1"
                      >
                        {movie.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2">
                        {movie.synopsis}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#1C202E]">
                      <button
                        onClick={() => onOpenMovie(movie)}
                        className="text-xs text-amber-400 font-medium hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Watch Trailer</span>
                      </button>
                      <button
                        onClick={() => onRemoveFromWatchlist(movie.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Watched History */}
      {activeSubTab === 'history' && (
        <div className="space-y-4">
          {watchedMovies.length === 0 ? (
            <div className="text-center py-16 bg-[#0E111A] border border-[#1E2333] rounded-2xl p-8 space-y-3">
              <Check className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-lg font-display font-bold text-slate-200">
                No screenings logged yet
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Open any film dossier, give it a star rating, and write your personal viewing note to build your private screening log.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {watchedMovies.map((movie) => {
                const review = watchedReviews[movie.id];
                return (
                  <div
                    key={movie.id}
                    onClick={() => onOpenMovie(movie)}
                    className="bg-[#0E111A] border border-[#1E2333] hover:border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#151926] flex items-center justify-center shrink-0">
                        <Film className="w-6 h-6 text-amber-400" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-display font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                          {movie.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                          <span>{movie.year}</span>
                          <span aria-hidden="true">·</span>
                          <span>Dir. {movie.director}</span>
                          <span aria-hidden="true">·</span>
                          <span>Logged on {review?.watchedAt || 'Recent'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:text-right">
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < (review?.rating || 0) ? 'fill-current' : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                      {review?.note && (
                        <p className="text-xs text-slate-300 italic max-w-xs line-clamp-1 border-l border-[#242A3D] pl-3">
                          "{review.note}"
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Curated Double Feature Stubs */}
      {activeSubTab === 'double_feature' && (
        <div className="space-y-6">
          {/* Pairing Selector */}
          <div className="flex flex-wrap gap-2">
            {DOUBLE_FEATURE_PAIRINGS.map((pairing, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPairingIndex(idx)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                  selectedPairingIndex === idx
                    ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                    : 'bg-[#121622] text-slate-300 border-[#1F2538] hover:border-[#2F3752]'
                }`}
              >
                {pairing.title}
              </button>
            ))}
          </div>

          {/* Retro Cinema Ticket Stub Presentation */}
          <div className="relative bg-[#0E111A] border-2 border-dashed border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto shadow-2xl space-y-6 overflow-hidden">
            
            {/* Ambient Watermark Stamp */}
            <div className="flex items-center justify-between border-b border-[#23293D] pb-4">
              <div className="flex items-center gap-2 text-amber-400">
                <Ticket className="w-5 h-5" />
                <span className="font-display font-bold text-sm tracking-wider uppercase">
                  Admit Two · Curated Double Feature Pass
                </span>
              </div>
              <span className="text-xs font-mono text-slate-500">
                NO. #CV-{selectedPairingIndex + 1}049
              </span>
            </div>

            <div className="space-y-2 text-center">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400/90">
                Thematic Double Bill
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                {currentPairing.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                {currentPairing.theme}
              </p>
            </div>

            {/* Two Films Split Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              
              {/* Feature 1 */}
              {pairMovie1 && (
                <div 
                  onClick={() => onOpenMovie(pairMovie1)}
                  className="bg-[#141824] hover:bg-[#1A2030] border border-[#23293D] hover:border-amber-400/50 p-4 rounded-xl transition-all cursor-pointer group"
                >
                  <span className="text-[10px] font-mono uppercase text-amber-400">Part One</span>
                  <h4 className="text-lg font-display font-bold text-white group-hover:text-amber-300 transition-colors mt-1">
                    {pairMovie1.title}
                  </h4>
                  <div className="text-xs font-mono text-slate-400 mt-1">
                    {pairMovie1.year} · {pairMovie1.runtime}m · {pairMovie1.rating}★
                  </div>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                    {pairMovie1.synopsis}
                  </p>
                </div>
              )}

              {/* Feature 2 */}
              {pairMovie2 && (
                <div 
                  onClick={() => onOpenMovie(pairMovie2)}
                  className="bg-[#141824] hover:bg-[#1A2030] border border-[#23293D] hover:border-amber-400/50 p-4 rounded-xl transition-all cursor-pointer group"
                >
                  <span className="text-[10px] font-mono uppercase text-amber-400">Part Two</span>
                  <h4 className="text-lg font-display font-bold text-white group-hover:text-amber-300 transition-colors mt-1">
                    {pairMovie2.title}
                  </h4>
                  <div className="text-xs font-mono text-slate-400 mt-1">
                    {pairMovie2.year} · {pairMovie2.runtime}m · {pairMovie2.rating}★
                  </div>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                    {pairMovie2.synopsis}
                  </p>
                </div>
              )}
            </div>

            {/* Intermission & Snack Ritual */}
            <div className="p-4 rounded-xl bg-[#121622] border border-[#1F2538] space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Intermission Ritual & Concessions</span>
              </div>
              <p className="text-slate-300">
                <strong className="text-white">Concession Pairing:</strong> {currentPairing.snack}
              </p>
              <p className="text-slate-400 italic">
                <strong className="text-white not-italic">Intermission Note:</strong> {currentPairing.intermissionTip}
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
