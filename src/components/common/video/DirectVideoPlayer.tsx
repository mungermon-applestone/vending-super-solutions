
import React, { useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface DirectVideoPlayerProps {
  videoUrl: string;
  thumbnailUrl: string;
  contentType: string;
  title: string;
  className?: string;
  onError?: (error: Error) => void;
}

const DirectVideoPlayer: React.FC<DirectVideoPlayerProps> = ({
  videoUrl,
  thumbnailUrl,
  contentType,
  title,
  className = '',
  onError
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error(`[DirectVideoPlayer] Failed to load video: ${videoUrl}`, e);
    if (onError) {
      onError(new Error(`Failed to load video: ${videoUrl}`));
    }
  };

  return (
    <div className={`aspect-video relative ${className}`}>
      <video 
        ref={videoRef}
        src={videoUrl}
        poster={thumbnailUrl}
        controls
        autoPlay
        playsInline
        className="w-full h-full object-cover rounded-lg"
        onError={handleError}
      >
        <source src={videoUrl} type={contentType} />
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
};

export default DirectVideoPlayer;
