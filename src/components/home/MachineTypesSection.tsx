
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { createClient } from 'contentful';
import { Loader2 } from 'lucide-react';

// Contentful client setup
const client = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID || '',
  accessToken: import.meta.env.VITE_CONTENTFUL_DELIVERY_API_KEY || '',
});

// Machine type interface
interface MachineType {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl?: string;
}

// Transform Contentful machine entry to our interface
const transformMachine = (entry: any): MachineType => ({
  id: entry.sys.id,
  title: entry.fields.title || 'Untitled Machine',
  slug: entry.fields.slug || '',
  description: entry.fields.description || '',
  imageUrl: entry.fields.image?.fields?.file?.url 
    ? `https:${entry.fields.image.fields.file.url}` 
    : undefined
});

const MachineTypesSection: React.FC = () => {
  // Fetch machine types from Contentful
  const { data: machineTypes, isLoading, error } = useQuery({
    queryKey: ['machineTypes'],
    queryFn: async () => {
      const entries = await client.getEntries({
        content_type: 'machine',
        order: ['fields.title'],
      });
      
      return entries.items.map(transformMachine);
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error || !machineTypes) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-800">
          Could not load machine types. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Our Machine Types</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            We offer a variety of machine types to meet your specific needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {machineTypes.map((machine) => (
            <div key={machine.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {machine.imageUrl && (
                <img 
                  src={machine.imageUrl} 
                  alt={machine.title} 
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{machine.title}</h3>
                <p className="text-gray-600 mb-4">{machine.description}</p>
                <Link 
                  to={`/machines/${machine.slug}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Learn more
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MachineTypesSection;
