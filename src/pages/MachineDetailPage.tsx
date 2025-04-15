
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useContentfulMachine } from '@/hooks/cms/useContentfulMachines';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import MachinePageTemplate from '@/components/machines/MachinePageTemplate';

const MachineDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: machine, isLoading, error } = useContentfulMachine(slug || '');
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-8" />
            <Skeleton className="h-96 w-full rounded-lg mb-8" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Machine</h3>
              <p className="text-red-600">{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/machines">Return to Machines</Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!machine) {
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-amber-50 border border-amber-200 rounded-md p-6 text-center">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Machine Not Found</h3>
              <p className="text-amber-600">The machine you're looking for doesn't exist or has been removed.</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/machines">Return to Machines</Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Format machine data to match MachinePageTemplate requirements
  const formattedMachine = {
    id: machine.id,
    slug: machine.slug,
    title: machine.title,
    // Ensure type is strictly "vending" or "locker"
    type: machine.type === 'locker' ? 'locker' : 'vending' as 'vending' | 'locker',
    // Ensure temperature is always set
    temperature: machine.temperature || 'ambient',
    description: machine.description,
    // Ensure images is always an array with the required format
    images: Array.isArray(machine.images) ? machine.images.map(img => ({
      url: img.url,
      alt: img.alt
    })) : [],
    // Ensure specs is an object
    specs: machine.specs || {},
    // Ensure features is an array
    features: machine.features || [],
    // Ensure deploymentExamples is an array
    deploymentExamples: machine.deploymentExamples || []
  };
  
  return <MachinePageTemplate machine={formattedMachine} />;
};

export default MachineDetailPage;
