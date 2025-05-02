
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

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
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
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
  
  // Detect content type if not provided
  const detectContentType = () => {
    if (contentType) return contentType;
    
    if (processedVideoUrl) {
      if (processedVideoUrl.endsWith('.mp4')) return 'video/mp4';
      if (processedVideoUrl.endsWith('.webm')) return 'video/webm';
      if (processedVideoUrl.endsWith('.ogg')) return 'video/ogg';
      if (processedVideoUrl.endsWith('.mov')) return 'video/quicktime';
    }
    
    // Default to mp4 if we can't determine
    return 'video/mp4';
  };
  
  // Detect if this is a Contentful direct video upload
  const isContentfulVideo = () => {
    if (!processedVideoUrl) return false;
    
    if (contentType && (contentType.includes('video/') || contentType.includes('application/'))) {
      return true;
    }
    
    // Check URL patterns
    if (processedVideoUrl && (
      processedVideoUrl.includes('videos.ctfassets.net') || 
      processedVideoUrl.includes('.mp4') || 
      processedVideoUrl.includes('.webm') || 
      processedVideoUrl.includes('.mov')
    )) {
      return true;
    }
    
    return false;
  };
  
  // Check if this is YouTube or Vimeo
  const isYouTube = processedVideoUrl?.includes('youtube.com') || processedVideoUrl?.includes('youtu.be');
  const isVimeo = processedVideoUrl?.includes('vimeo.com');
  const isExternalVideo = isYouTube || isVimeo;
  const isDirectVideo = isContentfulVideo();
  
  // Process external video URLs for embedding
  const getEmbedUrl = () => {
    if (!processedVideoUrl) return '';
    
    // YouTube URLs
    if (isYouTube) {
      let videoId = '';
      if (processedVideoUrl.includes('youtube.com/watch?v=')) {
        videoId = processedVideoUrl.split('v=')[1];
        const ampersandPosition = videoId?.indexOf('&');
        if (ampersandPosition !== -1) {
          videoId = videoId.substring(0, ampersandPosition);
        }
      } else if (processedVideoUrl.includes('youtu.be/')) {
        videoId = processedVideoUrl.split('youtu.be/')[1];
      }
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
    }
    
    // Vimeo URLs
    if (isVimeo) {
      const vimeoRegex = /vimeo\.com\/(\d+)($|\/|\?)/;
      const match = processedVideoUrl.match(vimeoRegex);
      if (match && match[1]) {
        return `https://player.vimeo.com/video/${match[1]}?autoplay=1`;
      }
    }
    
    return processedVideoUrl;
  };

  const handlePlay = () => {
    if (!processedVideoUrl) {
      setError("No video URL provided");
      return;
    }
    
    console.log('[VideoPlayer] Playing video:', processedVideoUrl);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement | HTMLIFrameElement, Event>) => {
    const errorMsg = `Failed to load video: ${processedVideoUrl}`;
    console.error(`[VideoPlayer] ${errorMsg}`, e);
    setError(errorMsg);
  };

  // Debug what type of video we have
  useEffect(() => {
    console.log('[VideoPlayer] Video type analysis:', {
      url: processedVideoUrl,
      isDirectVideo,
      isExternalVideo,
      isYouTube,
      isVimeo,
      contentType: detectContentType(),
      providedContentType: contentType
    });
  }, [processedVideoUrl, contentType]);

  // Guard clause if we don't have a video or valid URL
  if (!isVideo || !processedVideoUrl) {
    console.log("[VideoPlayer] No video to display - missing URL or isVideo=false");
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
    // Direct video (Contentful video or other direct video URL)
    if (isDirectVideo) {
      const detectedContentType = detectContentType();
      console.log("[VideoPlayer] Rendering direct video with type:", detectedContentType);
      
      return (
        <div className={`aspect-video relative ${className}`}>
          <video 
            ref={videoRef}
            src={processedVideoUrl}
            poster={processedThumbnailUrl}
            controls
            autoPlay
            playsInline
            className="w-full h-full object-cover rounded-lg"
            onError={handleError as any}
          >
            <source src={processedVideoUrl} type={detectedContentType} />
            Your browser does not support the video tag.
          </video>
          <div className="absolute bottom-2 right-2 bg-black/50 rounded-full p-2 cursor-pointer" onClick={toggleMute}>
            {isMuted ? (
              <VolumeX className="h-5 w-5 text-white" />
            ) : (
              <Volume2 className="h-5 w-5 text-white" />
            )}
          </div>
        </div>
      );
    }
    
    // YouTube or Vimeo embed
    if (isExternalVideo) {
      console.log("[VideoPlayer] Rendering external video embed");
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
    
    // Fallback for unknown video types
    console.log("[VideoPlayer] Rendering fallback video player");
    return (
      <div className={`aspect-video ${className}`}>
        <video 
          ref={videoRef}
          src={processedVideoUrl}
          poster={processedThumbnailUrl}
          controls
          autoPlay
          playsInline
          className="w-full h-full object-cover rounded-lg"
          onError={handleError as any}
        >
          <source src={processedVideoUrl} type="video/mp4" />
          <source src={processedVideoUrl} type="video/webm" />
          <source src={processedVideoUrl} type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // Show thumbnail with play button
  console.log("[VideoPlayer] Rendering thumbnail with play button");
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
