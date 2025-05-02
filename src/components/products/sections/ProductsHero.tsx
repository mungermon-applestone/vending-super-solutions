
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ExternalLink, Loader2 } from 'lucide-react';
import { useLandingPageByKey } from '@/hooks/cms/useLandingPages';
import { useHeroContent } from '@/hooks/cms/useHeroContent';
import { useState, useEffect } from 'react';
import VideoPlayer from '@/components/common/VideoPlayer';

export default function ProductsHero() {
  // Try both content sources - landingPage is preferred
  const { 
    data: landingPage, 
    isLoading: isLoadingLandingPage, 
    error: landingPageError 
  } = useLandingPageByKey("products");
  
  const { 
    data: heroContent, 
    isLoading: isLoadingHeroContent, 
    error: heroContentError 
  } = useHeroContent("products");
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Effect to determine when loading is complete
  useEffect(() => {
    if (!isLoadingLandingPage && !isLoadingHeroContent) {
      setIsLoading(false);
    }
  }, [isLoadingLandingPage, isLoadingHeroContent]);
  
  // Debug logs for video troubleshooting - always run this hook
  useEffect(() => {
    console.log("[ProductsHero] Component rendering with data:", {
      hasLandingPage: !!landingPage,
      landingPageError,
      hasHeroContent: !!heroContent,
      heroContentError,
      isLoading
    });
    
    // Add detailed logging for video properties from landing page
    if (landingPage && landingPage.hero_content) {
      console.log("[ProductsHero] Landing page hero content details:", {
        title: landingPage.hero_content.title,
        isVideo: landingPage.hero_content.is_video,
        videoUrl: landingPage.hero_content.video_url,
        videoFile: landingPage.hero_content.video_file,
        videoThumb: landingPage.hero_content.video_thumbnail,
        imageUrl: landingPage.hero_content.image_url
      });
    }
    
    // Also log heroContent data if available
    if (heroContent) {
      console.log("[ProductsHero] Generic hero content details:", {
        title: heroContent.title,
        isVideo: heroContent.isVideo,
        videoUrl: heroContent.video?.url,
        videoThumb: heroContent.video?.thumbnail,
        imageUrl: heroContent.image?.url
      });
    }
  }, [landingPage, heroContent, landingPageError, heroContentError, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  // Determine which content source to use - prefer landingPage
  if (landingPage?.hero_content) {
    const hero = landingPage.hero_content;
    
    // Enhanced video detection with more debugging
    const isVideoHero = Boolean(hero.is_video);
    const hasVideoFile = hero.video_file && hero.video_file.url;
    const hasVideoUrl = hero.video_url && hero.video_url.length > 0;
    
    // Get the final video URL with more explicit logging
    const videoUrl = hasVideoFile ? hero.video_file.url : (hasVideoUrl ? hero.video_url : '');
    const videoContentType = hasVideoFile ? hero.video_file.contentType : undefined;
    const videoThumbnail = hero.video_thumbnail || hero.image_url;
    
    console.log('[ProductsHero] Video details:', {
      isVideoHero, 
      hasVideoFile, 
      hasVideoUrl,
      videoUrl,
      videoContentType,
      videoThumbnail
    });
    
    return (
      <section className={hero.background_class || "bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light"}>
        <div className="container py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-vending-blue-dark">
                {hero.title}
              </h1>
              <p className="text-xl text-gray-700 max-w-2xl">
                {hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                {hero.cta_primary_text && hero.cta_primary_url && (
                  <Button asChild size="lg">
                    <Link to={hero.cta_primary_url}>
                      {hero.cta_primary_text} <ExternalLink className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                )}
                {hero.cta_secondary_text && hero.cta_secondary_url && (
                  <Button asChild variant="outline" size="lg">
                    <Link to={hero.cta_secondary_url}>
                      {hero.cta_secondary_text}
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="relative">
              {isVideoHero && videoUrl ? (
                <VideoPlayer 
                  videoUrl={videoUrl}
                  thumbnailUrl={videoThumbnail}
                  contentType={videoContentType || ''}
                  title={hero.image_alt || 'Product video'}
                  className="w-full rounded-lg shadow-xl overflow-hidden"
                  isVideo={true}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                  <img 
                    src={hero.image_url}
                    alt={hero.image_alt}
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      console.error("[ProductsHero] Image failed to load:", hero.image_url);
                      e.currentTarget.src = "https://images.unsplash.com/photo-1556742031-c6961e8560b0?ixlib=rb-4.0.3";
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  // If landing page isn't available, try to use heroContent
  if (heroContent) {
    const isVideoContent = Boolean(heroContent.isVideo);
    const videoUrl = heroContent.video?.url || '';
    const videoThumbnail = heroContent.video?.thumbnail || heroContent.image?.url;
    const videoContentType = heroContent.video?.contentType || '';
    
    console.log("[ProductsHero] Using generic hero content with video details:", {
      isVideo: isVideoContent,
      videoUrl,
      videoThumbnail,
      contentType: videoContentType
    });
    
    return (
      <section className={heroContent.backgroundClass || "bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light"}>
        <div className="container py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-vending-blue-dark">
                {heroContent.title}
              </h1>
              <p className="text-xl text-gray-700 max-w-2xl">
                {heroContent.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                {heroContent.primaryButtonText && heroContent.primaryButtonUrl && (
                  <Button asChild size="lg">
                    <Link to={heroContent.primaryButtonUrl}>
                      {heroContent.primaryButtonText} <ExternalLink className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                )}
                {heroContent.secondaryButtonText && heroContent.secondaryButtonUrl && (
                  <Button asChild variant="outline" size="lg">
                    <Link to={heroContent.secondaryButtonUrl}>
                      {heroContent.secondaryButtonText}
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="relative">
              {isVideoContent && videoUrl ? (
                <VideoPlayer 
                  videoUrl={videoUrl}
                  thumbnailUrl={videoThumbnail}
                  contentType={videoContentType}
                  title={heroContent.image?.alt || "Product video"}
                  className="w-full rounded-lg shadow-xl overflow-hidden"
                  isVideo={true}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                  <img 
                    src={heroContent.image?.url}
                    alt={heroContent.image?.alt || "Product image"}
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      console.error("[ProductsHero] Hero content image failed to load");
                      e.currentTarget.src = "https://images.unsplash.com/photo-1556742031-c6961e8560b0?ixlib=rb-4.0.3";
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error occurred or no content found - use fallback content
  console.error("[ProductsHero] Error loading hero content:", landingPageError || heroContentError);
  return (
    <section className="bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light">
      <div className="container py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-vending-blue-dark">
              Vending Product Solutions
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl">
              Discover our range of software solutions designed for various types of vending operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button asChild size="lg">
                <Link to="/contact">
                  Request Demo <ExternalLink className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/technology">
                  Explore Technology
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1556742031-c6961e8560b0?ixlib=rb-4.0.3"
                alt="Vending Machine Products"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
