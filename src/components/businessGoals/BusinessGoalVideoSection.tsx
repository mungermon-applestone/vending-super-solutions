
import React, { useState, useEffect, useRef } from 'react';

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
  const [videoLoading, setVideoLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    // Log when video component mounts or updates
    console.log('[BusinessGoalVideoSection] Rendering with video:', video);
    
    // Reset error state when video prop changes
    setVideoError(false);
    setVideoLoading(true);
    
    // Validate the video URL format
    if (video && video.url) {
      // Check if URL is properly formatted
      if (!video.url.startsWith('http')) {
        console.error('[BusinessGoalVideoSection] Invalid video URL format:', video.url);
      }
    }
  }, [video]);

  if (!video || !video.url) {
    console.log('[BusinessGoalVideoSection] No video URL provided');
    return null;
  }
  
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    console.error('[BusinessGoalVideoSection] Error loading video:', e);
    setVideoError(true);
    setVideoLoading(false);
  };
  
  const handleVideoLoad = () => {
    console.log('[BusinessGoalVideoSection] Video loaded successfully');
    setVideoLoading(false);
  };
  
  // Clean URL if needed
  const videoUrl = video.url.startsWith('//') 
    ? `https:${video.url}` 
    : !video.url.startsWith('http') && !video.url.startsWith('//')
      ? `https://${video.url}`
      : video.url;
  
  console.log('[BusinessGoalVideoSection] Final video URL:', videoUrl);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold mb-4 text-vending-blue-dark">{title}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{description}</p>
        </div>
        
        {videoLoading && !videoError && (
          <div className="aspect-video rounded-lg overflow-hidden shadow-xl max-w-4xl mx-auto bg-gray-100 flex items-center justify-center">
            <div className="text-center p-6">
              <svg className="animate-spin h-10 w-10 text-vending-blue mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <p className="mt-4 text-gray-600">Loading video...</p>
            </div>
          </div>
        )}
        
        {videoError ? (
          <div className="aspect-video rounded-lg overflow-hidden shadow-xl max-w-4xl mx-auto bg-gray-100 flex items-center justify-center">
            <div className="text-center p-6">
              <p className="text-lg text-gray-600">Unable to load video</p>
              <p className="text-sm text-gray-500 mt-2">Video URL: {videoUrl}</p>
              <button 
                className="mt-4 px-4 py-2 bg-vending-blue text-white rounded hover:bg-vending-blue-dark" 
                onClick={() => {
                  setVideoError(false);
                  setVideoLoading(true);
                  if (videoRef.current) {
                    videoRef.current.load();
                  }
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className={`aspect-video rounded-lg overflow-hidden shadow-xl max-w-4xl mx-auto ${videoLoading ? 'hidden' : ''}`}>
            <video
              ref={videoRef}
              src={videoUrl}
              title={video.title || 'Business goal video'}
              controls
              className="w-full h-full object-cover"
              onError={handleVideoError}
              onLoadedData={handleVideoLoad}
              onLoadStart={() => console.log('[BusinessGoalVideoSection] Video load started')}
            />
          </div>
        )}
        
        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 border border-gray-200 rounded bg-gray-50 max-w-4xl mx-auto text-xs">
            <p>Video ID: {video.id || 'Not provided'}</p>
            <p>Original Video URL: {video.url}</p>
            <p>Processed Video URL: {videoUrl}</p>
            <p>Video Title: {video.title || 'Not provided'}</p>
            <p>Error State: {videoError ? 'Yes' : 'No'}</p>
            <p>Loading State: {videoLoading ? 'Yes' : 'No'}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BusinessGoalVideoSection;
