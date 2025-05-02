
import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface HeroImageProps {
  imageUrl: string;
  imageAlt: string;
  videoUrl?: string;
  isVideo?: boolean;
  videoThumbnail?: string;
  videoContentType?: string;
}

const HeroImage: React.FC<HeroImageProps> = ({ 
  imageUrl, 
  imageAlt,
  videoUrl,
  isVideo = false,
  videoThumbnail,
  videoContentType
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Log rendering for debugging
  React.useEffect(() => {
    console.log('[HeroImage] Rendering with:', {
      imageUrl,
      imageAlt,
      videoUrl,
      isVideo,
      videoThumbnail,
      videoContentType,
      isPlaying
    });
  }, [imageUrl, imageAlt, videoUrl, isVideo, videoThumbnail, videoContentType, isPlaying]);

  // Make sure we have valid URLs
  const validImageUrl = imageUrl && (
    imageUrl.startsWith('http') || 
    imageUrl.startsWith('//') || 
    imageUrl.startsWith('/')
  );
  
  // Extract the final image URL, ensuring it has proper protocol
  let finalImageUrl = validImageUrl ? imageUrl : 
    "https://images.unsplash.com/photo-1562184552-997c461abbe6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80";
    
  // If image URL starts with // (protocol-relative URL), add https:
  if (finalImageUrl.startsWith('//')) {
    finalImageUrl = 'https:' + finalImageUrl;
    console.log('[HeroImage] Added https protocol to image URL:', finalImageUrl);
  }
  
  // Check if we have a valid video URL
  const validVideoUrl = videoUrl && (
    videoUrl.startsWith('http') || 
    videoUrl.startsWith('//') ||
    videoUrl.includes('youtube.com') ||
    videoUrl.includes('youtu.be') ||
    videoUrl.includes('vimeo.com')
  );
  
  // Use thumbnail if provided, otherwise use the image URL
  const thumbnailUrl = videoThumbnail || finalImageUrl;
  
  // Check if the video is an uploaded file in Contentful
  const isContentfulVideo = validVideoUrl && videoContentType && (
    videoContentType.includes('video/') || 
    videoContentType.includes('application/') // for formats like application/mp4
  );
  
  // Process video URL for embedding if it's YouTube or Vimeo
  const getVideoEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Make sure URL has proper protocol
    let processedUrl = url.startsWith('//') ? 'https:' + url : url;
    
    // YouTube URLs
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      // Extract video ID
      let videoId = '';
      if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1];
        const ampersandPosition = videoId?.indexOf('&');
        if (ampersandPosition !== -1) {
          videoId = videoId.substring(0, ampersandPosition);
        }
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1];
      }
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
    }
    
    // Vimeo URLs
    if (url.includes('vimeo.com')) {
      const vimeoRegex = /vimeo\.com\/(\d+)($|\/|\?)/;
      const match = url.match(vimeoRegex);
      if (match && match[1]) {
        return `https://player.vimeo.com/video/${match[1]}?autoplay=1`;
      }
    }
    
    // Return the original URL if it's not YouTube or Vimeo
    return processedUrl;
  };

  // Handle video play button click
  const handlePlayVideo = () => {
    if (validVideoUrl) {
      setIsPlaying(true);
      console.log('[HeroImage] Playing video:', videoUrl);
    }
  };

  return (
    <div className="relative">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        {isVideo && validVideoUrl ? (
          isPlaying ? (
            <div className="aspect-video w-full">
              {isContentfulVideo ? (
                <video 
                  src={videoUrl}
                  className="w-full h-full"
                  controls
                  autoPlay
                  playsInline
                >
                  <source src={videoUrl} type={videoContentType} />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <iframe
                  src={getVideoEmbedUrl(videoUrl as string)}
                  title={imageAlt || "Video content"}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          ) : (
            <div className="relative cursor-pointer" onClick={handlePlayVideo}>
              <img 
                src={thumbnailUrl}
                alt={imageAlt || "Video thumbnail"}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="bg-vending-blue rounded-full p-5 text-white hover:bg-vending-blue-dark transition-colors">
                  <Play className="h-8 w-8" />
                </div>
              </div>
            </div>
          )
        ) : (
          <img 
            src={finalImageUrl}
            alt={imageAlt || "Vending Technology"}
            className="w-full h-auto object-cover"
            onLoad={() => console.log('[HeroImage] Successfully loaded image:', finalImageUrl)}
            onError={(e) => {
              console.error('[HeroImage] Failed to load image:', finalImageUrl);
              e.currentTarget.src = "https://images.unsplash.com/photo-1562184552-997c461abbe6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80";
            }}
          />
        )}
      </div>
    </div>
  );
};

export default HeroImage;
