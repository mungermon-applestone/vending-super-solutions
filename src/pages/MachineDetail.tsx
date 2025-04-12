
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import CTASection from '@/components/common/CTASection';
import { getMachineBySlug } from '@/services/cms';
import { CMSMachine } from '@/types/cms';
import MachineDetailHero from '@/components/machineDetail/MachineDetailHero';
import MachineDetailSpecifications from '@/components/machineDetail/MachineDetailSpecifications';
import MachineDetailFeatures from '@/components/machineDetail/MachineDetailFeatures';
import MachineDetailDeployments from '@/components/machineDetail/MachineDetailDeployments';
import MachineDetailGallery from '@/components/machineDetail/MachineDetailGallery';
import MachineDetailInquiry from '@/components/machineDetail/MachineDetailInquiry';
import { useMachineBySlug } from '@/hooks/useMachinesData';

const MachineDetail = () => {
  const { machineId, machineType } = useParams<{ machineType: string, machineId: string }>();

  // Use our specialized hook that handles fetching by slug
  const { data: machine, isLoading, error } = useMachineBySlug(machineType, machineId);

  if (isLoading) {
    return (
      <Layout>
        <div className="py-24 text-center">
          <div className="animate-pulse rounded-md bg-gray-200 h-8 w-1/4 mx-auto mb-4"></div>
          <div className="animate-pulse rounded-md bg-gray-200 h-4 w-1/2 mx-auto"></div>
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
      <MachineDetailInquiry machineTitle={machine.title} />
      <CTASection />
    </Layout>
  );
};

export default MachineDetail;
