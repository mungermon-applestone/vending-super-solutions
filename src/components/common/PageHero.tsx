
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
  
  // Add refetchOnMount and refetchInterval options to ensure fresh data
  const { data: landingPage, isLoading, error, refetch } = useLandingPageByKey(pageKey);
  
  // Enhanced debugging to track what's happening
  useEffect(() => {
    console.log(`PageHero component for ${pageKey} - mounted/updated`);
    console.log(`PageHero component for ${pageKey}:`, {
      landingPage,
      isLoading,
      error,
      hasCmsData: !!landingPage,
      heroContent: landingPage ? (landingPage as LandingPage).hero_content : null,
    });
    
    if (error) {
      console.error(`PageHero component for ${pageKey} - Error:`, error);
    }
    
    // Force refetch when component mounts to ensure we have the latest data
    refetch().catch(err => {
      console.error(`PageHero component for ${pageKey} - Refetch error:`, err);
    });
  }, [pageKey, refetch]);
  
  // Use CMS data if available, otherwise fall back to props
  // Explicitly cast landingPage to LandingPage type to access hero_content
  const typedLandingPage = landingPage as LandingPage | null;
  const heroContent = typedLandingPage?.hero_content || null;
  
  // Debug what content we're actually using
  useEffect(() => {
    console.log(`PageHero for ${pageKey} - Using content:`, {
      usingCmsData: !!heroContent,
      title: heroContent?.title || fallbackTitle,
      subtitle: heroContent?.subtitle || fallbackSubtitle,
      imageUrl: heroContent?.image_url || fallbackImage,
      buttonText: heroContent?.cta_primary_text || fallbackPrimaryButtonText,
      isVideo: heroContent?.is_video,
      videoUrl: heroContent?.video_url,
      videoFile: heroContent?.video_file,
    });
  }, [heroContent, pageKey, fallbackTitle, fallbackSubtitle, fallbackImage, fallbackPrimaryButtonText]);
  
  const title = heroContent?.title || fallbackTitle;
  const subtitle = heroContent?.subtitle || fallbackSubtitle;
  const imageUrl = heroContent?.image_url || fallbackImage;
  const imageAlt = heroContent?.image_alt || fallbackImageAlt;
  const primaryButtonText = heroContent?.cta_primary_text || fallbackPrimaryButtonText;
  const primaryButtonUrl = heroContent?.cta_primary_url || fallbackPrimaryButtonUrl;
  const secondaryButtonText = heroContent?.cta_secondary_text || fallbackSecondaryButtonText;
  const secondaryButtonUrl = heroContent?.cta_secondary_url || fallbackSecondaryButtonUrl;
  const backgroundClass = heroContent?.background_class || 'bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light';
  const isVideo = heroContent?.is_video || false;
  const videoUrl = heroContent?.video_url || '';
  const videoThumbnail = heroContent?.video_thumbnail || imageUrl;
  const videoFile = heroContent?.video_file;
  const videoContentType = videoFile?.contentType;
  
  // Check if we have a Contentful uploaded video
  const hasContentfulVideo = isVideo && videoFile && videoFile.url;
  
  // Get the effective video URL (either external URL or Contentful file URL)
  const effectiveVideoUrl = hasContentfulVideo ? videoFile.url : videoUrl;
  
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
    if (effectiveVideoUrl) {
      setIsVideoPlaying(true);
    }
  };
  
  // Check if this is a Contentful uploaded video
  const isContentfulVideo = isVideo && videoContentType && (
    videoContentType.includes('video/') || 
    videoContentType.includes('application/')
  );
  
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
            {isVideo && effectiveVideoUrl ? (
              isVideoPlaying ? (
                <div className="aspect-video rounded-lg shadow-lg overflow-hidden">
                  {isContentfulVideo ? (
                    <video 
                      src={effectiveVideoUrl}
                      className="w-full h-full"
                      controls
                      autoPlay
                      playsInline
                    >
                      <source src={effectiveVideoUrl} type={videoContentType} />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <iframe
                      src={getVideoEmbedUrl(effectiveVideoUrl)}
                      title={title}
                      className="w-full h-full"
                      style={{ maxHeight: '500px' }}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
              ) : (
                <div 
                  className="relative cursor-pointer rounded-lg shadow-lg overflow-hidden"
                  onClick={handlePlayVideo}
                >
                  <img
                    src={videoThumbnail || imageUrl}
                    alt={imageAlt}
                    className="w-full h-auto object-cover"
                    style={{ maxHeight: '500px' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="bg-vending-blue/90 rounded-full p-5 text-white hover:bg-vending-blue transition-colors">
                      <Play className="h-12 w-12" />
                    </div>
                  </div>
                </div>
              )
            ) : (
              <img
                src={imageUrl}
                alt={imageAlt}
                className="rounded-lg shadow-lg w-full h-auto object-cover"
                style={{ maxHeight: '500px' }}
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/800x500?text=Image+Not+Found";
                  console.log("Image failed to load:", imageUrl);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageHero;
