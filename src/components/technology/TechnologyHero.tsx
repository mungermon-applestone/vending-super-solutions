
import React from 'react';
import { CMSTechnology } from '@/types/cms';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface TechnologyHeroProps {
  technology: CMSTechnology;
}

const TechnologyHero: React.FC<TechnologyHeroProps> = ({ technology }) => {
  return (
    <div className="bg-gradient-to-r from-slate-50 to-slate-100 py-16 md:py-24">
      <div className="container max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {technology.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {technology.description}
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <Link to="/contact">
                  Request Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/partner">Partner With Us</Link>
              </Button>
            </div>
          </div>
          {technology.image_url && (
            <div className="relative h-64 md:h-80 overflow-hidden rounded-lg shadow-lg">
              <img
                src={technology.image_url}
                alt={technology.image_alt || 'Technology platform illustration'}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnologyHero;
