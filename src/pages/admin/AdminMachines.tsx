
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Loader2, Plus } from 'lucide-react';
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
import MachineHeader from '@/components/admin/machines/MachineHeader';
import MachineTableRow from '@/components/admin/machines/MachineTableRow';
import DeleteMachineDialog from '@/components/admin/machines/DeleteMachineDialog';

const AdminMachines = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [machineToDelete, setMachineToDelete] = useState<{id: string, title: string} | null>(null);

  const { data: machines = [], isLoading, refetch } = useMachines();
  const deleteMutation = useDeleteMachine();

  const handleDeleteClick = (machine: any) => {
    setMachineToDelete({
      id: machine.id,
      title: machine.title
    });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!machineToDelete) return;
    
    try {
      await deleteMutation.mutateAsync(machineToDelete.id);
      setDeleteDialogOpen(false);
      setMachineToDelete(null);
    } catch (error) {
      console.error('Error deleting machine:', error);
      toast({
        title: "Error",
        description: "Failed to delete machine. Please try again.",
        variant: "destructive",
      });
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
        <MachineHeader onRefresh={handleRefresh} />

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : machines && machines.length > 0 ? (
          <div className="bg-white rounded-md shadow overflow-x-auto">
            <div className="p-4 border-b">
              <p className="text-sm text-gray-500">
                Showing {machines.length} machine{machines.length !== 1 && 's'}
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
                {machines.map((machine) => (
                  <MachineTableRow 
                    key={machine.id} 
                    machine={machine} 
                    onDeleteClick={handleDeleteClick} 
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
      </div>

      <DeleteMachineDialog
        isOpen={deleteDialogOpen}
        setIsOpen={setDeleteDialogOpen}
        machineToDelete={machineToDelete}
        onConfirmDelete={confirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </Layout>
  );
};

export default AdminMachines;
