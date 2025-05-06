
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import EmailLink from './EmailLink';

interface SimpleContactCTAProps {
  title?: string;
  description?: string;
  className?: string;
}

const SimpleContactCTA: React.FC<SimpleContactCTAProps> = ({
  title = "Ready to Get Started?",
  description = "Fill out the form and we'll start you on your vending journey.",
  className = "",
}) => {
  return (
    <section className={`py-12 bg-blue-50 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-vending-blue-dark mb-4">
            {title}
          </h2>
          <p className="text-gray-700 mb-8">
            {description}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <EmailLink 
              emailAddress="hello@applestonesolutions.com"
              subject="Demo Request"
              buttonText="Schedule a Demo"
              className="bg-vending-blue hover:bg-vending-blue-dark text-white"
            />
            <Button asChild variant="outline" className="border-vending-blue text-vending-blue hover:bg-vending-blue-50">
              <Link to="/machines">Check out Machines</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleContactCTA;
