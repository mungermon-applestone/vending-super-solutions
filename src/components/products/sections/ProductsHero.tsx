
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ExternalLink, Play } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useLandingPageByKey } from '@/hooks/cms/useLandingPages';

export default function ProductsHero() {
  const { data: landingPage, isLoading, error } = useLandingPageByKey("products");

  // Add detailed logging for video properties from landing page
  if (landingPage && landingPage.hero_content) {
    console.log("[ProductsHero] Landing page hero content loaded:", {
      title: landingPage.hero_content.title,
      isVideo: landingPage.hero_content.is_video,
      videoUrl: landingPage.hero_content.video_url,
      videoFile: landingPage.hero_content.video_file,
      videoThumb: landingPage.hero_content.video_thumbnail,
      imageUrl: landingPage.hero_content.image_url
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error || !landingPage || !landingPage.hero_content) {
    console.error("[ProductsHero] Error loading hero content:", error);
    // Fallback content
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

  const hero = landingPage.hero_content;
  
  // Improved video detection logic with better logging
  const isVideoHero = !!hero.is_video;
  const hasVideoFile = isVideoHero && 
    hero.video_file && 
    hero.video_file.url && 
    hero.video_file.url.length > 0;
  
  const hasVideoUrl = isVideoHero && 
    hero.video_url && 
    hero.video_url.length > 0;
    
  // Determine if it's a Contentful video (directly uploaded) or external URL
  const isContentfulVideo = hasVideoFile && 
    hero.video_file?.contentType && 
    (hero.video_file.contentType.includes('video/') || 
     hero.video_file.contentType.includes('application/'));

  // Ensure video URL has proper protocol
  const videoUrl = hasVideoFile ? 
    (hero.video_file?.url.startsWith('//') ? 
      'https:' + hero.video_file.url : 
      hero.video_file?.url) : 
    hasVideoUrl ? 
      (hero.video_url?.startsWith('//') ? 
        'https:' + hero.video_url : 
        hero.video_url) : 
      '';
  
  // Log detailed video information for debugging
  console.log("[ProductsHero] Video details:", {
    isVideoHero,
    hasVideoFile,
    hasVideoUrl,
    isContentfulVideo,
    videoUrl,
    contentType: hero.video_file?.contentType,
    thumbnailUrl: hero.video_thumbnail,
    videoFileObject: hero.video_file
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
            {isVideoHero && (videoUrl || hasVideoFile) ? (
              <div className="bg-white rounded-lg shadow-xl overflow-hidden aspect-video">
                {isContentfulVideo ? (
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    muted
                    playsInline
                    poster={hero.video_thumbnail}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("[ProductsHero] Video failed to load:", videoUrl, e);
                      e.currentTarget.style.display = 'none';
                      // Show error message or fallback image
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const img = document.createElement('img');
                        img.src = hero.image_url || hero.video_thumbnail || '/placeholder.jpg';
                        img.alt = hero.image_alt || "Video failed to load";
                        img.className = "w-full h-full object-cover";
                        parent.appendChild(img);
                      }
                    }}
                  >
                    <source src={videoUrl} type={hero.video_file?.contentType} />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="relative cursor-pointer">
                    <img
                      src={hero.video_thumbnail || hero.image_url}
                      alt={hero.image_alt}
                      className="w-full h-auto object-cover"
                      onError={(e) => {
                        console.error("[ProductsHero] Thumbnail failed to load");
                        e.currentTarget.src = '/placeholder.jpg';
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Link 
                        to={hero.video_url || "#"} 
                        target="_blank"
                        className="bg-vending-blue-dark/75 rounded-full p-4 text-white hover:bg-vending-blue-dark transition-colors"
                      >
                        <Play className="h-8 w-8" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
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
