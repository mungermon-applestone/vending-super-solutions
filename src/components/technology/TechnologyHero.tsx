
import React from 'react';
import { Button } from '@/components/ui/button';
import { CMSTechnology } from '@/types/cms';
import { Link } from 'react-router-dom';

interface TechnologyHeroProps {
  technology: CMSTechnology;
}

const TechnologyHero: React.FC<TechnologyHeroProps> = ({ technology }) => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{technology.title}</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {technology.description}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/contact">Request a Demo</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/technology/detailed">View Detailed Layout</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologyHero;
