
import React, { useEffect } from 'react';
import VideoPlayer, { VideoSource } from '@/components/common/VideoPlayer';

interface ProductVideoSectionProps {
  title: string;
  description: string;
  videoId?: string;
  videoUrl?: string;
  thumbnailImage: string;
  orientation?: 'vertical' | 'horizontal';
}

/**
 * ProductVideoSection Component
 * 
 * This component displays a video player alongside product information with two layout options:
 * 
 * 1. Vertical Video Layout (orientation="vertical"):
 *    - Uses a side-by-side layout on larger screens (flex-row on lg+)
 *    - Video appears on the left (lg:w-1/2) with text content on the right
 *    - Video uses 9/16 aspect ratio optimized for vertical/portrait content
 *    - The video container uses "w-full max-w-md" to maintain proper sizing
 * 
 * 2. Horizontal Video Layout (orientation="horizontal" or default):
 *    - Uses a stacked layout (flex-col)
 *    - Title and description appear above the video
 *    - Video is centered with max-w-4xl constraint
 *    - Video uses standard 16/9 aspect ratio
 * 
 * IMPORTANT: The video container width/sizing is critical for both layouts:
 * - For vertical videos: Use sufficient width (max-w-md) to prevent squishing
 * - For horizontal videos: The container should be wider (max-w-4xl)
 */
const ProductVideoSection = ({
  title,
  description,
  videoId,
  videoUrl,
  thumbnailImage,
  orientation = 'horizontal'
}: ProductVideoSectionProps) => {
  // Log props for debugging
  useEffect(() => {
    console.log('[ProductVideoSection] Rendering with props:', {
      title,
      description,
      videoId,
      videoUrl,
      thumbnailImage,
      orientation
    });
  }, [title, description, videoId, videoUrl, thumbnailImage, orientation]);

  // Prepare video source object with proper thumbnail
  const videoSource: VideoSource = {
    youtubeId: videoId,
    url: videoUrl,
    title: title,
    orientation: orientation,
    thumbnailImage: thumbnailImage ? {
      url: thumbnailImage,
      alt: `${title} video thumbnail`
    } : undefined
  };

  // Determine if video is vertical
  const isVertical = orientation === 'vertical';
  
  console.log('[ProductVideoSection] Video layout:', isVertical ? 'vertical' : 'horizontal');
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        {isVertical ? (
          // Vertical video layout - video on left, content on right
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 max-w-5xl mx-auto">
            <div className="w-full lg:w-1/2 flex justify-center">
              <VideoPlayer 
                video={videoSource} 
                className="w-full max-w-md" // Restored wider container for vertical video
                aspectRatio={9/16} // Vertical video aspect ratio
              />
            </div>
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl font-bold mb-4 text-vending-blue-dark">{title}</h2>
              <p className="text-gray-600 text-lg">{description}</p>
            </div>
          </div>
        ) : (
          // Horizontal video layout - video centered, content below
          <div className="flex flex-col items-center">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-vending-blue-dark">{title}</h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">{description}</p>
            </div>
            
            <div className="max-w-4xl w-full mx-auto">
              <VideoPlayer 
                video={videoSource} 
                aspectRatio={16/9} // Horizontal video aspect ratio
              />
              
              <p className="text-sm text-gray-500 mt-4 text-center">
                See our vending solution in action
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductVideoSection;
