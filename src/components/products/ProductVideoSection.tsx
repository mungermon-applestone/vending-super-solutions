
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

  return (
    <section className="py-16 bg-white">
      <div className="container-wide">
        <div className={`transition-all duration-500 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'} ${layoutClass}`}>
          {/* Video Container */}
          <div className={videoContainerClass}>
            {videoId ? (
              <div className={`aspect-w-16 aspect-h-9 ${isVertical ? 'md:aspect-w-9 md:aspect-h-16' : ''}`}>
                <iframe 
                  ref={iframeRef}
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="Product video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-lg shadow-lg"
                ></iframe>
              </div>
            ) : videoUrl ? (
              <div className={`aspect-w-16 aspect-h-9 ${isVertical ? 'md:aspect-w-9 md:aspect-h-16' : ''}`}>
                <video 
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  poster={thumbnailImage}
                  className="w-full h-full rounded-lg shadow-lg object-cover"
                  onLoadedMetadata={handleVideoMetadataLoaded}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={thumbnailImage} 
                  alt="Video thumbnail" 
                  className="w-full h-auto"
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
            <p className="subtitle">{description}</p>
            <p className="text-sm text-gray-500 mt-4">
              See our vending solution in action
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductVideoSection;
