
import { Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ProductVideoSectionProps {
  title: string;
  description: string;
  videoId?: string;
  videoUrl?: string;
  thumbnailImage: string;
}

const ProductVideoSection = ({
  title,
  description,
  videoId,
  videoUrl,
  thumbnailImage
}: ProductVideoSectionProps) => {
  const [isVertical, setIsVertical] = useState<boolean | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Detect video orientation when loaded
  const handleVideoMetadataLoaded = () => {
    if (videoRef.current) {
      const { videoWidth, videoHeight } = videoRef.current;
      setIsVertical(videoHeight > videoWidth);
      setIsLoaded(true);
    }
  };

  // For YouTube videos, we'll use a post-load effect to check dimensions
  useEffect(() => {
    if (videoId) {
      // Default to horizontal for YouTube (most common)
      // YouTube aspect ratio is typically 16:9
      setIsVertical(false);
      setIsLoaded(true);
    }
  }, [videoId]);

  // For thumbnail fallback
  useEffect(() => {
    if (!videoId && !videoUrl && thumbnailImage) {
      // Load the thumbnail to check its orientation
      const img = new Image();
      img.onload = () => {
        setIsVertical(img.height > img.width);
        setIsLoaded(true);
      };
      img.src = thumbnailImage;
    }
  }, [videoId, videoUrl, thumbnailImage]);

  // Determine layout class based on orientation
  const layoutClass = isVertical 
    ? "flex flex-col md:flex-row md:items-center gap-8" 
    : "flex flex-col items-center";

  const videoContainerClass = isVertical
    ? "md:w-1/2 w-full"
    : "max-w-4xl w-full";

  const descriptionContainerClass = isVertical
    ? "md:w-1/2 w-full md:text-left text-center"
    : "max-w-2xl w-full text-center mt-6";

  // Custom styles for vertical videos to ensure proper containment
  const videoHeightStyle = isVertical 
    ? { maxHeight: '450px', objectFit: 'contain' as const } 
    : {};

  // Custom container style for vertical videos
  const containerStyle = isVertical 
    ? { height: '450px' } 
    : {};

  return (
    <section className="py-16 bg-white">
      <div className="container-wide">
        <div className={`transition-all duration-500 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'} ${layoutClass}`}>
          {/* Video Container */}
          <div className={videoContainerClass}>
            {videoId ? (
              <div 
                className={`relative rounded-lg overflow-hidden shadow-lg ${isVertical ? 'h-full flex justify-center' : 'aspect-w-16 aspect-h-9'}`} 
                style={isVertical ? containerStyle : {}}
              >
                <iframe 
                  ref={iframeRef}
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="Product video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className={`rounded-lg shadow-lg ${isVertical ? 'w-auto h-full object-contain' : 'w-full h-full'}`}
                  style={isVertical ? { maxWidth: '100%' } : {}}
                ></iframe>
              </div>
            ) : videoUrl ? (
              <div 
                className={`relative rounded-lg overflow-hidden shadow-lg ${isVertical ? 'h-full flex justify-center' : 'aspect-w-16 aspect-h-9'}`}
                style={isVertical ? containerStyle : {}}
              >
                <video 
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  poster={thumbnailImage}
                  className={`rounded-lg shadow-lg ${isVertical ? 'w-auto h-full object-contain' : 'w-full h-full object-cover'}`}
                  onLoadedMetadata={handleVideoMetadataLoaded}
                ></video>
              </div>
            ) : (
              <div 
                className="relative rounded-lg overflow-hidden shadow-lg" 
                style={isVertical ? containerStyle : {}}
              >
                <img 
                  src={thumbnailImage} 
                  alt="Video thumbnail" 
                  className={`${isVertical ? 'h-full w-auto mx-auto object-contain' : 'w-full h-auto'}`}
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    setIsVertical(img.naturalHeight > img.naturalWidth);
                    setIsLoaded(true);
                  }}
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-4 shadow-lg hover:bg-white transition-colors cursor-pointer">
                    <Play className="h-8 w-8 text-vending-blue fill-vending-blue" />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Description Container */}
          <div className={descriptionContainerClass}>
            <h2 className="text-3xl font-bold mb-4 text-vending-blue-dark">{title}</h2>
            <p className="text-gray-700">{description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductVideoSection;
