import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useContentfulMachine } from '@/hooks/cms/useContentfulMachines';
import MachineDetailHero from '@/components/machineDetail/MachineDetailHero';
import MachineDetailFeatures from '@/components/machineDetail/MachineDetailFeatures';
import MachineDetailSpecifications from '@/components/machineDetail/MachineDetailSpecifications';
import MachineDetailGallery from '@/components/machineDetail/MachineDetailGallery';
import MachineDetailInquiry from '@/components/machineDetail/MachineDetailInquiry';
import MachineDetailDeployments from '@/components/machineDetail/MachineDetailDeployments';
import { CMSImage } from '@/types/cms';

const ContentfulMachineDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: machine, isLoading, error } = useContentfulMachine(slug);

  // Memoize the machine data to prevent unnecessary re-renders
  const memoizedMachine = useMemo(() => machine, [machine]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching machine:", error);
    }
  }, [error]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </div>
      </Layout>
    );
  }

  if (!memoizedMachine) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Machine Not Found</h2>
            <p className="text-gray-500">Sorry, we couldn't find a machine with that ID.</p>
            <Button asChild variant="outline" size="lg" className="mt-4">
              <Link to="/machines">Back to Machines</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        <MachineDetailHero
          name={memoizedMachine.name || memoizedMachine.title}
          description={memoizedMachine.description}
          mainImage={memoizedMachine.mainImage as CMSImage}
        />

        <div className="container-wide py-12">
          <MachineDetailFeatures features={memoizedMachine.features || []} />
          <MachineDetailSpecifications specs={memoizedMachine.specs || {}} />
          <MachineDetailGallery images={memoizedMachine.images || []} />
          <MachineDetailDeployments machineType={memoizedMachine.type} />
        </div>

        <MachineDetailInquiry machineName={memoizedMachine.name || memoizedMachine.title} />
      </div>
    </Layout>
  );
};

export default ContentfulMachineDetail;
