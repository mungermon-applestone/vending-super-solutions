
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useMachineBySlug } from '@/hooks/useMachinesData';
import MachineDetail from '@/components/machineDetail/MachineDetail';
import { useParams } from 'react-router-dom';

const Option4Refrigerated = () => {
  const { machineType, machineId } = useParams<{ machineType: string, machineId: string }>();
  // Update to use the hook with just machineId
  const { data: machine, isLoading, error } = useMachineBySlug(machineId);

  if (isLoading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div>Error: {error.message}</div>
      </Layout>
    );
  }

  if (!machine) {
    return (
      <Layout>
        <div>Machine not found.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <MachineDetail machine={machine} />
    </Layout>
  );
};

export default Option4Refrigerated;
