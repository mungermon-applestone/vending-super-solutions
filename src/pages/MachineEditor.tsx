
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Loader2 } from 'lucide-react';
import { useMachineById, useCreateMachine, useUpdateMachine } from '@/hooks/useMachinesData';
import MachineForm from '@/components/admin/machine-editor/MachineForm';
import { MachineFormValues } from '@/utils/machineMigration/types';

const MachineEditor = () => {
  const { machineId } = useParams<{ machineId: string }>();
  const navigate = useNavigate();
  
  // A machine is in edit mode if machineId exists and is not 'new'
  const isEditMode = !!machineId && machineId !== 'new';
  const isCreating = !isEditMode;
  
  console.log('[MachineEditor] Machine ID from URL:', machineId);
  console.log('[MachineEditor] Is edit mode:', isEditMode);

  const { data: machine, isLoading } = useMachineById(machineId);
  const createMachineMutation = useCreateMachine();
  const updateMachineMutation = useUpdateMachine();
  
  const handleFormSubmit = async (data: MachineFormValues) => {
    if (isCreating) {
      await createMachineMutation.mutateAsync(data);
    } else if (machineId) {
      await updateMachineMutation.mutateAsync({ id: machineId, machineData: data });
    }
    
    navigate('/admin/machines');
  };

  if (isLoading && !isCreating) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {isCreating ? "Add New Machine" : `Edit Machine: ${machine?.title}`}
          </h1>
        </div>

        <MachineForm 
          machine={machine} 
          isCreating={isCreating} 
          onSubmit={handleFormSubmit} 
        />
      </div>
    </Layout>
  );
};

export default MachineEditor;
