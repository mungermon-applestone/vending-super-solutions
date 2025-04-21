
import React from 'react';
import { FileText } from 'lucide-react';

interface KeyFeaturesSectionProps {
  title?: string;
  description?: string;
}

const KeyFeaturesSection = ({ title, description }: KeyFeaturesSectionProps) => {
  if (!title && !description) return null;

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {title && (
            <h2 className="text-3xl font-bold mb-6 text-gray-900">{title}</h2>
          )}
          {description && (
            <div className="flex items-start justify-center gap-3">
              <FileText className="w-6 h-6 text-vending-blue flex-shrink-0 mt-1" />
              <p className="text-lg text-gray-600 text-left">{description}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default KeyFeaturesSection;
