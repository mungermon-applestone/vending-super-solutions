
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMachineById, useCreateMachine, useUpdateMachine } from '@/hooks/useMachinesData';
import MachineForm from '@/components/admin/machine-editor/MachineForm';
import { MachineFormValues, MachineData } from '@/utils/machineMigration/types';
import { useToast } from '@/hooks/use-toast';
import DeprecatedAdminLayout from '@/components/admin/layout/DeprecatedAdminLayout';

const MachineEditor = () => {
  const { machineId } = useParams<{ machineId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // A machine is in edit mode if machineId exists and is not 'new'
  const isEditMode = !!machineId && machineId !== 'new';
  const isCreating = !isEditMode;
  
  console.log('[MachineEditor] Machine ID from URL:', machineId);
  console.log('[MachineEditor] Is edit mode:', isEditMode);

  const { data: cmsMachine, isLoading, error: machineError } = useMachineById(machineId);
  const createMachineMutation = useCreateMachine();
  const updateMachineMutation = useUpdateMachine();
  
  // Convert CMSMachine to MachineData with required fields
  const machine: MachineData | null = cmsMachine ? {
    id: cmsMachine.id,
    title: cmsMachine.title,
    slug: cmsMachine.slug,
    type: cmsMachine.type || 'vending', // Provide default value for type
    temperature: cmsMachine.temperature || 'ambient', // Provide default value for temperature
    description: cmsMachine.description,
    images: cmsMachine.images || [],
    specs: cmsMachine.specs || {},
    features: cmsMachine.features || [],
    deploymentExamples: cmsMachine.deploymentExamples || []
  } : null;
  
  const handleFormSubmit = async (data: MachineFormValues) => {
    console.log('[MachineEditor] Form submission with data:', data);
    
    // Show deprecation warning
    toast({
      title: "Deprecated Feature",
      description: "Direct database operations are being phased out. Please use Contentful directly.",
      variant: "destructive",
    });
    
    try {
      if (isCreating) {
        console.log('[MachineEditor] Creating new machine');
        await createMachineMutation.mutateAsync(data);
        console.log('[MachineEditor] Machine created successfully');
      } else if (machineId) {
        console.log(`[MachineEditor] Updating machine with ID: ${machineId}`);
        await updateMachineMutation.mutateAsync({ id: machineId, machineData: data });
        console.log('[MachineEditor] Machine updated successfully');
      }
      
      // Only navigate if the mutation was successful
      navigate('/admin/machines');
    } catch (error) {
      console.error('[MachineEditor] Error during form submission:', error);
      
      // Show error toast
      toast({
        title: "Error",
        description: error instanceof Error 
          ? `Failed to ${isCreating ? 'create' : 'update'} machine: ${error.message}` 
          : `Failed to ${isCreating ? 'create' : 'update'} machine. Please check console for details.`,
        variant: "destructive",
      });
      
      // Re-throw to allow the form component to handle the error as well
      throw error;
    }
  };

  // Handle loading errors
  if (machineError && !isCreating) {
    return (
      <DeprecatedAdminLayout
        title="Error Loading Machine"
        description="Could not load the machine data"
        contentType="Machine"
        backPath="/admin/machines"
      >
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div>
              <p className="text-red-700 font-medium">Error loading machine</p>
              <p className="text-red-600">
                {machineError instanceof Error
                  ? machineError.message
                  : "Failed to load machine data. Please try again."}
              </p>
            </div>
          </div>
        </div>
      </DeprecatedAdminLayout>
    );
  }

  if (isLoading && !isCreating) {
    return (
      <DeprecatedAdminLayout
        title="Loading Machine Data"
        description="Please wait while the machine data loads"
        contentType="Machine"
        backPath="/admin/machines"
        showContentfulButton={false}
      >
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      </DeprecatedAdminLayout>
    );
  }

  return (
    <DeprecatedAdminLayout
      title={isCreating ? "Add New Machine" : `Edit Machine: ${machine?.title}`}
      description="This machine editor is being phased out. Content edits should be made directly in Contentful CMS."
      contentType="Machine"
      backPath="/admin/machines"
    >
      <MachineForm 
        machine={machine} 
        isCreating={isCreating} 
        onSubmit={handleFormSubmit} 
      />
    </DeprecatedAdminLayout>
  );
};

export default MachineEditor;
