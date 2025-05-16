
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import MachineDetailHero from '@/components/machineDetail/MachineDetailHero';
import MachineDetailFeatures from '@/components/machineDetail/MachineDetailFeatures';
import MachineDetailSpecifications from '@/components/machineDetail/MachineDetailSpecifications';
import MachineDetailGallery from '@/components/machineDetail/MachineDetailGallery';
import MachineDetailDeployments from '@/components/machineDetail/MachineDetailDeployments';
import MachineDetailInquiry from '@/components/machineDetail/MachineDetailInquiry';
import { useContentfulMachine } from '@/hooks/cms/useContentfulMachines';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CMSImage, CMSMachine } from '@/types/cms';

const MachineDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: machine, isLoading, error } = useContentfulMachine(slug);
  
  React.useEffect(() => {
    console.log("[MachineDetail] Rendering with:", { slug, machine, isLoading, error });
  }, [slug, machine, isLoading, error]);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container py-16 flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <p className="text-lg text-gray-600">Loading machine details...</p>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <div className="container py-16">
          <Alert variant="destructive" className="mb-8">
            <AlertTitle>Error Loading Machine</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : 'Failed to load machine details'}
            </AlertDescription>
          </Alert>
          <div className="p-8 border border-gray-200 rounded-lg text-center">
            <h2 className="text-2xl font-semibold mb-4">Unable to load machine details</h2>
            <p className="text-gray-600 mb-4">We're having trouble retrieving information about this machine.</p>
            <p className="text-gray-600">Please try again later or contact support if this problem persists.</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!machine) {
    return (
      <Layout>
        <div className="container py-16">
          <Alert variant="warning" className="mb-8">
            <AlertTitle>Machine Not Found</AlertTitle>
            <AlertDescription>
              We couldn't find a machine with the identifier: {slug}
            </AlertDescription>
          </Alert>
          <div className="p-8 border border-gray-200 rounded-lg text-center">
            <h2 className="text-2xl font-semibold mb-4">Machine Not Found</h2>
            <p className="text-gray-600 mb-4">The machine you're looking for doesn't exist or may have been removed.</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Transform the image data if needed
  const machineImages: CMSImage[] = machine.images || [];
  const { title, description, type, features, specs } = machine as CMSMachine;

  return (
    <Layout>
      <MachineDetailHero 
        title={title || 'Unnamed Machine'} 
        description={description || 'No description available.'}
        image={machineImages.length > 0 ? machineImages[0].url : undefined}
        imageAlt={machineImages.length > 0 ? machineImages[0].alt : title}
      />
      
      <div className="container py-12 space-y-16">
        {type && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Machine Type</h2>
            <p className="text-gray-700">{type.charAt(0).toUpperCase() + type.slice(1)}</p>
            
            {specs?.temperature && (
              <p className="text-gray-700 mt-2">Temperature: {specs.temperature.charAt(0).toUpperCase() + specs.temperature.slice(1)}</p>
            )}
          </div>
        )}
        
        {features && features.length > 0 && (
          <MachineDetailFeatures 
            features={features} 
          />
        )}
        
        <MachineDetailSpecifications 
          specifications={specs || {}} 
        />
        
        {machineImages && machineImages.length > 1 && (
          <MachineDetailGallery 
            images={machineImages}
          />
        )}
        
        <MachineDetailDeployments 
          machineId={machine.id}
          machineType={machine.type || 'vending'}
        />
        
        <MachineDetailInquiry 
          machineId={machine.id}
          machineTitle={machine.title || 'Unnamed Machine'}
        />
      </div>
    </Layout>
  );
};

export default MachineDetail;
