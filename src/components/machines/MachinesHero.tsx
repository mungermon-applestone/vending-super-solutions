
import React from 'react';

export interface MachinesHeroProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
}

const MachinesHero: React.FC<MachinesHeroProps> = ({
  title,
  subtitle,
  imageUrl
}) => {
  return (
    <section className="relative bg-gradient-to-br from-vending-blue-light to-vending-teal-light py-16 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-vending-blue-dark">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xl text-vending-blue">
                {subtitle}
              </p>
            )}
          </div>
          {imageUrl && (
            <div className="md:w-1/2 flex justify-center">
              <img 
                src={imageUrl} 
                alt={title}
                className="rounded-lg shadow-xl max-h-80 object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MachinesHero;
