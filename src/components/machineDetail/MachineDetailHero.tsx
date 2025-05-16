
import React from 'react';

export interface MachineDetailHeroProps {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
}

const MachineDetailHero: React.FC<MachineDetailHeroProps> = ({ 
  title, 
  description, 
  image, 
  imageAlt = 'Machine image'
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center">
          <div className="w-full lg:w-1/2 pr-0 lg:pr-8 mb-8 lg:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h1>
            <p className="text-lg text-gray-700">{description}</p>
          </div>
          <div className="w-full lg:w-1/2">
            {image && (
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src={image} 
                  alt={imageAlt} 
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineDetailHero;
