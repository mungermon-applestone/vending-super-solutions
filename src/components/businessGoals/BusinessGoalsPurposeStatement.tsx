
import React from 'react';

interface BusinessGoalsPurposeStatementProps {
  title: string;
  description?: string;
}

const BusinessGoalsPurposeStatement: React.FC<BusinessGoalsPurposeStatementProps> = ({ 
  title, 
  description 
}) => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-vending-blue-dark">{title}</h2>
          {description && (
            <p className="text-lg text-gray-700">{description}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default BusinessGoalsPurposeStatement;
