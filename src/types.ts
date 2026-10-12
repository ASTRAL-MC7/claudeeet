export type EnergyLevel = 'low' | 'medium' | 'high';
export type AudienceSetting = 'all' | 'solo' | 'date_night' | 'group';

export interface Movie {
  id: string;
  title: string;
  year: number;
  runtime: number; // in minutes
  rating: number; // e.g. 8.6
  mpaaRating: string; // e.g. 'PG-13', 'R'
  director: string;
  cast: string[];
  genres: string[];
  vibes: string[];
  energyLevel: EnergyLevel;
  audience: AudienceSetting[];
  synopsis: string;
  tagline: string;
  streamingOn: string[];
  posterUrl: string;
  backdropUrl?: string;
  youtubeTrailerId: string;
  previewVideoUrl?: string;
  quote: string;
  whyItFitsVibe: string;
  curatedCollection?: 'trending' | 'indie_gem' | 'award_darling' | 'cult_classic' | 'double_feature';
}

export interface VibeOption {
  id: string;
  label: string;
  iconName: string;
  description: string;
  accentColor: string;
  tagline: string;
}

export interface UserReview {
  movieId: string;
  rating: number; // 1 to 5
  note: string;
  watchedAt: string;
}

export interface VibeFilterState {
  mood: string;
  energy: EnergyLevel | 'all';
  maxRuntime: number;
  audience: AudienceSetting;
  streamingPlatform: string;
  searchQuery: string;
  collection: string;
}

export interface AIRecResponse {
  vibeAnalysis: string;
  recommendedMovieIds: string[];
  customPicks: {
    title: string;
    year: number;
    director: string;
    whyItFits: string;
    ambientTip: string;
  }[];
  pairedSnackOrDrink: string;
  ambianceSetting: string;
}
