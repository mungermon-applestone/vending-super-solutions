
import React from 'react';

interface EmbeddedVideoPlayerProps {
  embedUrl: string;
  title: string;
  className?: string;
  onError?: (error: Error) => void;
}

const EmbeddedVideoPlayer: React.FC<EmbeddedVideoPlayerProps> = ({
  embedUrl,
  title,
  className = '',
  onError
}) => {
  const handleError = (e: React.SyntheticEvent<HTMLIFrameElement, Event>) => {
    console.error(`[EmbeddedVideoPlayer] Failed to load video: ${embedUrl}`, e);
    if (onError) {
      onError(new Error(`Failed to load embedded video: ${embedUrl}`));
    }
  };

  return (
    <div className={`aspect-video ${className}`}>
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full rounded-lg"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onError={handleError}
      ></iframe>
    </div>
  );
};

export default EmbeddedVideoPlayer;
