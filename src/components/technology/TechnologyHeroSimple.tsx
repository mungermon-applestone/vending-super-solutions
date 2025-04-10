
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutGrid } from 'lucide-react';

const TechnologyHeroSimple: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-slate-50 to-slate-100 py-16">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-vending-blue-dark mb-6">
            Our Technology Platform
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Powerful, reliable, and secure technology solutions designed specifically for the vending industry
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-vending-blue hover:bg-vending-blue-dark">
              <Link to="/contact">Request a Demo</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="flex items-center gap-2">
              <Link to="/technology">
                <LayoutGrid size={16} /> View Detailed Layout
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologyHeroSimple;
