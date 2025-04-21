
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface DemoRequestProps {
  title: string;
  description?: string;
  bulletPoints?: string[];
}

const DemoRequest: React.FC<DemoRequestProps> = ({ title, description, bulletPoints }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">{title}</h2>
          {description && (
            <p className="text-lg text-gray-600 mb-8">{description}</p>
          )}
          {bulletPoints && bulletPoints.length > 0 && (
            <ul className="text-left space-y-4 mb-8">
              {bulletPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <ArrowRight className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
          <Button asChild size="lg">
            <Link to="/contact">Request Demo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DemoRequest;
