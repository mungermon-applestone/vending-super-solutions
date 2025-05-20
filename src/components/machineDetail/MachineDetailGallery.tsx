
import React from 'react';
import { CMSImage } from '@/types/cms';

interface MachineDetailGalleryProps {
  title: string;
  images: CMSImage[];
  maxImages?: number;
}

const MachineDetailGallery: React.FC<MachineDetailGalleryProps> = ({ 
  title, 
  images, 
  maxImages = 3 
}) => {
  if (!images || images.length <= 1) return null;
  
  return (
    <section className="py-12 bg-vending-gray">
      <div className="container-wide">
        <h2 className="text-2xl font-bold mb-8 text-center text-vending-blue-dark">Additional Views</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {images.slice(0, maxImages).map((image, index) => (
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
