import React, { useState, useEffect } from 'react';
import { Sparkles, Play, RotateCcw, X, Star } from 'lucide-react';
import { Movie } from '../types.ts';

interface ReelSpinnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
}

export const ReelSpinnerModal: React.FC<ReelSpinnerModalProps> = ({
  isOpen,
  onClose,
  movies,
  onSelectMovie,
}) => {
  const [spinning, setSpinning] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [winner, setWinner] = useState<Movie | null>(null);

  useEffect(() => {
    if (!isOpen || movies.length === 0) return;

    setSpinning(true);
    setWinner(null);

    let speed = 60;
    let iterations = 0;
    const maxIterations = 28;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
      iterations++;

      if (iterations >= maxIterations) {
        clearInterval(interval);
        const finalMovie = movies[Math.floor(Math.random() * movies.length)];
        setWinner(finalMovie);
        setSpinning(false);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [isOpen, movies]);

  if (!isOpen) return null;

  const currentDisplay = winner || movies[currentIndex] || movies[0];

  const handleSpinAgain = () => {
    setSpinning(true);
    setWinner(null);
    let iterations = 0;
    const maxIterations = 24;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
      iterations++;

      if (iterations >= maxIterations) {
        clearInterval(interval);
        const finalMovie = movies[Math.floor(Math.random() * movies.length)];
        setWinner(finalMovie);
        setSpinning(false);
      }
    }, 60);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div 
        className="relative w-full max-w-lg bg-[#0E111A] border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6 cinema-glow"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-amber-400">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Projector Wheel Serendipity</span>
          </div>
          <h3 className="text-2xl font-display font-bold text-white">
            {spinning ? 'Calibrating Frequencies...' : 'Your Destiny for Tonight'}
          </h3>
        </div>

        {/* Reel Box */}
        <div className={`p-6 rounded-2xl border transition-all duration-300 ${
          spinning 
            ? 'bg-[#121624] border-amber-500/30 blur-[0.5px]' 
            : 'bg-gradient-to-b from-amber-500/10 to-[#121624] border-amber-400 shadow-xl'
        }`}>
          {currentDisplay && (
            <div className="space-y-3">
              <div className="aspect-[16/9] rounded-xl overflow-hidden bg-black/60 mx-auto max-w-sm border border-white/10">
                <img
                  src={currentDisplay.posterUrl}
                  alt={currentDisplay.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-1">
                <div className="text-xs font-mono text-amber-400 flex items-center justify-center gap-2">
                  <span className="flex items-center gap-1 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {currentDisplay.rating.toFixed(1)}
                  </span>
                  <span>·</span>
                  <span>{currentDisplay.year}</span>
                  <span>·</span>
                  <span>{currentDisplay.runtime}m</span>
                </div>

                <h4 className="text-xl font-display font-extrabold text-white">
                  {currentDisplay.title}
                </h4>

                <p className="text-xs text-slate-300 max-w-xs mx-auto line-clamp-2">
                  "{currentDisplay.tagline}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={handleSpinAgain}
            disabled={spinning}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#171C2B] hover:bg-[#20273D] border border-[#2B354F] text-slate-200 text-xs font-medium rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Spin Again</span>
          </button>

          {winner && (
            <button
              onClick={() => {
                onClose();
                onSelectMovie(winner);
              }}
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Dossier</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
