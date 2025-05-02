
import React from 'react';
import VideoPlayer from './video/VideoPlayer';

// This component maintains the original API for backward compatibility
// but forwards everything to our new implementation
interface LegacyVideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  title?: string;
  contentType?: string;
  isVideo?: boolean;
  className?: string;
  autoPlay?: boolean;
}

const LegacyVideoPlayer: React.FC<LegacyVideoPlayerProps> = (props) => {
  console.log('[LegacyVideoPlayer] Redirecting to new VideoPlayer implementation', props);
  
  // Simply pass all props through to the new implementation
  return <VideoPlayer {...props} />;
};

export default LegacyVideoPlayer;
