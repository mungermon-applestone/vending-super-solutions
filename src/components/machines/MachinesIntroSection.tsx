
import React from 'react';

export interface MachinesIntroSectionProps {
  title?: string;
  introTitle?: string;  // Alternative to title
  description?: string;
  introDescription?: string;  // Alternative to description
  id?: string;
}

const MachinesIntroSection: React.FC<MachinesIntroSectionProps> = ({
  title,
  introTitle,
  description,
  introDescription,
  id
}) => {
  // Use title or introTitle, with title taking precedence if both are provided
  const displayTitle = title || introTitle || '';
  // Use description or introDescription, with description taking precedence if both are provided
  const displayDescription = description || introDescription || '';

  return (
    <section id={id} className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-vending-blue-dark">
            {displayTitle}
          </h2>
          <p className="text-lg text-gray-700">
            {displayDescription}
          </p>
        </div>
      </div>
    </section>
  );
};

export default MachinesIntroSection;
