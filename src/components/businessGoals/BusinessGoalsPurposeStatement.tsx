
import React from 'react';

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
            {displayHeading}
          </h2>
          <p className="text-xl text-gray-700">
            {displayContent}
          </p>
        </div>
      </div>
    </section>
  );
};

export default BusinessGoalsPurposeStatement;
