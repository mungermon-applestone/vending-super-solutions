
import React from 'react';

export interface MachinesIntroSectionProps {
  title: string;
  description: string;
  id?: string;
}

const MachinesIntroSection: React.FC<MachinesIntroSectionProps> = ({
  title,
  description,
  id
}) => {
  return (
    <section id={id} className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-vending-blue-dark">
            {title}
          </h2>
          <p className="text-lg text-gray-700">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default MachinesIntroSection;
