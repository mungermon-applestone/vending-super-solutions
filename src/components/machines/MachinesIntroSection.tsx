
import React from 'react';

interface MachinesIntroSectionProps {
  introTitle?: string;
  introDescription?: string;
}

const MachinesIntroSection: React.FC<MachinesIntroSectionProps> = ({ 
  introTitle = "Innovative Machine Solutions", 
  introDescription = "Our machines combine cutting-edge technology with reliable performance to deliver exceptional value." 
}) => {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {introTitle}
          </h2>
          <p className="text-lg text-gray-600">
            {introDescription}
          </p>
        </div>
      </div>
    </section>
  );
};

export default MachinesIntroSection;
