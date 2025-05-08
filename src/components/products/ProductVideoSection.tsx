
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
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl font-bold mb-4 text-vending-blue-dark">{title}</h2>
              <p className="text-gray-600 text-lg mb-6">{description}</p>
              
              <VideoPlayer 
                video={videoSource} 
                className="max-w-md mx-auto lg:mx-0"
                aspectRatio={9/16} // Vertical video aspect ratio
              />
            </div>
            <div className="w-full lg:w-1/2">
              <div className="bg-gray-50 p-6 rounded-lg mt-8 lg:mt-16">
                <h3 className="text-xl font-medium mb-2 text-vending-blue-dark">In this video</h3>
                <p className="text-gray-600">See our vending solution in action and learn how we address common business challenges.</p>
              </div>
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
