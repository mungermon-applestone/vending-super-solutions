
import React from 'react';
import { Play } from 'lucide-react';

interface VideoThumbnailProps {
  thumbnailUrl: string;
  title: string;
  className?: string;
  onClick: () => void;
  onError?: (error: Error) => void;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  thumbnailUrl,
  title,
  className = '',
  onClick,
  onError
}) => {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`[VideoThumbnail] Failed to load thumbnail: ${thumbnailUrl}`, e);
    if (onError) {
      onError(new Error(`Failed to load thumbnail: ${thumbnailUrl}`));
    }
    e.currentTarget.src = '/placeholder.jpg';
  };

  return (
    <div 
      className={`relative cursor-pointer rounded-lg overflow-hidden ${className}`}
      onClick={onClick}
    >
      <img
        src={thumbnailUrl || '/placeholder.jpg'}
        alt={title}
        className="w-full h-full object-cover"
        onError={handleError}
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
        <div className="bg-vending-blue/90 rounded-full p-5 text-white hover:bg-vending-blue transition-colors">
          <Play className="h-12 w-12" />
        </div>
      </div>
    </div>
  );
};

export default VideoThumbnail;
