
import React from 'react';
import { CMSImage } from '@/types/cms';

export interface MachineDetailGalleryProps {
  images: CMSImage[];
}

const MachineDetailGallery: React.FC<MachineDetailGalleryProps> = ({ images }) => {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Gallery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className="rounded-lg overflow-hidden shadow-md">
            <img 
              src={image.url} 
              alt={image.alt || 'Machine image'} 
              className="w-full h-48 object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MachineDetailGallery;
