import React, { useState, useRef, useEffect } from 'react';
import { 
  Star, 
  Bookmark, 
  Check, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Film, 
  Eye, 
  X,
  Loader2
} from 'lucide-react';
import { Movie } from '../types.ts';
import { getMoviePreviewVideo } from '../data/movies.ts';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
  isWatchlisted: boolean;
  isWatched: boolean;
  onToggleWatchlist: (movieId: string, e: React.MouseEvent) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelect,
  isWatchlisted,
  isWatched,
  onToggleWatchlist,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoLoading, setVideoLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const previewTimerRef = useRef<any>(null);

  const videoUrl = getMoviePreviewVideo(movie);

  const handleStartQuickPeek = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsPlayingPreview(true);
    setIsPaused(false);
    setVideoLoading(true);
  };

  const handleStopQuickPeek = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsPlayingPreview(false);
    setIsPaused(false);
    setVideoProgress(0);
    setVideoLoading(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleTogglePause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPaused(false);
    } else {
      videoRef.current.pause();
      setIsPaused(true);
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const progress = (videoRef.current.currentTime / (videoRef.current.duration || 1)) * 100;
    setVideoProgress(progress);
  };

  return (
    <div
      onClick={() => onSelect(movie)}
      className="group relative bg-[#0E111A] border border-[#1E2333] hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 cinema-card-glow cursor-pointer flex flex-col h-full"
    >
      {/* Poster Media Box with Mini Video Player */}
      <div 
        className="aspect-[16/10] sm:aspect-[16/10] relative overflow-hidden bg-[#151926]"
        onMouseLeave={() => {
          // Gracefully pause preview when mouse departs card
          if (isPlayingPreview) {
            handleStopQuickPeek();
          }
        }}
      >
        {isPlayingPreview ? (
          /* Mini Video Player View */
          <div 
            className="relative w-full h-full bg-black select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onWaiting={() => setVideoLoading(true)}
              onPlaying={() => setVideoLoading(false)}
              onCanPlay={() => setVideoLoading(false)}
              onTimeUpdate={handleTimeUpdate}
              onError={() => {
                setVideoLoading(false);
              }}
              className="w-full h-full object-cover"
            />

            {/* Video Loading Spinner */}
            {videoLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
              </div>
            )}

            {/* Top Bar inside Mini Player: LIVE Preview indicator & Close */}
            <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-20">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/70 border border-amber-400/30 text-[10px] font-mono text-amber-300 backdrop-blur-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span>Quick Peek</span>
              </span>

              <button
                onClick={handleStopQuickPeek}
                className="p-1 rounded-full bg-black/70 hover:bg-black/90 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10"
                title="Exit Quick Peek"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bottom Controls Bar inside Mini Player */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2 z-20 space-y-1.5">
              {/* Mini Scrubber Bar */}
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-400 transition-all duration-150"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-slate-200 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTogglePause}
                    className="p-1 rounded hover:text-amber-400 transition-colors cursor-pointer"
                    title={isPaused ? 'Resume' : 'Pause'}
                  >
                    {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={handleToggleMute}
                    className="p-1 rounded hover:text-amber-400 transition-colors cursor-pointer"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(movie);
                  }}
                  className="text-[11px] font-mono text-amber-300 hover:underline cursor-pointer"
                >
                  Full Dossier →
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Standard Still Image Mode */
          <>
            {!imageError ? (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#121624] to-[#0A0D15] text-slate-400">
                <Film className="w-10 h-10 text-amber-500/40 mb-2" />
                <span className="text-xs font-semibold text-slate-300 text-center line-clamp-1">
                  {movie.title}
                </span>
                <span className="text-[10px] text-slate-500">{movie.year} · {movie.director}</span>
              </div>
            )}

            {/* Ambient Dark Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E111A] via-[#0E111A]/20 to-transparent" />

            {/* Quick Watchlist Toggle Button */}
            <button
              onClick={(e) => onToggleWatchlist(movie.id, e)}
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
              className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-md transition-all cursor-pointer z-10 ${
                isWatchlisted
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-[#0E111A]/80 text-slate-300 hover:text-white hover:bg-black/80 border border-white/10'
              }`}
            >
              {isWatchlisted ? (
                <Bookmark className="w-4 h-4 fill-current" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>

            {/* Watched Marker if applicable */}
            {isWatched && (
              <div className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                <Check className="w-3 h-3" />
                <span>Watched</span>
              </div>
            )}

            {/* Center Hover Action: Launch Details */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/25 backdrop-blur-[1px]">
              <div className="w-11 h-11 rounded-full bg-amber-400/90 text-slate-950 flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
            </div>

            {/* 'Quick Peek' Interactive Hover Trigger Pill */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between opacity-90 group-hover:opacity-100 transition-opacity z-10">
              <button
                onClick={handleStartQuickPeek}
                onMouseEnter={() => {
                  // Pre-start on deliberate hover
                  previewTimerRef.current = setTimeout(() => {
                    handleStartQuickPeek();
                  }, 300);
                }}
                onMouseLeave={() => {
                  if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/75 hover:bg-amber-400 text-slate-200 hover:text-slate-950 border border-white/15 hover:border-amber-400 text-xs font-semibold backdrop-blur-md transition-all shadow-md active:scale-95 cursor-pointer"
                title="Mini video teaser preview"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Quick Peek</span>
              </button>

              <span className="text-[10px] font-mono text-slate-300 drop-shadow-md bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-xs">
                {movie.runtime}m
              </span>
            </div>
          </>
        )}
      </div>

      {/* Card Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Unboxed Metadata Strip (Strictly NO pills) */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-current" />
              {movie.rating.toFixed(1)}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{movie.year}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{movie.mpaaRating}</span>
          </div>

          <h3 className="font-display font-bold text-base text-white group-hover:text-amber-300 transition-colors line-clamp-1">
            {movie.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {movie.synopsis}
          </p>
        </div>

        {/* Why this fits snippet & streaming availability */}
        <div className="pt-2 border-t border-[#1C202E] space-y-2">
          <div className="text-[11px] text-amber-300/80 italic line-clamp-1">
            "{movie.quote}"
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="truncate max-w-[150px]">
              Dir. {movie.director}
            </span>
            <span className="text-slate-400 font-medium">
              {movie.streamingOn[0] || 'VOD'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
