
import React from 'react';
import { useHeroContent } from '@/hooks/cms/useHeroContent';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * MachinesHero component - Displays hero content for the machines page
 * Uses the useHeroContent hook with the 'machines' pageKey
 */
const MachinesHero: React.FC = () => {
  const { data: heroContent, isLoading, error } = useHeroContent('machines');

  // Show loading state while content is being fetched
  if (isLoading) {
    return (
      <section className="bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light">
        <div className="container py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Skeleton className="h-12 w-full max-w-lg" />
              <Skeleton className="h-24 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
            <div className="relative">
              <Skeleton className="h-80 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show fallback content if there's an error or no content
  if (error || !heroContent) {
    console.error('[MachinesHero] Error loading hero content:', error);
    
    return (
      <section className="bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light">
        <div className="container py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-vending-blue-dark">
                Advanced Vending Machines
              </h1>
              <p className="text-xl text-gray-700 max-w-2xl">
                Our machines combine cutting-edge technology with reliable performance to meet your business needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button asChild size="lg">
                  <Link to="/contact">
                    Request a Demo <ExternalLink className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="#machines-section">
                    Browse Machines
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1562184552-997c461abbe6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
                  alt="Vending Machine"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Render hero content from Contentful
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
                    {heroContent.primaryButtonText}
                    {heroContent.primaryButtonText?.includes('Demo') && (
                      <ExternalLink className="ml-2 h-5 w-5" />
                    )}
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
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              {heroContent.image?.url ? (
                <img 
                  src={heroContent.image.url}
                  alt={heroContent.image.alt || "Vending Machine"}
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="flex items-center justify-center p-12">
                  <p className="text-gray-400">No image available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MachinesHero;
