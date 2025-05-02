
import React, { useEffect, useState } from 'react';
import { useLandingPageByKey } from '@/hooks/cms/useLandingPages';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LandingPage } from '@/types/landingPage';
import { Play } from 'lucide-react';

interface PageHeroProps {
  pageKey: string;
  fallbackTitle: string;
  fallbackSubtitle: string;
  fallbackImage: string;
  fallbackImageAlt: string;
  fallbackPrimaryButtonText?: string;
  fallbackPrimaryButtonUrl?: string;
  fallbackSecondaryButtonText?: string;
  fallbackSecondaryButtonUrl?: string;
}

const PageHero: React.FC<PageHeroProps> = ({
  pageKey,
  fallbackTitle,
  fallbackSubtitle,
  fallbackImage,
  fallbackImageAlt,
  fallbackPrimaryButtonText,
  fallbackPrimaryButtonUrl,
  fallbackSecondaryButtonText,
  fallbackSecondaryButtonUrl,
}) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  // Force refetchOnMount: always to ensure fresh data
  const { data: landingPage, isLoading, error, refetch } = useLandingPageByKey(pageKey);
  
  // Debug logging to track component lifecycle
  useEffect(() => {
    console.log(`[PageHero] Component for ${pageKey} mounted/updated, landingPage:`, landingPage);
    
    // Force refetch when component mounts to ensure we have the latest data
    refetch().catch(err => {
      console.error(`[PageHero] Refetch error for ${pageKey}:`, err);
    });
    
    // Log video-specific details if available
    if (landingPage?.hero_content) {
      const hero = landingPage.hero_content;
      console.log(`[PageHero] Video details for ${pageKey}:`, {
        isVideo: hero.is_video,
        videoUrl: hero.video_url,
        videoFile: hero.video_file,
        videoThumbnail: hero.video_thumbnail
      });
    }
  }, [pageKey, landingPage, refetch]);
  
  // Get hero content or use fallback values
  const typedLandingPage = landingPage as LandingPage | null;
  const heroContent = typedLandingPage?.hero_content || null;
  
  // Detailed logging for debugging purposes
  useEffect(() => {
    if (heroContent) {
      console.log(`[PageHero] Using CMS content for ${pageKey}:`, {
        title: heroContent.title,
        isVideo: heroContent.is_video,
        hasVideoFile: !!heroContent.video_file,
        videoFileUrl: heroContent.video_file?.url,
        videoUrl: heroContent.video_url,
        videoThumbnail: heroContent.video_thumbnail
      });
    } else {
      console.log(`[PageHero] Using fallback content for ${pageKey}`);
    }
  }, [heroContent, pageKey]);
  
  // Get content values with fallbacks
  const title = heroContent?.title || fallbackTitle;
  const subtitle = heroContent?.subtitle || fallbackSubtitle;
  const imageUrl = heroContent?.image_url || fallbackImage;
  const imageAlt = heroContent?.image_alt || fallbackImageAlt;
  const primaryButtonText = heroContent?.cta_primary_text || fallbackPrimaryButtonText;
  const primaryButtonUrl = heroContent?.cta_primary_url || fallbackPrimaryButtonUrl;
  const secondaryButtonText = heroContent?.cta_secondary_text || fallbackSecondaryButtonText;
  const secondaryButtonUrl = heroContent?.cta_secondary_url || fallbackSecondaryButtonUrl;
  const backgroundClass = heroContent?.background_class || 'bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light';
  
  // Video-related properties with improved handling
  const isVideo = !!heroContent?.is_video;
  
  // Handle both uploaded Contentful videos and external URLs
  const hasVideoFile = isVideo && heroContent?.video_file && heroContent.video_file.url;
  const hasVideoUrl = isVideo && heroContent?.video_url && heroContent.video_url.length > 0;
  const videoContentType = heroContent?.video_file?.contentType;
  
  // Get the video URL with proper protocol handling
  const rawVideoUrl = hasVideoFile ? heroContent?.video_file?.url : heroContent?.video_url || '';
  const videoUrl = rawVideoUrl.startsWith('//') ? 'https:' + rawVideoUrl : rawVideoUrl;
  
  // Get video thumbnail, falling back to image if needed
  const videoThumbnail = heroContent?.video_thumbnail || imageUrl;
  
  // Enhanced debug logging for video properties
  useEffect(() => {
    if (isVideo) {
      console.log(`[PageHero] Processed video details for ${pageKey}:`, {
        isVideo,
        hasVideoFile,
        hasVideoUrl,
        rawVideoUrl,
        processedVideoUrl: videoUrl,
        videoContentType,
        videoThumbnail,
        isVideoPlaying
      });
    }
  }, [isVideo, pageKey, hasVideoFile, hasVideoUrl, rawVideoUrl, videoUrl, videoContentType, videoThumbnail, isVideoPlaying]);
  
  // Determine if this is an embedded video or a Contentful direct upload
  const isContentfulVideo = isVideo && videoContentType && (
    videoContentType.includes('video/') || 
    videoContentType.includes('application/')
  );
  
  // Function to process video URL for embedding
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

  const handlePlayVideo = () => {
    if (videoUrl) {
      setIsVideoPlaying(true);
      console.log(`[PageHero] Playing video: ${videoUrl}`);
    } else {
      console.warn(`[PageHero] Attempted to play video but URL is empty`);
    }
  };
  
  // Enhanced video rendering logic
  const renderVideo = () => {
    if (!isVideo || (!hasVideoFile && !hasVideoUrl)) {
      return (
        <img
          src={imageUrl}
          alt={imageAlt}
          className="rounded-lg shadow-lg w-full h-auto object-cover"
          style={{ maxHeight: '500px' }}
          onError={(e) => {
            console.error(`[PageHero] Image failed to load: ${imageUrl}`);
            e.currentTarget.src = "https://via.placeholder.com/800x500?text=Image+Not+Found";
          }}
        />
      );
    }
    
    if (isVideoPlaying) {
      if (isContentfulVideo) {
        return (
          <video 
            src={videoUrl}
            className="w-full h-full"
            controls
            autoPlay
            playsInline
            poster={videoThumbnail}
            onError={(e) => {
              console.error(`[PageHero] Video failed to load: ${videoUrl}`, e);
              // Show fallback image
              const parent = e.currentTarget.parentElement;
              if (parent) {
                e.currentTarget.style.display = 'none';
                const img = document.createElement('img');
                img.src = imageUrl || '/placeholder.jpg';
                img.alt = imageAlt;
                img.className = "w-full h-full object-cover";
                parent.appendChild(img);
              }
            }}
          >
            <source src={videoUrl} type={videoContentType} />
            Your browser does not support the video tag.
          </video>
        );
      } else {
        return (
          <iframe
            src={getVideoEmbedUrl(videoUrl)}
            title={title}
            className="w-full h-full"
            style={{ maxHeight: '500px' }}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        );
      }
    } else {
      return (
        <div 
          className="relative cursor-pointer rounded-lg shadow-lg overflow-hidden"
          onClick={handlePlayVideo}
        >
          <img
            src={videoThumbnail || imageUrl}
            alt={imageAlt}
            className="w-full h-auto object-cover"
            style={{ maxHeight: '500px' }}
            onError={(e) => {
              console.error(`[PageHero] Thumbnail failed to load: ${videoThumbnail}`);
              e.currentTarget.src = imageUrl || '/placeholder.jpg';
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="bg-vending-blue/90 rounded-full p-5 text-white hover:bg-vending-blue transition-colors">
              <Play className="h-12 w-12" />
            </div>
          </div>
        </div>
      );
    }
  };
  
  return (
    <section className={`py-16 ${backgroundClass}`} data-testid={`page-hero-${pageKey}`}>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {title}
            </h1>
            <p className="text-lg md:text-xl">
              {subtitle}
            </p>
            {/* Only render buttons if they have both text and URL */}
            {((primaryButtonText && primaryButtonUrl) || (secondaryButtonText && secondaryButtonUrl)) && (
              <div className="flex flex-wrap gap-4">
                {primaryButtonText && primaryButtonUrl && (
                  <Link to={primaryButtonUrl}>
                    <Button size="lg">
                      {primaryButtonText}
                    </Button>
                  </Link>
                )}
                {secondaryButtonText && secondaryButtonUrl && (
                  <Link to={secondaryButtonUrl}>
                    <Button size="lg" variant="outline">
                      {secondaryButtonText}
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
          <div className="mt-8 lg:mt-0">
            <div className="aspect-video rounded-lg shadow-lg overflow-hidden">
              {renderVideo()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageHero;
