
import React from 'react';
import { useHeroContent } from '@/hooks/cms/useHeroContent';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface TechnologyPageHeroProps {
  entryId: string;
}

const TechnologyPageHero: React.FC<TechnologyPageHeroProps> = ({ entryId }) => {
  const { data: hero, isLoading } = useHeroContent(entryId);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }
  
  if (!hero) {
    return null;
  }

  return (
    <section className="bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light">
      <div className="container-wide py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-vending-blue-dark">
              {hero.title}
            </h1>
            <p className="text-xl text-gray-700">
              {hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              {hero.primaryButtonText && (
                <Button asChild size="lg">
                  <Link to={hero.primaryButtonUrl || '#'}>
                    {hero.primaryButtonText}
                  </Link>
                </Button>
              )}
              
              {hero.secondaryButtonText && (
                <Button asChild variant="outline" size="lg">
                  <Link to={hero.secondaryButtonUrl || '#'}>
                    {hero.secondaryButtonText}
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              {hero.image?.url && (
                <img 
                  src={`https:${hero.image.url}`}
                  alt={hero.image.alt || hero.title}
                  className="w-full h-auto object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologyPageHero;
