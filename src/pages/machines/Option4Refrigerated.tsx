
import React from 'react';
import { useMachineBySlug } from '@/hooks/useMachinesData';
import MachineDetail from '@/components/machineDetail/MachineDetail';
import { useParams } from 'react-router-dom';

const Option4Refrigerated = () => {
  const { machineType, machineId } = useParams<{ machineType: string, machineId: string }>();
  // Update to use the hook with just machineId
  const { data: machine, isLoading, error } = useMachineBySlug(machineId);

  if (isLoading) {
    return (
      <div>Loading...</div>
    );
  }

  if (error) {
    return (
      <div>Error: {error.message}</div>
    );
  }

  if (!machine) {
    return (
      <div>Machine not found.</div>
    );
  }

  return (
    <MachineDetail machine={machine} />
  );
};

export default Option4Refrigerated;
