
import React, { useState, useEffect, useRef } from 'react';

interface BusinessGoalVideoProps {
  video: {
    url: string | null;
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
    console.log('[BusinessGoalVideoSection] Component mounted/updated with video:', video);
    setVideoError(false);
    setVideoLoading(true);
    
    if (!video) {
      console.error('[BusinessGoalVideoSection] Video object is missing');
      setVideoError(true);
      setVideoLoading(false);
      return;
    }
    
    if (!video.url) {
      console.error('[BusinessGoalVideoSection] Video URL is missing:', video);
      setVideoError(true);
      setVideoLoading(false);
      return;
    }

    console.log('[BusinessGoalVideoSection] Processing video URL:', video.url);
    
    // Validate URL format
    try {
      const urlToCheck = video.url.startsWith('//') ? `https:${video.url}` : video.url;
      new URL(urlToCheck);
      console.log('[BusinessGoalVideoSection] Valid URL format:', urlToCheck);
    } catch (e) {
      console.error('[BusinessGoalVideoSection] Invalid URL format:', e);
      setVideoError(true);
      setVideoLoading(false);
    }
  }, [video]);

  // Early return if no video data
  if (!video || !video.url) {
    console.log('[BusinessGoalVideoSection] No valid video URL provided, not rendering video section');
    return null;
  }
  
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    console.error('[BusinessGoalVideoSection] Error loading video:', e);
    const videoElement = e.currentTarget;
    console.error('[BusinessGoalVideoSection] Video error details:', {
      error: videoElement.error,
      networkState: videoElement.networkState,
      readyState: videoElement.readyState,
      src: videoElement.src
    });
    setVideoError(true);
    setVideoLoading(false);
  };
  
  const handleVideoLoad = () => {
    console.log('[BusinessGoalVideoSection] Video loaded successfully');
    setVideoLoading(false);
  };
  
  // Clean and validate URL
  let videoUrl = '';
  
  if (video.url) {
    if (video.url.startsWith('//')) {
      videoUrl = `https:${video.url}`;
    } else if (!video.url.startsWith('http') && !video.url.startsWith('//')) {
      videoUrl = `https://${video.url}`;
    } else {
      videoUrl = video.url;
    }
  }
  
  console.log('[BusinessGoalVideoSection] Final processed video URL:', videoUrl);

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
        
        <div className="mt-4 p-4 border border-gray-200 rounded bg-gray-50 max-w-4xl mx-auto text-xs">
          <p><strong>Video Diagnostics:</strong></p>
          <p>Video ID: {video.id || 'Not provided'}</p>
          <p>Original Video URL: {video.url}</p>
          <p>Processed Video URL: {videoUrl}</p>
          <p>Video Title: {video.title || 'Not provided'}</p>
          <p>Error State: {videoError ? 'Yes' : 'No'}</p>
          <p>Loading State: {videoLoading ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </section>
  );
};

export default BusinessGoalVideoSection;
