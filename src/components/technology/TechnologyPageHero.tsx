
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
  
  const backgroundImageStyle = hero.image?.url 
    ? { backgroundImage: `url(https:${hero.image.url})` }
    : {};
    
  return (
    <section 
      className="relative py-20 bg-cover bg-center"
      style={backgroundImageStyle}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-3xl text-center mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{hero.title}</h1>
          <p className="text-xl text-white/90 mb-8">{hero.subtitle}</p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {hero.primaryButtonText && (
              <Button asChild size="lg">
                <Link to={hero.primaryButtonUrl || '#'}>
                  {hero.primaryButtonText}
                </Link>
              </Button>
            )}
            
            {hero.secondaryButtonText && (
              <Button asChild variant="outline" size="lg" className="bg-white/10 text-white hover:bg-white/20">
                <Link to={hero.secondaryButtonUrl || '#'}>
                  {hero.secondaryButtonText}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologyPageHero;
