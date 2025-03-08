
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAnimeDetails } from '@/hooks/useAnime';
import { getImageUrl } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Play, Star, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';

const AnimeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const animeId = parseInt(id || '0');
  const { data: anime, isLoading, error } = useAnimeDetails(animeId);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    // Reset scroll position when navigating to a new anime
    window.scrollTo(0, 0);
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-20 max-w-7xl mx-auto px-4 md:px-10">
          <div className="w-full h-[40vh] rounded-xl overflow-hidden">
            <Skeleton className="w-full h-full" />
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !anime) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-28 max-w-7xl mx-auto px-4 md:px-10 text-center">
          <h2 className="text-2xl font-semibold mb-4">Failed to load anime details</h2>
          <p className="text-gray-500 mb-6">{error?.message || 'Something went wrong'}</p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const releaseYear = anime.first_air_date ? new Date(anime.first_air_date).getFullYear() : '';
  
  return (
    <div className="min-h-screen pb-16">
      <Navbar />
      
      {/* Backdrop Image */}
      <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-gray-100">
          <img
            src={getImageUrl(anime.backdrop_path, 'original')}
            alt={anime.name}
            className="w-full h-full object-cover object-top"
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 -mt-20 md:-mt-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr] gap-8">
          {/* Poster */}
          <div className="relative aspect-[2/3] w-full max-w-[250px] md:max-w-none mx-auto md:mx-0 rounded-lg overflow-hidden shadow-xl">
            <div className={cn(
              "absolute inset-0 bg-gray-100",
              !imageLoaded && "animate-pulse"
            )} />
            <img
              src={getImageUrl(anime.poster_path, 'w500')}
              alt={anime.name}
              className="w-full h-full object-cover"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
          
          {/* Details */}
          <div className="animate-fade-in">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              {anime.genres.slice(0, 3).map((genre) => (
                <div 
                  key={genre.id} 
                  className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
                >
                  {genre.name}
                </div>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-balance">
              {anime.name}
            </h1>
            
            {anime.original_name !== anime.name && (
              <h2 className="text-lg text-gray-500 mb-4">
                {anime.original_name}
              </h2>
            )}
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 text-sm">
              {releaseYear && (
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1 text-gray-400" />
                  <span>{releaseYear}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <Star size={16} className="mr-1 text-yellow-400 fill-yellow-400" />
                <span>{anime.vote_average.toFixed(1)}</span>
                <span className="text-gray-400 ml-1">({anime.vote_count} votes)</span>
              </div>
              
              {anime.number_of_episodes && (
                <div className="flex items-center">
                  <Clock size={16} className="mr-1 text-gray-400" />
                  <span>{anime.number_of_episodes} episodes</span>
                </div>
              )}
            </div>
            
            <div className="mb-8">
              <h3 className="font-medium mb-2">Overview</h3>
              <p className="text-gray-600 leading-relaxed text-balance">
                {anime.overview || 'No overview available.'}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <Button size="lg" className="rounded-full px-6">
                <Play size={18} className="mr-2" />
                Watch Now
              </Button>
            </div>
            
            <Separator className="my-8" />
            
            {anime.seasons && anime.seasons.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Seasons</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {anime.seasons.map((season) => (
                    <div key={season.id} className="rounded-lg border bg-card shadow-sm hover-scale">
                      <div className="aspect-video rounded-t-lg overflow-hidden">
                        <img
                          src={getImageUrl(season.poster_path, 'w300') || getImageUrl(anime.poster_path, 'w300')}
                          alt={season.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium text-sm line-clamp-1">{season.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {season.episode_count} episodes
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Status</span>
                  <span className="font-medium">{anime.status}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium">{anime.type || 'TV'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">First Air Date</span>
                  <span className="font-medium">{anime.first_air_date || 'Unknown'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Original Language</span>
                  <span className="font-medium capitalize">{anime.original_language}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">Popularity</span>
                  <span className="font-medium">{anime.popularity.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetail;
