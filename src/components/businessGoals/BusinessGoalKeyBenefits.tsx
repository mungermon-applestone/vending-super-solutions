
import React from 'react';
import { Check } from 'lucide-react';

interface BusinessGoalKeyBenefitsProps {
  title?: string;
  description?: string;
  benefits: string[];
}

const BusinessGoalKeyBenefits: React.FC<BusinessGoalKeyBenefitsProps> = ({
  title = "Key Benefits",
  description,
  benefits = []
}) => {
  if (!benefits || benefits.length === 0) {
    return null;
  }

  // Calculate the midpoint to split the benefits into two columns
  const midPoint = Math.ceil(benefits.length / 2);
  const firstColumn = benefits.slice(0, midPoint);
  const secondColumn = benefits.slice(midPoint);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-vending-blue-dark mb-4">{title}</h2>
          {description && (
            <p className="text-lg text-gray-700">{description}</p>
          )}
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* First Column */}
            <div>
              <ul className="space-y-4">
                {firstColumn.map((benefit, index) => (
                  <li key={`first-${index}`} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="bg-vending-blue rounded-full p-1">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <p className="ml-3 text-lg text-gray-700">{benefit}</p>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Second Column */}
            <div>
              <ul className="space-y-4">
                {secondColumn.map((benefit, index) => (
                  <li key={`second-${index}`} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="bg-vending-blue rounded-full p-1">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <p className="ml-3 text-lg text-gray-700">{benefit}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessGoalKeyBenefits;
