
import React, { useState, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

export interface VideoSource {
  url?: string;
  youtubeId?: string;
  title?: string;
  orientation?: 'vertical' | 'horizontal';
  thumbnailImage?: {
    url: string;
    alt?: string;
  };
}

interface VideoPlayerProps {
  video: VideoSource;
  className?: string;
  aspectRatio?: number; // Default aspect ratio can be overridden
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  video, 
  className = '',
  aspectRatio
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Determine if it's vertical or horizontal video
  const isVertical = video.orientation === 'vertical';
  
  // Calculate aspect ratio based on orientation if not explicitly provided
  const videoAspectRatio = aspectRatio || (isVertical ? 9/16 : 16/9);

  // Log video properties on mount for debugging
  useEffect(() => {
    console.log('[VideoPlayer] Props:', {
      orientation: video.orientation,
      isVertical,
      aspectRatio: videoAspectRatio,
      thumbnailUrl: video.thumbnailImage?.url,
      title: video.title
    });
    
    // Additional debugging for thumbnail issues
    if (video.thumbnailImage) {
      console.log('[VideoPlayer] Thumbnail image URL:', video.thumbnailImage.url);
      
      // Preload image to check if it loads correctly
      const img = new Image();
      img.onload = () => {
        console.log('[VideoPlayer] Thumbnail image loaded successfully:', {
          width: img.width,
          height: img.height,
          src: img.src
        });
      };
      img.onerror = (e) => {
        console.error('[VideoPlayer] Error loading thumbnail image:', e);
      };
      img.src = video.thumbnailImage.url;
    } else {
      console.warn('[VideoPlayer] No thumbnail image provided');
    }
  }, [video, isVertical, videoAspectRatio]);
  
  const handlePlayClick = () => {
    setIsPlaying(true);
    setIsLoading(true);
    
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error('[VideoPlayer] Error playing video:', error);
        setHasError(true);
        setIsPlaying(false);
        setIsLoading(false);
      });
    }
  };
  
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    console.error('[VideoPlayer] Video error:', e);
    setHasError(true);
    setIsPlaying(false);
    setIsLoading(false);
  };
  
  const handleVideoLoaded = () => {
    setIsLoading(false);
  };
  
  const handleThumbnailLoaded = () => {
    console.log('[VideoPlayer] Thumbnail loaded successfully');
    setThumbnailLoaded(true);
  };
  
  const handleThumbnailError = () => {
    console.error('[VideoPlayer] Thumbnail failed to load:', video.thumbnailImage?.url);
    setThumbnailLoaded(false);
  };

  return (
    <div className={`video-player relative overflow-hidden rounded-lg shadow-xl ${className}`}>
      <AspectRatio ratio={videoAspectRatio} className="bg-gray-100">
        {isPlaying ? (
          <>
            {video.youtubeId ? (
              <iframe 
                src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
                title={video.title || "Video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                onLoad={() => setIsLoading(false)}
              />
            ) : video.url ? (
              <video
                ref={videoRef}
                src={video.url}
                controls
                autoPlay
                className="absolute inset-0 w-full h-full object-contain"
                onError={handleVideoError}
                onLoadedData={handleVideoLoaded}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <p>No video source available</p>
              </div>
            )}
            
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
              </div>
            )}
          </>
        ) : (
          // Thumbnail view with play button
          <div className="absolute inset-0">
            {video.thumbnailImage?.url ? (
              <>
                <img 
                  src={video.thumbnailImage.url} 
                  alt={video.thumbnailImage.alt || video.title || "Video thumbnail"}
                  className={`absolute inset-0 w-full h-full ${isVertical ? 'object-contain' : 'object-cover'}`}
                  onLoad={handleThumbnailLoaded}
                  onError={handleThumbnailError}
                />
                {!thumbnailLoaded && (
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">Loading thumbnail...</p>
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">No thumbnail available</p>
              </div>
            )}
            
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <button 
                onClick={handlePlayClick}
                className="bg-white/90 rounded-full p-4 shadow-lg hover:bg-white transition-colors"
                aria-label="Play video"
              >
                <Play className="h-8 w-8 text-vending-blue fill-vending-blue" />
              </button>
            </div>
          </div>
        )}
        
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center p-4">
              <p className="text-red-500 font-medium">Error loading video</p>
              <button 
                onClick={() => {
                  setHasError(false);
                  setIsPlaying(true);
                  setIsLoading(true);
                }}
                className="mt-3 px-4 py-2 bg-vending-blue text-white rounded hover:bg-vending-blue-dark"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </AspectRatio>
    </div>
  );
};

export default VideoPlayer;
