
import React from 'react';

interface MachinesIntroSectionProps {
  introTitle?: string;
  introDescription?: string;
}

const MachinesIntroSection: React.FC<MachinesIntroSectionProps> = ({ 
  introTitle = "Our Machines", 
  introDescription = "We offer a variety of machines to meet your business needs. Browse our selection of vending machines and smart lockers below."
}) => {
  return (
    <section className="bg-white py-12">
      <div className="container text-center max-w-3xl">
        <h2 className="text-3xl font-bold text-vending-blue-dark mb-4">
          {introTitle}
        </h2>
        <p className="text-gray-600">
          {introDescription}
        </p>
      </div>
    </section>
  );
};

export default MachinesIntroSection;
