
import React from 'react';

interface BusinessGoalsPurposeStatementProps {
  heading: string;
  content: string;
}

const BusinessGoalsPurposeStatement: React.FC<BusinessGoalsPurposeStatementProps> = ({ 
  heading, 
  content 
}) => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-vending-blue-dark">
            {heading}
          </h2>
          <p className="text-xl text-gray-700">
            {content}
          </p>
        </div>
      </div>
    </section>
  );
};

export default BusinessGoalsPurposeStatement;
