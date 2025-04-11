
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CTASection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-vending-blue-light">
      <div className="container-wide text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-vending-blue-dark mb-6">
          Ready to Transform Your Vending Business?
        </h2>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
          Contact our team today to schedule a demo and see how our software can help you increase revenue and streamline operations.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Button asChild size="lg">
            <Link to="/contact">Request a Demo</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/partner">Become a Partner</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
