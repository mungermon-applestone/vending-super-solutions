
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Image from '@/components/common/Image';

interface ProductHeroSectionProps {
  productType: string;
  description?: string;
  image?: string;
  benefits?: string[];
}

const ProductHeroSection: React.FC<ProductHeroSectionProps> = ({
  productType,
  description,
  image,
  benefits = []
}) => {
  // Split benefits into two columns for larger screens
  const midpoint = Math.ceil(benefits.length / 2);
  const leftColumnBenefits = benefits.slice(0, midpoint);
  const rightColumnBenefits = benefits.slice(midpoint);

  return (
    <section className="bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Column */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-vending-blue-dark mb-6">
                {productType}
              </h1>
              {description && (
                <p className="text-lg text-gray-700 leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {/* Benefits Section - Two Column Layout */}
            {benefits.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-vending-blue-dark">
                  Key Benefits
                </h3>
                {/* Single column on mobile, two columns on larger screens */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                  {/* Left column */}
                  <div className="space-y-2">
                    {leftColumnBenefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-vending-blue mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Right column - only show if there are items for it */}
                  {rightColumnBenefits.length > 0 && (
                    <div className="space-y-2">
                      {rightColumnBenefits.map((benefit, index) => (
                        <div key={index + midpoint} className="flex items-start space-x-3">
                          <Check className="h-5 w-5 text-vending-blue mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-vending-blue hover:bg-vending-blue-dark">
                <Link to="/contact">
                  Schedule a Demo
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/machines">
                  View Compatible Machines
                </Link>
              </Button>
            </div>
          </div>

          {/* Image Column */}
          <div className="order-first lg:order-last">
            <div className="relative">
              <Image
                src={image || '/placeholder.svg'}
                alt={`${productType} illustration`}
                className="w-full h-auto rounded-lg shadow-lg"
                aspectRatio="4/3"
                objectFit="cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductHeroSection;
