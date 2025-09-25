
import React from 'react';
import TranslatableText from '@/components/translation/TranslatableText';

interface BusinessGoalsPurposeStatementProps {
  heading?: string;
  title?: string;  // Alternative to heading
  content?: string;
  description?: string;  // Alternative to content
}

const BusinessGoalsPurposeStatement: React.FC<BusinessGoalsPurposeStatementProps> = ({ 
  heading, 
  title,
  content,
  description
}) => {
  // Use heading or title, with heading taking precedence if both are provided
  const displayHeading = heading || title || '';
  // Use content or description, with content taking precedence if both are provided
  const displayContent = content || description || '';
  
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-vending-blue-dark">
            <TranslatableText context="business-goals">{displayHeading}</TranslatableText>
          </h2>
          <p className="text-xl text-gray-700">
            <TranslatableText context="business-goals">{displayContent}</TranslatableText>
          </p>
        </div>
      </div>
    </section>
  );
};

export default BusinessGoalsPurposeStatement;
