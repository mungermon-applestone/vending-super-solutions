import React from 'react';
import VideoPlayer from './video/VideoPlayer';
import VideoErrorBoundary from './video/VideoErrorBoundary';

interface HeroVideoProps {
  isVideo: boolean;
  videoUrl?: string;
  videoThumbnail?: string;
  videoContentType?: string;
  imageUrl: string; // Always required as fallback
  imageAlt: string;
  className?: string;
}

const HeroVideo: React.FC<HeroVideoProps> = ({
  isVideo,
  videoUrl,
  videoThumbnail,
  videoContentType,
  imageUrl,
  imageAlt,
  className = ''
}) => {
  // If this isn't a video or we don't have a video URL, just show the image
  if (!isVideo || !videoUrl) {
    return (
      <div className={`bg-white rounded-lg shadow-xl overflow-hidden ${className}`}>
        <img 
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-auto object-cover"
          onError={(e) => {
            console.error("[HeroVideo] Image failed to load:", imageUrl);
            e.currentTarget.src = "https://images.unsplash.com/photo-1605810230434-7631ac76ec81";
          }}
        />
      </div>
    );
  }

  // Otherwise, show the video with a fallback to the image
  return (
    <div className={`relative ${className}`}>
      <VideoErrorBoundary fallbackImage={imageUrl}>
        <VideoPlayer
          videoUrl={videoUrl}
          thumbnailUrl={videoThumbnail || imageUrl}
          contentType={videoContentType || ''}
          title={imageAlt}
          className="w-full shadow-xl rounded-lg"
          isVideo={true}
          imageUrl={imageUrl}
        />
      </VideoErrorBoundary>
    </div>
  );
};

export default HeroVideo;
