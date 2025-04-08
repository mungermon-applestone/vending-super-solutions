
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { useMachines, useDeleteMachine } from '@/hooks/useMachinesData';
import { Loader2, Plus, Pencil, Eye, Trash2, Server, Package } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const AdminMachines = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [machineToDelete, setMachineToDelete] = useState<{id: string, title: string} | null>(null);

  const { data: machines, isLoading } = useMachines();
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

  const getMachineTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'vending':
        return <Server className="h-4 w-4" />;
      case 'locker':
        return <Package className="h-4 w-4" />;
      default:
        return <Server className="h-4 w-4" />;
    }
  };
  
  const getTemperatureBadge = (temperature: string) => {
    switch (temperature?.toLowerCase()) {
      case 'refrigerated':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Refrigerated</Badge>;
      case 'ambient':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Ambient</Badge>;
      case 'frozen':
        return <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">Frozen</Badge>;
      case 'multi':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Multi-temp</Badge>;
      case 'controlled':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Controlled</Badge>;
      default:
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">{temperature || 'Unknown'}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Machines Management</h1>
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/admin/machines/new">
                <Plus className="h-4 w-4 mr-2" /> Add New Machine
              </Link>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : machines && machines.length > 0 ? (
          <div className="bg-white rounded-md shadow overflow-x-auto">
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
                  <TableRow key={machine.id}>
                    <TableCell className="font-medium">{machine.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getMachineTypeIcon(machine.type)}
                        <span className="ml-2 capitalize">{machine.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTemperatureBadge(machine.temperature)}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-gray-500">
                      {machine.slug}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => navigate(`/machines/${machine.type}/${machine.slug}`)}
                          title="View machine"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => navigate(`/admin/machines/edit/${machine.id}`)}
                          title="Edit machine"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteClick(machine)}
                          title="Delete machine"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="bg-white rounded-md shadow p-8 text-center">
            <p className="text-gray-500 mb-4">No machines found</p>
            <Button asChild>
              <Link to="/admin/machines/new">
                <Plus className="h-4 w-4 mr-2" /> Add Your First Machine
              </Link>
            </Button>
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the machine "{machineToDelete?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default AdminMachines;
