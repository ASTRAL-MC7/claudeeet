import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Star, 
  Bookmark, 
  Check, 
  Clock, 
  Film, 
  Tv, 
  Sparkles, 
  ExternalLink,
  Volume2,
  VolumeX,
  RotateCcw
} from 'lucide-react';
import { Movie, UserReview } from '../types.ts';

interface MediaModalProps {
  movie: Movie | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (movieId: string) => void;
  userReview: UserReview | undefined;
  onSaveReview: (review: UserReview) => void;
}

export const MediaModal: React.FC<MediaModalProps> = ({
  movie,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
  userReview,
  onSaveReview,
}) => {
  const [isPlayingTeaser, setIsPlayingTeaser] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [rating, setRating] = useState(userReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewNote, setReviewNote] = useState(userReview?.note || '');
  const [isSavedToast, setIsSavedToast] = useState(false);
  
  // Ambient Web Audio synth reference for cinematic room tone
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (userReview) {
      setRating(userReview.rating);
      setReviewNote(userReview.note);
    } else {
      setRating(0);
      setReviewNote('');
    }
    setIsPlayingTeaser(false);
    stopCinematicDrone();
  }, [movie, userReview]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopCinematicDrone();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      stopCinematicDrone();
    };
  }, [onClose]);

  // Clean Web Audio cinematic hum synth
  const startCinematicDrone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      gainNodeRef.current = gain;

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, ctx.currentTime); // Low A

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(110, ctx.currentTime); // Harmonic

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 1.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
    } catch (e) {
      // Audio autoplay restrictions gracefully handled
    }
  };

  const stopCinematicDrone = () => {
    try {
      if (gainNodeRef.current && audioContextRef.current) {
        gainNodeRef.current.gain.linearRampToValueAtTime(0.0001, audioContextRef.current.currentTime + 0.5);
        setTimeout(() => {
          audioContextRef.current?.close();
          audioContextRef.current = null;
        }, 500);
      }
    } catch (e) {
      audioContextRef.current = null;
    }
  };

  const toggleAudio = () => {
    if (!gainNodeRef.current || !audioContextRef.current) return;
    if (isAudioMuted) {
      gainNodeRef.current.gain.setValueAtTime(0.06, audioContextRef.current.currentTime);
      setIsAudioMuted(false);
    } else {
      gainNodeRef.current.gain.setValueAtTime(0.0001, audioContextRef.current.currentTime);
      setIsAudioMuted(true);
    }
  };

  if (!movie) return null;

  const handleStartTeaser = () => {
    setIsPlayingTeaser(true);
    startCinematicDrone();
  };

  const handleStopTeaser = () => {
    setIsPlayingTeaser(false);
    stopCinematicDrone();
  };

  const handleSaveReview = () => {
    if (rating === 0) return;
    onSaveReview({
      movieId: movie.id,
      rating,
      note: reviewNote,
      watchedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    });
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#0C0F17] border border-[#23293D] rounded-2xl overflow-hidden shadow-2xl my-auto text-slate-100 cinema-glow"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            stopCinematicDrone();
            onClose();
          }}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-slate-300 hover:text-white transition-colors border border-white/10 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Cinema Player / Hero Header (No fragile iframes) */}
        <div className="relative aspect-[16/9] w-full bg-black overflow-hidden">
          <img
            src={movie.backdropUrl || movie.posterUrl}
            alt={movie.title}
            className={`w-full h-full object-cover transition-all duration-1000 ${
              isPlayingTeaser ? 'scale-110 filter brightness-90 contrast-110' : 'scale-100'
            }`}
            referrerPolicy="no-referrer"
          />

          {/* Letterbox bars and cinematic scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0F17] via-transparent to-black/40" />
          
          {isPlayingTeaser ? (
            /* Active Cinematic Teaser Mode */
            <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 bg-black/40 backdrop-blur-[1px] animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-xs font-mono text-amber-300 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>Cinematic Reel In Session</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleAudio}
                    className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-slate-200 border border-white/10 transition-colors cursor-pointer"
                    title={isAudioMuted ? 'Unmute Ambient Drone' : 'Mute Ambient Drone'}
                  >
                    {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                  </button>
                  <button
                    onClick={handleStopTeaser}
                    className="px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-xs font-medium text-slate-200 border border-white/10 transition-colors cursor-pointer"
                  >
                    Exit Teaser
                  </button>
                </div>
              </div>

              {/* Center Quote Reel */}
              <div className="text-center max-w-xl mx-auto space-y-3">
                <p className="text-lg sm:text-2xl font-display font-bold italic text-white drop-shadow-lg leading-relaxed">
                  "{movie.quote}"
                </p>
                <div className="text-xs font-mono text-amber-300 tracking-wider uppercase">
                  Directed by {movie.director} · {movie.year}
                </div>
              </div>

              {/* Bottom Controls */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                <span>{movie.genres.join(' · ')}</span>
                
                {/* Direct Safe YouTube Link (Opens in new tab, avoids iframe 401) */}
                <a
                  href={`https://www.youtube.com/watch?v=${movie.youtubeTrailerId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-white font-sans font-semibold transition-colors shadow-md"
                >
                  <span>Watch on YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            /* Idle Preview Trigger Mode */
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <button
                onClick={handleStartTeaser}
                className="flex items-center gap-3 px-6 py-3.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-bold rounded-full shadow-xl transition-all cursor-pointer group"
              >
                <Play className="w-5 h-5 fill-current ml-0.5 group-hover:scale-110 transition-transform" />
                <span>Play Teaser Reel</span>
              </button>
              
              <div className="flex items-center gap-3 mt-3">
                <span className="text-xs text-slate-300 font-mono drop-shadow-md">
                  Reel Preview & Ambiance
                </span>
                <span className="text-slate-500">·</span>
                <a
                  href={`https://www.youtube.com/watch?v=${movie.youtubeTrailerId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-300 hover:text-amber-200 underline font-mono flex items-center gap-1"
                >
                  <span>YouTube HD</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* Tagline overlay at bottom of media box */}
          {!isPlayingTeaser && (
            <div className="absolute bottom-4 left-6 right-6">
              <p className="text-sm sm:text-base font-display italic text-amber-200/90 drop-shadow-md">
                "{movie.tagline}"
              </p>
            </div>
          )}
        </div>

        {/* Dossier Body Content */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Header Title & Unboxed Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2333] pb-6">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                {movie.title}
              </h2>

              {/* Unboxed Metadata Strip */}
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-mono text-slate-400">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  {movie.rating.toFixed(1)} / 10
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>{movie.year}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>{movie.runtime} min</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>{movie.mpaaRating}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-300">{movie.genres.join(', ')}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onToggleWatchlist(movie.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                  isWatchlisted
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'bg-[#151926] hover:bg-[#1E2436] text-slate-200 border border-[#273046]'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isWatchlisted ? 'fill-current' : ''}`} />
                <span>{isWatchlisted ? 'In Watchlist' : 'Add to Watchlist'}</span>
              </button>
            </div>
          </div>

          {/* Grid: Synopsis + Why It Fits Your Vibe */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left Column: Synopsis & Cast info */}
            <div className="md:col-span-7 space-y-6">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Synopsis
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {movie.synopsis}
                </p>
              </div>

              {/* Curated Vibe Justification */}
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Curator's Vibe Breakdown</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {movie.whyItFitsVibe}
                </p>
              </div>

              {/* Cast & Director */}
              <div className="space-y-3 pt-2">
                <div className="flex text-xs">
                  <span className="w-24 text-slate-500 font-semibold uppercase shrink-0">Director</span>
                  <span className="text-slate-200">{movie.director}</span>
                </div>
                <div className="flex text-xs">
                  <span className="w-24 text-slate-500 font-semibold uppercase shrink-0">Starring</span>
                  <span className="text-slate-200">{movie.cast.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Streaming Availability + Rating / Personal Review Log */}
            <div className="md:col-span-5 space-y-6">
              
              {/* Where to Stream */}
              <div className="p-4 rounded-xl bg-[#121622] border border-[#1F2538] space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <Tv className="w-4 h-4 text-amber-400" />
                  <span>Streaming Availability</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {movie.streamingOn.map((service) => (
                    <span
                      key={service}
                      className="px-2.5 py-1 text-xs font-medium text-slate-200 bg-[#1A2030] rounded-lg border border-[#273046]"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interactive Rating & Review Logger */}
              <div className="p-4 rounded-xl bg-[#121622] border border-[#1F2538] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Your Rating & Note
                  </span>
                  {userReview && (
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Logged {userReview.watchedAt}
                    </span>
                  )}
                </div>

                {/* 5-Star interactive selector */}
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 text-slate-600 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          (hoverRating || rating) >= star
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono text-slate-400 ml-2">
                    {rating > 0 ? `${rating}/5 Stars` : 'Rate film'}
                  </span>
                </div>

                {/* Personal note input */}
                <textarea
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="Private viewing notes (e.g., 'Watched with Sarah on a rainy Sunday, sublime third act')..."
                  rows={2}
                  className="w-full text-xs bg-[#0B0E17] text-slate-200 placeholder-slate-500 p-2.5 rounded-lg border border-[#22283A] focus:outline-none focus:border-amber-400 transition-colors resize-none"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500">
                    Saves to your local session
                  </span>
                  <button
                    onClick={handleSaveReview}
                    disabled={rating === 0}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 transition-colors cursor-pointer"
                  >
                    Save Review
                  </button>
                </div>

                {isSavedToast && (
                  <div className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/30 p-2 rounded text-center">
                    Review logged to your personal library!
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
