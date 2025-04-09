
import React from 'react';
import { CMSMachine } from '@/types/cms';

interface MachineDetailGalleryProps {
  title: string;
  images: CMSMachine['images'];
}

const MachineDetailGallery: React.FC<MachineDetailGalleryProps> = ({ title, images }) => {
  return (
    <section className="py-12 bg-vending-gray">
      <div className="container-wide">
        <h2 className="text-2xl font-bold mb-8 text-center text-vending-blue-dark">Additional Views</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {images.slice(0, 3).map((image, index) => (
            <img 
              key={index}
              src={image.url}
              alt={image.alt || `${title} - View ${index + 1}`}
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MachineDetailGallery;
