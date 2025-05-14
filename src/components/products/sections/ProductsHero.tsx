
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { useHeroContent } from '@/hooks/cms/useHeroContent';
import { Loader2 } from 'lucide-react';

export default function ProductsHero() {
  // Hooks now accepts no arguments by default
  const { data: heroContent, isLoading, error } = useHeroContent();

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

  // Safely convert any field values to string
  const safeString = (value: any): string => {
    if (value === null || value === undefined) return '';
    return String(value);
  };

  // Safe background class handling
  const backgroundClass = typeof heroContent.backgroundClass === 'string' 
    ? heroContent.backgroundClass 
    : "bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light";

  return (
    <section className={backgroundClass}>
      <div className="container py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-vending-blue-dark">
              {safeString(heroContent.title || heroContent.headline)}
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl">
              {safeString(heroContent.subtitle || heroContent.subheading)}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              {(heroContent.primaryButtonUrl || heroContent.ctaLink) && (
                <Button asChild size="lg">
                  <Link to={safeString(heroContent.primaryButtonUrl || heroContent.ctaLink)}>
                    {safeString(heroContent.primaryButtonText || heroContent.ctaText)} <ExternalLink className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
              {(heroContent.secondaryButtonUrl || heroContent.secondaryCTALink) && (
                <Button asChild variant="outline" size="lg">
                  <Link to={safeString(heroContent.secondaryButtonUrl || heroContent.secondaryCTALink)}>
                    {safeString(heroContent.secondaryButtonText || heroContent.secondaryCTAText)}
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <img 
                src={safeString(
                  heroContent.image?.url || 
                  heroContent.backgroundImage || 
                  "https://images.unsplash.com/photo-1556742031-c6961e8560b0?ixlib=rb-4.0.3"
                )}
                alt={safeString(
                  heroContent.image?.alt || 
                  heroContent.backgroundImageAlt || 
                  "Vending Machine Products"
                )}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
