
import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useContentfulMachine } from '@/hooks/cms/useContentfulMachines';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import MachineDetailHero from '@/components/machineDetail/MachineDetailHero';
import MachineDetailFeatures from '@/components/machineDetail/MachineDetailFeatures';
import MachineDetailSpecifications from '@/components/machineDetail/MachineDetailSpecifications';
import MachineDetailGallery from '@/components/machineDetail/MachineDetailGallery';
import MachineDetailInquiry from '@/components/machineDetail/MachineDetailInquiry';
import MachineDetailDeployments from '@/components/machineDetail/MachineDetailDeployments';
import { CMSMachine } from '@/types/cms';

const ContentfulMachineDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  
  useEffect(() => {
    console.log('[ContentfulMachineDetail] Rendering with slug:', slug);
  }, [slug]);
  
  const { data: machine, isLoading, error } = useContentfulMachine(slug);
  
  const machineData: CMSMachine | null = useMemo(() => {
    if (!machine) return null;
    return machine;
  }, [machine]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-12">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-96 rounded-lg" />
            <div>
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    toast({
      title: "Error Loading Machine",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive"
    });
    
    return (
      <Layout>
        <div className="container py-24 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Machine</h2>
          <p className="text-gray-600 mb-8">
            We couldn't load the machine details. Please try again later.
          </p>
          <Button asChild>
            <a href="/machines">Return to Machines</a>
          </Button>
        </div>
      </Layout>
    );
  }

  if (!machineData) {
    return (
      <Layout>
        <div className="container py-24 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Machine Not Found</h2>
          <p className="text-gray-600 mb-8">
            We couldn't find the machine you're looking for.
          </p>
          <Button asChild>
            <a href="/machines">Return to Machines</a>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <MachineDetailHero
        title={machineData.title}
        subtitle={machineData.shortDescription || ''}
        image={machineData.mainImage?.url || ''}
        type={machineData.type}
        temperature={machineData.temperature || 'ambient'}
      />
      
      {machineData.features && machineData.features.length > 0 && (
        <MachineDetailFeatures features={machineData.features} />
      )}
      
      {machineData.specs && Object.keys(machineData.specs).length > 0 && (
        <MachineDetailSpecifications specs={machineData.specs} />
      )}
      
      {machineData.images && machineData.images.length > 0 && (
        <MachineDetailGallery images={machineData.images} />
      )}
      
      <MachineDetailDeployments />
      
      <MachineDetailInquiry 
        machineId={machineData.id} 
        machineName={machineData.title}
      />
    </Layout>
  );
};

export default ContentfulMachineDetail;
