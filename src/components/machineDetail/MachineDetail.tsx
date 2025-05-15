
import React from 'react';
import { CMSMachine } from '@/types/cms';
import MachineDetailHero from './MachineDetailHero';
import MachineDetailSpecifications from './MachineDetailSpecifications';
import MachineDetailFeatures from './MachineDetailFeatures';
import MachineDetailDeployments from './MachineDetailDeployments';
import MachineDetailGallery from './MachineDetailGallery';
import CTASection from '@/components/common/CTASection';

interface MachineDetailProps {
  machine: CMSMachine;
}

const MachineDetail: React.FC<MachineDetailProps> = ({ machine }) => {
  // Log machine data to help with debugging
  console.log('[MachineDetail] Rendering machine detail:', {
    id: machine.id,
    title: machine.title,
    hasThumbnail: !!machine.thumbnail,
    thumbnailUrl: machine.thumbnail?.url || 'none',
    hasImages: machine.images?.length > 0
  });

  return (
    <div>
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center">
            <div className="w-full lg:w-1/2 pr-0 lg:pr-8 mb-8 lg:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{machine.title}</h1>
              <p className="text-lg text-gray-700">{machine.description}</p>
            </div>
            <div className="w-full lg:w-1/2">
              {machine.images && machine.images.length > 0 && (
                <div className="rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src={machine.images[0].url} 
                    alt={machine.images[0].alt || machine.title} 
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-12">
          {/* Specifications section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {machine.specs && Object.entries(machine.specs).map(([key, value]) => (
                <div key={key} className="flex items-start">
                  <div className="mr-3 text-blue-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-500">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                    <span className="text-gray-800">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Features section */}
          {machine.features && machine.features.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Features</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {machine.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Gallery section */}
          {machine.images && machine.images.length > 1 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Gallery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {machine.images.map((image, index) => (
                  <div key={index} className="rounded-lg overflow-hidden shadow-md">
                    <img 
                      src={image.url} 
                      alt={image.alt || `${machine.title} - Image ${index + 1}`} 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <CTASection />
    </div>
  );
};

export default MachineDetail;
