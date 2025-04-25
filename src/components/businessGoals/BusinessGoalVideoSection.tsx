
import React, { useState, useEffect } from 'react';

interface BusinessGoalVideoProps {
  video: {
    url: string;
    title?: string;
    id?: string;
  };
  title?: string;
  description?: string;
}

const BusinessGoalVideoSection: React.FC<BusinessGoalVideoProps> = ({
  video,
  title = "See it in action",
  description = "Watch our solution help businesses achieve their goals"
}) => {
  const [videoError, setVideoError] = useState(false);
  
  useEffect(() => {
    // Log when video component mounts or updates
    console.log('[BusinessGoalVideoSection] Rendering with video:', video);
  }, [video]);

  if (!video || !video.url) {
    console.log('[BusinessGoalVideoSection] No video URL provided');
    return null;
  }
  
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    console.error('[BusinessGoalVideoSection] Error loading video:', e);
    setVideoError(true);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold mb-4 text-vending-blue-dark">{title}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{description}</p>
        </div>
        
        {videoError ? (
          <div className="aspect-video rounded-lg overflow-hidden shadow-xl max-w-4xl mx-auto bg-gray-100 flex items-center justify-center">
            <div className="text-center p-6">
              <p className="text-lg text-gray-600">Unable to load video</p>
              <p className="text-sm text-gray-500 mt-2">Video URL: {video.url}</p>
            </div>
          </div>
        ) : (
          <div className="aspect-video rounded-lg overflow-hidden shadow-xl max-w-4xl mx-auto">
            <video
              src={video.url}
              title={video.title || 'Business goal video'}
              controls
              className="w-full h-full object-cover"
              onError={handleVideoError}
            />
          </div>
        )}
        
        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 border border-gray-200 rounded bg-gray-50 max-w-4xl mx-auto text-xs">
            <p>Video ID: {video.id || 'Not provided'}</p>
            <p>Video URL: {video.url}</p>
            <p>Video Title: {video.title || 'Not provided'}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BusinessGoalVideoSection;
