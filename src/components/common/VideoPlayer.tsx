
import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  title?: string;
  contentType?: string;
  isVideo?: boolean;
  className?: string;
  autoPlay?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  thumbnailUrl,
  title = "Video content",
  contentType,
  isVideo = true,
  className = "",
  autoPlay = false
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [error, setError] = useState<string | null>(null);
  
  // Debug logging for troubleshooting
  useEffect(() => {
    console.log('[VideoPlayer] Initialized with:', {
      videoUrl,
      thumbnailUrl,
      contentType,
      isVideo,
      isPlaying
    });
  }, [videoUrl, thumbnailUrl, contentType, isVideo, isPlaying]);

  // Ensure URLs have proper protocol
  const processedVideoUrl = videoUrl?.startsWith('//') ? `https:${videoUrl}` : videoUrl;
  const processedThumbnailUrl = thumbnailUrl?.startsWith('//') ? `https:${thumbnailUrl}` : thumbnailUrl;
  
  // Detect if this is a Contentful direct video upload
  const isContentfulVideo = contentType && (
    contentType.includes('video/') || 
    contentType.includes('application/')
  );
  
  // Check if this is YouTube or Vimeo
  const isYouTube = videoUrl?.includes('youtube.com') || videoUrl?.includes('youtu.be');
  const isVimeo = videoUrl?.includes('vimeo.com');
  const isExternalVideo = isYouTube || isVimeo;
  
  // Process external video URLs for embedding
  const getEmbedUrl = () => {
    if (!videoUrl) return '';
    
    // YouTube URLs
    if (isYouTube) {
      let videoId = '';
      if (videoUrl.includes('youtube.com/watch?v=')) {
        videoId = videoUrl.split('v=')[1];
        const ampersandPosition = videoId?.indexOf('&');
        if (ampersandPosition !== -1) {
          videoId = videoId.substring(0, ampersandPosition);
        }
      } else if (videoUrl.includes('youtu.be/')) {
        videoId = videoUrl.split('youtu.be/')[1];
      }
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
    }
    
    // Vimeo URLs
    if (isVimeo) {
      const vimeoRegex = /vimeo\.com\/(\d+)($|\/|\?)/;
      const match = videoUrl.match(vimeoRegex);
      if (match && match[1]) {
        return `https://player.vimeo.com/video/${match[1]}?autoplay=1`;
      }
    }
    
    return processedVideoUrl;
  };

  const handlePlay = () => {
    if (!videoUrl) {
      setError("No video URL provided");
      return;
    }
    
    console.log('[VideoPlayer] Playing video:', videoUrl);
    setIsPlaying(true);
  };

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement | HTMLIFrameElement, Event>) => {
    const errorMsg = `Failed to load video: ${processedVideoUrl}`;
    console.error(`[VideoPlayer] ${errorMsg}`, e);
    setError(errorMsg);
  };

  if (!isVideo || !videoUrl) {
    return null;
  }

  // If there's an error, show error state
  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 p-4 rounded ${className}`}>
        <p className="text-red-700 text-sm">{error}</p>
      </div>
    );
  }

  // Show video player if playing
  if (isPlaying) {
    // Direct Contentful video or other direct video URL
    if (!isExternalVideo) {
      return (
        <div className={`aspect-video ${className}`}>
          <video 
            src={processedVideoUrl}
            poster={processedThumbnailUrl}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-cover rounded-lg"
            onError={handleError as any}
          >
            <source src={processedVideoUrl} type={contentType} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
    
    // YouTube or Vimeo embed
    return (
      <div className={`aspect-video ${className}`}>
        <iframe
          src={getEmbedUrl()}
          title={title}
          className="w-full h-full rounded-lg"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onError={handleError as any}
        ></iframe>
      </div>
    );
  }

  // Show thumbnail with play button
  return (
    <div 
      className={`relative cursor-pointer rounded-lg overflow-hidden ${className}`}
      onClick={handlePlay}
    >
      <img
        src={processedThumbnailUrl || '/placeholder.jpg'}
        alt={title}
        className="w-full h-full object-cover"
        onError={(e) => {
          console.error('[VideoPlayer] Failed to load thumbnail, using fallback');
          e.currentTarget.src = '/placeholder.jpg';
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
        <div className="bg-vending-blue/90 rounded-full p-5 text-white hover:bg-vending-blue transition-colors">
          <Play className="h-12 w-12" />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
