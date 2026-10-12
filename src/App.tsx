import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Film, 
  SlidersHorizontal,
  Bookmark,
  CheckCircle2,
  Tv
} from 'lucide-react';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { VibeConsole } from './components/VibeConsole.tsx';
import { MovieCard } from './components/MovieCard.tsx';
import { MediaModal } from './components/MediaModal.tsx';
import { AIVibeArchitect } from './components/AIVibeArchitect.tsx';
import { WatchlistView } from './components/WatchlistView.tsx';
import { ReelSpinnerModal } from './components/ReelSpinnerModal.tsx';
import { EntranceAnimation } from './components/EntranceAnimation.tsx';
import { MOVIES_DATABASE } from './data/movies.ts';
import { Movie, VibeFilterState, UserReview } from './types.ts';

const INITIAL_FILTERS: VibeFilterState = {
  mood: 'all',
  energy: 'all',
  maxRuntime: 210,
  audience: 'all',
  streamingPlatform: 'All Platforms',
  searchQuery: '',
  collection: 'all',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'matcher' | 'catalog' | 'ai' | 'watchlist'>('matcher');
  const [filters, setFilters] = useState<VibeFilterState>(INITIAL_FILTERS);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isSpinnerOpen, setIsSpinnerOpen] = useState(false);
  const [showEntrance, setShowEntrance] = useState(true);

  // Local storage persistence for Watchlist and Reviews
  const [watchlistIds, setWatchlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cinevibe_watchlist');
      return saved ? JSON.parse(saved) : ['blade-runner-2049', 'past-lives'];
    } catch {
      return ['blade-runner-2049', 'past-lives'];
    }
  });

  const [watchedReviews, setWatchedReviews] = useState<Record<string, UserReview>>(() => {
    try {
      const saved = localStorage.getItem('cinevibe_reviews');
      return saved ? JSON.parse(saved) : {
        'past-lives': {
          movieId: 'past-lives',
          rating: 5,
          note: 'A quiet masterwork. The silent cab ride broke me completely.',
          watchedAt: 'Oct 10, 2026',
        }
      };
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cinevibe_watchlist', JSON.stringify(watchlistIds));
    } catch (e) {
      console.error(e);
    }
  }, [watchlistIds]);

  useEffect(() => {
    try {
      localStorage.setItem('cinevibe_reviews', JSON.stringify(watchedReviews));
    } catch (e) {
      console.error(e);
    }
  }, [watchedReviews]);

  // Toggle Watchlist handler
  const handleToggleWatchlist = (movieId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWatchlistIds(prev => 
      prev.includes(movieId) ? prev.filter(id => id !== movieId) : [...prev, movieId]
    );
  };

  // Save Review handler
  const handleSaveReview = (review: UserReview) => {
    setWatchedReviews(prev => ({
      ...prev,
      [review.movieId]: review,
    }));
  };

  // Filtered movies logic
  const filteredMovies = useMemo(() => {
    return MOVIES_DATABASE.filter(movie => {
      // Mood check
      if (filters.mood !== 'all' && !movie.vibes.includes(filters.mood)) {
        return false;
      }
      // Energy check
      if (filters.energy !== 'all' && movie.energyLevel !== filters.energy) {
        return false;
      }
      // Max Runtime check
      if (filters.maxRuntime < 210 && movie.runtime > filters.maxRuntime) {
        return false;
      }
      // Audience context check
      if (filters.audience !== 'all' && !movie.audience.includes(filters.audience) && !movie.audience.includes('all')) {
        return false;
      }
      // Streaming platform check
      if (filters.streamingPlatform !== 'All Platforms' && !movie.streamingOn.includes(filters.streamingPlatform)) {
        return false;
      }
      // Curated collection filter
      if (filters.collection !== 'all' && movie.curatedCollection !== filters.collection) {
        return false;
      }
      // Search query check
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = movie.title.toLowerCase().includes(q);
        const matchesDirector = movie.director.toLowerCase().includes(q);
        const matchesGenre = movie.genres.some(g => g.toLowerCase().includes(q));
        const matchesCast = movie.cast.some(c => c.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDirector && !matchesGenre && !matchesCast) {
          return false;
        }
      }
      return true;
    });
  }, [filters]);

  // Spotlight movie selections for Hero section
  const spotlightMovies = useMemo(() => {
    return MOVIES_DATABASE.slice(0, 3);
  }, []);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07080B] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* 3-Zone Top Navigation Contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        watchlistCount={watchlistIds.length}
        onSurpriseMe={() => setIsSpinnerOpen(true)}
      />

      <main className="flex-1">
        {/* Tab 1: Mood Matcher View */}
        {activeTab === 'matcher' && (
          <div className="space-y-0">
            <HeroSection
              onExploreVibes={() => {
                const el = document.getElementById('vibe-console-anchor');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenMovie={(m) => setSelectedMovie(m)}
              spotlightMovies={spotlightMovies}
            />

            <div id="vibe-console-anchor">
              <VibeConsole
                filters={filters}
                setFilters={setFilters}
                onReset={handleResetFilters}
                onSpinTheReel={() => setIsSpinnerOpen(true)}
                matchCount={filteredMovies.length}
              />
            </div>

            {/* Results Grid Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-display font-bold text-white tracking-tight">
                    Tuned Cinematic Selections
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click any card to launch the trailer, review detailed reasons, or log your rating.
                  </p>
                </div>

                {/* Instant Search Bar */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={filters.searchQuery}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                    placeholder="Search by title, director, actor..."
                    className="w-full bg-[#11141F] border border-[#22283A] rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              {/* Movie Grid */}
              {filteredMovies.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {filteredMovies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onSelect={(m) => setSelectedMovie(m)}
                      isWatchlisted={watchlistIds.includes(movie.id)}
                      isWatched={Boolean(watchedReviews[movie.id])}
                      onToggleWatchlist={handleToggleWatchlist}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-[#0C0F17] border border-[#1E2333] rounded-2xl p-8 space-y-4">
                  <Film className="w-12 h-12 text-slate-600 mx-auto" />
                  <div className="space-y-1">
                    <h4 className="text-lg font-display font-bold text-slate-200">
                      No titles match this specific calibration
                    </h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Try broadening your runtime limit or switching emotional frequencies to widen the screening pool.
                    </p>
                  </div>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Catalog Lounge View */}
        {activeTab === 'catalog' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-display font-bold text-white tracking-tight">
                    Complete Repertory Catalog
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Browse 45+ acclaimed cinema masterworks categorized by cinematic movements and curation.
                  </p>
                </div>

                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={filters.searchQuery}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                    placeholder="Search by title, director, actor..."
                    className="w-full bg-[#11141F] border border-[#22283A] rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              {/* Curated Collection Filter Tabs */}
              <div className="flex flex-wrap gap-2 pt-2 border-b border-[#1E2333] pb-4">
                {[
                  { id: 'all', label: 'All Catalog' },
                  { id: 'trending', label: 'Trending Tonight' },
                  { id: 'award_darling', label: 'Award Darlings' },
                  { id: 'indie_gem', label: 'Indie Gems' },
                  { id: 'cult_classic', label: 'Cult Classics' },
                  { id: 'double_feature', label: 'Double Feature Seeds' },
                ].map((col) => (
                  <button
                    key={col.id}
                    onClick={() => setFilters(prev => ({ ...prev, collection: col.id }))}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                      filters.collection === col.id
                        ? 'bg-amber-400 text-slate-950 font-semibold shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 bg-[#121622] border border-[#1F2538]'
                    }`}
                  >
                    {col.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onSelect={(m) => setSelectedMovie(m)}
                  isWatchlisted={watchlistIds.includes(movie.id)}
                  isWatched={Boolean(watchedReviews[movie.id])}
                  onToggleWatchlist={handleToggleWatchlist}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: AI Vibe Architect View */}
        {activeTab === 'ai' && (
          <AIVibeArchitect
            onSelectMovie={(movie) => setSelectedMovie(movie)}
          />
        )}

        {/* Tab 4: Watchlist View */}
        {activeTab === 'watchlist' && (
          <WatchlistView
            watchlistIds={watchlistIds}
            watchedReviews={watchedReviews}
            onRemoveFromWatchlist={(id) => handleToggleWatchlist(id)}
            onOpenMovie={(m) => setSelectedMovie(m)}
            allMovies={MOVIES_DATABASE}
          />
        )}
      </main>

      {/* Detail Dossier Lightbox Modal */}
      <MediaModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        isWatchlisted={selectedMovie ? watchlistIds.includes(selectedMovie.id) : false}
        onToggleWatchlist={(id) => handleToggleWatchlist(id)}
        userReview={selectedMovie ? watchedReviews[selectedMovie.id] : undefined}
        onSaveReview={handleSaveReview}
      />

      {/* Reel Spinner Randomizer Modal */}
      <ReelSpinnerModal
        isOpen={isSpinnerOpen}
        onClose={() => setIsSpinnerOpen(false)}
        movies={filteredMovies.length > 0 ? filteredMovies : MOVIES_DATABASE}
        onSelectMovie={(movie) => setSelectedMovie(movie)}
      />

      {/* Motion Entrance Opening Curtain Animation */}
      {showEntrance && (
        <EntranceAnimation onComplete={() => setShowEntrance(false)} />
      )}

      {/* Quiet Anti-Slop Footer */}
      <footer className="border-t border-[#1E2333] bg-[#07080B] py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Film className="w-4 h-4 text-amber-400" />
            <span className="font-display font-semibold text-slate-300">CineVibe</span>
            <span>— The Sensory Movie & TV Show Discovery Lounge</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setShowEntrance(true)}
              className="text-amber-400/90 hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Replay Motion Intro</span>
            </button>
            <span aria-hidden="true">·</span>
            <span>Zero Algorithmic Fatigue</span>
            <span aria-hidden="true">·</span>
            <span>Client Vault Encrypted Locally</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
