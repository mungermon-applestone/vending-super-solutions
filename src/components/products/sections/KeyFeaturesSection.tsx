
import React from 'react';
import { FileText, Star, Check } from 'lucide-react';

interface KeyFeaturesSectionProps {
  title?: string;
  description?: string;
  features?: string[];
}

const KeyFeaturesSection = ({ title, description, features }: KeyFeaturesSectionProps) => {
  // Don't render the section if there's no content to display
  if (!title && !description && (!features || features.length === 0)) return null;

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {title && (
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">{title}</h2>
          )}
          
          {description && (
            <div className="flex items-start justify-center gap-3 mb-10">
              <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <p className="text-lg text-gray-700 text-left">{description}</p>
            </div>
          )}

          {features && features.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">{feature}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default KeyFeaturesSection;
