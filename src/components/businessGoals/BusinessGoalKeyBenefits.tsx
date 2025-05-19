
import React from 'react';
import { Check } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

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

  console.log('[BusinessGoalKeyBenefits] Rendering benefits:', benefits);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-vending-blue-dark mb-4">{title}</h2>
          {description && (
            <p className="text-lg text-gray-700">{description}</p>
          )}
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="shadow-sm hover:shadow transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="bg-teal-500 rounded-full p-1">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <p className="ml-3 text-base text-gray-700">{benefit}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessGoalKeyBenefits;
