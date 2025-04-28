
import React from 'react';

interface HeroImageProps {
  imageUrl: string;
  imageAlt: string;
}

const HeroImage: React.FC<HeroImageProps> = ({ imageUrl, imageAlt }) => {
  return (
    <div className="relative">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <img 
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-auto object-cover"
        />
      </div>
    </div>
  );
};

export default HeroImage;
