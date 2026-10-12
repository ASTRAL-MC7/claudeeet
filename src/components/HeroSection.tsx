import React from 'react';
import { Play, Sparkles, SlidersHorizontal, Star, Clock } from 'lucide-react';
import { heroBackdrop, neonNoirVisual, goldenDuskVisual, midnightThrillerVisual } from '../data/movies.ts';
import { Movie } from '../types.ts';

interface HeroSectionProps {
  onExploreVibes: () => void;
  onOpenMovie: (movie: Movie) => void;
  spotlightMovies: Movie[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreVibes,
  onOpenMovie,
  spotlightMovies,
}) => {
  const featured = spotlightMovies[0] || null;

  return (
    <section className="relative overflow-hidden border-b border-[#1E2230]">
      {/* Background with measured cinema contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBackdrop}
          alt="Cinema auditorium projector beam"
          className="w-full h-full object-cover object-center opacity-30 scale-105 transform filter blur-[1px]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080B] via-[#07080B]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07080B] via-[#07080B]/70 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Typographic impact & action */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-400/90 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cinema Mood & Frequency Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.08] text-balance">
              Find the exact film your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
                mood demands.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
              Cut through 30 minutes of streaming fatigue. Filter by emotional frequency,
              audience company, and exact runtime budget for precision cinematic matches.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreVibes}
                className="flex items-center gap-2.5 px-6 py-3.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-semibold rounded-xl transition-all shadow-lg shadow-amber-500/10 cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Dial Your Vibe</span>
              </button>

              {featured && (
                <button
                  onClick={() => onOpenMovie(featured)}
                  className="flex items-center gap-2 px-5 py-3.5 bg-[#151924]/90 hover:bg-[#1C2130] border border-[#262C3F] text-slate-200 font-medium rounded-xl transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Spotlight: {featured.title}</span>
                </button>
              )}
            </div>

            {/* Quick Unboxed Proof Metric Strip */}
            <div className="pt-6 border-t border-[#1E2230]/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">45+</span>
                <span>Curated Masterpieces</span>
              </div>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">10</span>
                <span>Emotional Frequencies</span>
              </div>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-semibold">0s</span>
                <span>Algorithm Fatigue</span>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Still / Spotlight Reel */}
          <div className="lg:col-span-5">
            {featured && (
              <div
                onClick={() => onOpenMovie(featured)}
                className="group relative rounded-2xl overflow-hidden border border-[#232838] bg-[#10131C] shadow-2xl transition-all duration-300 hover:border-amber-500/40 cursor-pointer cinema-card-glow"
              >
                <div className="aspect-[16/10] relative overflow-hidden">
                  <img
                    src={featured.posterUrl || neonNoirVisual}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D15] via-[#0A0D15]/40 to-transparent" />
                  
                  {/* Floating Play Affordance */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full bg-amber-400/90 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </div>

                  <div className="absolute top-3 left-3 bg-[#0A0D15]/80 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded text-xs font-mono font-medium text-amber-300">
                    Curator’s Choice
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {featured.rating.toFixed(1)}
                    </span>
                    <span>{featured.year} · {featured.runtime}m</span>
                    <span className="text-slate-300">{featured.mpaaRating}</span>
                  </div>

                  <h3 className="text-lg font-display font-bold text-white group-hover:text-amber-300 transition-colors">
                    {featured.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {featured.synopsis}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-[#1C202E]">
                    <span>Dir. {featured.director}</span>
                    <span className="text-amber-400/90 group-hover:underline">View Dossier & Trailer →</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
