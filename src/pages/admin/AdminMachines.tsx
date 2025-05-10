
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Loader2, Plus, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMachines, useDeleteMachine } from '@/hooks/useMachinesData';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import MachineHeader from '@/components/admin/machines/MachineHeader';
import MachineTableRow from '@/components/admin/machines/MachineTableRow';
import DeleteMachineDialog from '@/components/admin/machines/DeleteMachineDialog';
import { CMSMachine } from '@/types/cms';
import { useCloneMachine } from '@/hooks/cms/useCloneCMS';

const AdminMachines = () => {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [machineToDelete, setMachineToDelete] = useState<{id: string, title: string} | null>(null);

  // For cloning functionality
  const cloneMachineMutation = useCloneMachine();
  const [cloningMachineId, setCloningMachineId] = useState<string | null>(null);

  const { data: machines = [], isLoading, refetch } = useMachines();
  const typedMachines = machines as CMSMachine[];
  const deleteMutation = useDeleteMachine();

  const handleDeleteClick = (machine: CMSMachine) => {
    console.log("[AdminMachines] Delete clicked for machine:", machine);
    setMachineToDelete({
      id: machine.id,
      title: machine.title
    });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!machineToDelete) return;
    
    try {
      console.log("[AdminMachines] Confirming delete for machine:", machineToDelete);
      await deleteMutation.mutateAsync(machineToDelete.id);
      setDeleteDialogOpen(false);
      setMachineToDelete(null);
      toast({
        title: "Machine deleted",
        description: `${machineToDelete.title} has been deleted successfully.`
      });
    } catch (error) {
      console.error('[AdminMachines] Error deleting machine:', error);
      toast({
        title: "Error",
        description: "Failed to delete machine. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleCloneMachine = async (machine: CMSMachine) => {
    try {
      setCloningMachineId(machine.id);
      
      toast({
        title: "Deprecated Feature",
        description: "Direct database operations are being phased out. Please use Contentful directly.",
        variant: "destructive",
      });
      
      const clonedMachine = await cloneMachineMutation.mutateAsync(machine.id);
      
      if (clonedMachine) {
        toast({
          title: "Machine cloned",
          description: `${machine.title} has been cloned successfully. Note that this functionality will be removed in the future.`
        });
      }
    } catch (error) {
      console.error('[AdminMachines] Error cloning machine:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to clone machine. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCloningMachineId(null);
    }
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshing...",
      description: "Refreshing machines data from the database",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Alert variant="warning" className="mb-6 border-amber-300 bg-amber-50">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-800 font-medium">Deprecated Administration Interface</AlertTitle>
          <AlertDescription className="text-amber-700">
            <p>This machine administration interface is being phased out in favor of direct Contentful CMS management.</p>
            <p className="mt-2">Changes made here will not affect content displayed on the website, which is now managed through Contentful.</p>
          </AlertDescription>
        </Alert>

        <MachineHeader onRefresh={handleRefresh} />

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : typedMachines && typedMachines.length > 0 ? (
          <div className="bg-white rounded-md shadow overflow-x-auto">
            <div className="p-4 border-b">
              <p className="text-sm text-gray-500">
                Showing {typedMachines.length} machine{typedMachines.length !== 1 && 's'}
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Temperature</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {typedMachines.map((machine) => (
                  <MachineTableRow
                    key={machine.id}
                    machine={{
                      id: machine.id,
                      title: machine.title,
                      type: machine.type || '',
                      temperature: machine.temperature || '',
                      slug: machine.slug || ''
                    }}
                    onDeleteClick={() => handleDeleteClick(machine)}
                    onCloneClick={() => handleCloneMachine(machine)}
                    isCloningId={cloningMachineId}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="bg-white rounded-md shadow p-8 text-center">
            <p className="text-gray-500 mb-4">No machines found</p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
              <Button variant="outline" asChild>
                <Link to="/admin/machines/migrate">
                  <Plus className="h-4 w-4 mr-2" /> Import Sample Data
                </Link>
              </Button>
              <Button asChild>
                <Link to="/admin/machines/new">
                  <Plus className="h-4 w-4 mr-2" /> Add Your First Machine
                </Link>
              </Button>
            </div>
          </div>
        )}

        <DeleteMachineDialog
          isOpen={deleteDialogOpen}
          setIsOpen={setDeleteDialogOpen}
          machineToDelete={machineToDelete}
          onConfirmDelete={confirmDelete}
          isDeleting={deleteMutation.isPending}
        />
      </div>
    </Layout>
  );
};

export default AdminMachines;
