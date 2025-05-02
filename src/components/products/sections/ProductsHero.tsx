
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ExternalLink, Play } from 'lucide-react';
import { useHeroContent } from '@/hooks/cms/useHeroContent';
import { Loader2 } from 'lucide-react';

export default function ProductsHero() {
  const { data: heroContent, isLoading, error } = useHeroContent("products");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error || !heroContent) {
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

  // Check if this is a video hero and has video
  const isVideoHero = heroContent.isVideo && (heroContent.video?.url);
  const isContentfulVideo = isVideoHero && heroContent.video?.contentType && 
    (heroContent.video.contentType.includes('video/') || heroContent.video.contentType.includes('application/'));

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
              {heroContent.primaryButtonUrl && (
                <Button asChild size="lg">
                  <Link to={heroContent.primaryButtonUrl}>
                    {heroContent.primaryButtonText} <ExternalLink className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
              {heroContent.secondaryButtonUrl && (
                <Button asChild variant="outline" size="lg">
                  <Link to={heroContent.secondaryButtonUrl}>
                    {heroContent.secondaryButtonText}
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <div className="relative">
            {isVideoHero ? (
              <div className="bg-white rounded-lg shadow-xl overflow-hidden aspect-video">
                {isContentfulVideo ? (
                  <video
                    src={heroContent.video.url}
                    controls
                    autoPlay
                    muted
                    playsInline
                    poster={heroContent.video.thumbnail}
                    className="w-full h-full object-cover"
                  >
                    <source src={heroContent.video.url} type={heroContent.video.contentType} />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="relative cursor-pointer">
                    <img
                      src={heroContent.video?.thumbnail || heroContent.image.url}
                      alt={heroContent.image.alt}
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Link 
                        to={heroContent.video?.url || "#"} 
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
                  src={heroContent.image.url}
                  alt={heroContent.image.alt}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
