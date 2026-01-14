import React from 'react';
import { useContentfulMachines } from '@/hooks/cms/useContentfulMachines';
import { Loader2 } from 'lucide-react';

const MachinesPresentationPage: React.FC = () => {
  const { data: machines, isLoading, error } = useContentfulMachines();

  // Get image URL from machine data
  const getImageUrl = (machine: any): string | undefined => {
    // Check thumbnail first
    if (machine.thumbnail?.[0]?.url) {
      return machine.thumbnail[0].url;
    }
    // Fall back to images array
    if (machine.images?.[0]?.url) {
      return machine.images[0].url;
    }
    return undefined;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !machines) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Unable to load machines</p>
      </div>
    );
  }

  // Filter to only visible machines
  const visibleMachines = machines.filter((m: any) => m.visible !== false);

  return (
    <div className="min-h-screen bg-white p-8 print:p-4">
      {/* Print-friendly styles */}
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Optional print button */}
      <div className="no-print fixed top-4 right-4 z-10">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
        >
          Print / Save as PDF
        </button>
      </div>

      {/* Machine Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {visibleMachines.map((machine: any) => {
            const imageUrl = getImageUrl(machine);
            
            return (
              <div 
                key={machine.id} 
                className="flex flex-col items-center text-center"
              >
                {/* Image Container */}
                <div className="w-full aspect-square bg-gray-50 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={machine.title}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No image</span>
                    </div>
                  )}
                </div>
                
                {/* Machine Name */}
                <h3 className="text-sm md:text-base font-medium text-gray-900 leading-tight">
                  {machine.title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MachinesPresentationPage;
