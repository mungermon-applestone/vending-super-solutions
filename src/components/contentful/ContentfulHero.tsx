
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export interface ContentfulHeroProps {
  title?: string;
  description?: string;
  image?: string;
  altText?: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
}

/**
 * A reusable hero component for displaying Contentful-sourced hero content
 */
const ContentfulHero: React.FC<ContentfulHeroProps> = ({
  title,
  description,
  image,
  altText = "Hero image",
  primaryButtonText,
  primaryButtonUrl,
  secondaryButtonText,
  secondaryButtonUrl
}) => {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {title && (
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-vending-blue-dark">
                {title}
              </h1>
            )}
            
            {description && (
              <p className="text-xl text-gray-700 max-w-2xl">
                {description}
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              {primaryButtonText && primaryButtonUrl && (
                <Button asChild size="lg">
                  <Link to={primaryButtonUrl}>
                    {primaryButtonText}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
              
              {secondaryButtonText && secondaryButtonUrl && (
                <Button asChild variant="outline" size="lg">
                  <Link to={secondaryButtonUrl}>
                    {secondaryButtonText}
                  </Link>
                </Button>
              )}
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              {image ? (
                <img 
                  src={image}
                  alt={altText}
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

export default ContentfulHero;
