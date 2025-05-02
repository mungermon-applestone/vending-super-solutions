
import React, { useState, useEffect } from 'react';
import { standardizeVideoData, getVideoEmbedUrl } from '@/utils/videoHelpers';
import DirectVideoPlayer from './DirectVideoPlayer';
import EmbeddedVideoPlayer from './EmbeddedVideoPlayer';
import VideoThumbnail from './VideoThumbnail';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  title?: string;
  contentType?: string;
  isVideo?: boolean; 
  className?: string;
  autoPlay?: boolean;
  imageUrl?: string; // For fallback
}

const VideoPlayer: React.FC<VideoPlayerProps> = (props) => {
  // Always initialize these states, regardless of conditions
  const [isPlaying, setIsPlaying] = useState(props.autoPlay || false);
  const [error, setError] = useState<string | null>(null);
  
  // Standardize video data upfront - never skip this step
  const videoData = standardizeVideoData({
    videoUrl: props.videoUrl,
    thumbnailUrl: props.thumbnailUrl,
    imageUrl: props.imageUrl,
    contentType: props.contentType,
    title: props.title,
    isVideo: props.isVideo
  });

  // Debug logging that always runs
  useEffect(() => {
    console.log('[VideoPlayer] Initialized with processed data:', {
      ...videoData,
      originalProps: props,
      isPlaying,
      hasError: !!error
    });
  }, [videoData, props, isPlaying, error]);

  // Handle play button click - this doesn't affect hook order
  const handlePlay = () => {
    if (!videoData.videoUrl) {
      setError("No video URL provided");
      return;
    }
    
    console.log('[VideoPlayer] Playing video:', videoData.videoUrl);
    setIsPlaying(true);
  };

  // Handle errors from child components
  const handleError = (err: Error) => {
    const errorMsg = err.message || `Failed to load video: ${videoData.videoUrl}`;
    console.error(`[VideoPlayer] ${errorMsg}`);
    setError(errorMsg);
  };

  // If we don't have a video or valid URL, don't render anything
  if (!videoData.isVideo || !videoData.videoUrl) {
    console.log("[VideoPlayer] No video to display - missing URL or isVideo=false");
    return null;
  }

  // If there's an error, show error state
  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 p-4 rounded ${props.className}`}>
        <p className="text-red-700 text-sm">{error}</p>
      </div>
    );
  }

  // Show video player if playing
  if (isPlaying) {
    // Direct video (Contentful video or other direct video URL)
    if (videoData.isDirectVideo) {
      return (
        <DirectVideoPlayer 
          videoUrl={videoData.videoUrl}
          thumbnailUrl={videoData.thumbnailUrl}
          contentType={videoData.contentType}
          title={videoData.title}
          className={props.className || ''}
          onError={handleError}
        />
      );
    }
    
    // External video (YouTube or Vimeo)
    return (
      <EmbeddedVideoPlayer 
        embedUrl={getVideoEmbedUrl(videoData.videoUrl)}
        title={videoData.title}
        className={props.className || ''}
        onError={handleError}
      />
    );
  }

  // Show thumbnail with play button
  return (
    <VideoThumbnail
      thumbnailUrl={videoData.thumbnailUrl}
      title={videoData.title}
      className={props.className || ''}
      onClick={handlePlay}
      onError={handleError}
    />
  );
};

export default VideoPlayer;
