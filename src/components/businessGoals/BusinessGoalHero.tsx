import { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

interface BusinessGoalHeroProps {
  title: string;
  description?: string;
  heroDescription2?: any;
  icon: ReactNode;
  image: string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
}

const BusinessGoalHero = ({ 
  title, 
  description,
  heroDescription2, 
  icon, 
  image,
  primaryAction,
  secondaryAction
}: BusinessGoalHeroProps) => {
  // Default actions if none are provided
  const defaultPrimaryAction = (
    <Button asChild>
      <Link to="/contact">
        Request a Demo <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  );
  
  const defaultSecondaryAction = (
    <Button variant="outline" asChild>
      <Link to="/products">
        View Compatible Products
      </Link>
    </Button>
  );

  // Render RichText if available, fallback to plain description
  const renderedDescription = heroDescription2 
    ? documentToReactComponents(heroDescription2)
    : description;

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center mb-6">
              <div className="bg-vending-teal rounded-full p-3 mr-4">
                {icon}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-vending-blue-dark">
                {title}
              </h1>
            </div>
            <div className="text-xl text-gray-700 mb-8 max-w-2xl">
              {renderedDescription}
            </div>
            <div className="flex flex-wrap gap-4">
              {primaryAction || defaultPrimaryAction}
              {secondaryAction || defaultSecondaryAction}
            </div>
          </div>
          <div className="relative">
            <img 
              src={image} 
              alt={title} 
              className="rounded-lg shadow-xl w-full"
            />
            <div className="absolute -bottom-6 -right-6 bg-vending-teal text-white p-4 rounded-lg shadow-lg hidden md:block">
              <p className="font-bold">Achieve Your Business Goals</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessGoalHero;
