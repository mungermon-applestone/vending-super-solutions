
import React from 'react';

interface PurposeStatementProps {
  title: string;
  description?: string;
}

const PurposeStatement: React.FC<PurposeStatementProps> = ({ title, description }) => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 id="purpose-statement-title" className="text-3xl font-bold text-center mb-6">{title}</h2>
        {description && (
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
            {description}
          </p>
        )}
      </div>
    </section>
  );
};

export default PurposeStatement;
