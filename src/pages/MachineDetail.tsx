
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import CTASection from '@/components/common/CTASection';
import { getMachineBySlug } from '@/services/cms';
import { CMSMachine } from '@/types/cms';
import MachineDetailHero from '@/components/machineDetail/MachineDetailHero';
import MachineDetailSpecifications from '@/components/machineDetail/MachineDetailSpecifications';
import MachineDetailFeatures from '@/components/machineDetail/MachineDetailFeatures';
import MachineDetailDeployments from '@/components/machineDetail/MachineDetailDeployments';
import MachineDetailGallery from '@/components/machineDetail/MachineDetailGallery';
import { useMachineBySlug } from '@/hooks/useMachinesData';
import { Loader2 } from 'lucide-react';
import { SimpleContactCTA } from '@/components/common';

const MachineDetail = () => {
  const { machineId, machineType } = useParams<{ machineType: string, machineId: string }>();
  
  // Use our specialized hook that handles fetching by slug with just the machineId
  const { data: machine, isLoading, error } = useMachineBySlug(machineId);
  
  console.log("Fetching machine:", machineType, machineId);
  console.log("Machine data:", machine);

  if (isLoading) {
    return (
      <Layout>
        <div className="py-24 text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
          <p>Loading machine information...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="py-24 text-center text-red-500">
          <h2 className="text-2xl font-bold mb-4">Error Loading Machine Details</h2>
          <p>Unable to load machine information. Please try again later.</p>
          <p className="mt-4 text-sm">{error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </Layout>
    );
  }

  // If no machine is found, show error
  if (!machine) {
    return (
      <Layout>
        <div className="py-24 text-center">
          <h2 className="text-2xl font-bold mb-4">Machine Not Found</h2>
          <p>We couldn't find the machine you're looking for.</p>
          <p className="mt-4 text-sm text-gray-600">
            Machine ID: {machineId}, Type: {machineType}
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <MachineDetailHero machine={machine} />
      <MachineDetailSpecifications specs={machine.specs} />
      <MachineDetailFeatures features={machine.features} />
      <MachineDetailDeployments deploymentExamples={machine.deploymentExamples} />
      <MachineDetailGallery title={machine.title} images={machine.images} />
      <SimpleContactCTA />
      <CTASection />
    </Layout>
  );
};

export default MachineDetail;
