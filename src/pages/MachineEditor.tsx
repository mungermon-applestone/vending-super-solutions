
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useMachineById } from '@/hooks/useMachinesData';

const MachineEditor = () => {
  const { machineId } = useParams<{ machineId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isCreating = !machineId;

  const { data: machine, isLoading } = useMachineById(machineId);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // This is just a placeholder for now
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: isCreating ? "Machine created" : "Machine updated",
        description: `The machine was ${isCreating ? 'created' : 'updated'} successfully.`,
        variant: "success",
      });
      
      navigate('/admin/machines');
    } catch (error) {
      console.error('Error saving machine:', error);
      toast({
        title: "Error",
        description: `Failed to ${isCreating ? 'create' : 'update'} machine.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            {/* Placeholder for machine editor form */}
            <div className="p-8 text-center text-gray-600">
              <p className="text-lg mb-4">
                Machine editor form will be implemented soon.
              </p>
              <p className="mb-6">
                This page is a placeholder for the machine editor that will allow you to add and edit machines.
              </p>
              
              <div className="flex justify-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/machines')}
                >
                  Back to Machines
                </Button>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isCreating ? "Creating..." : "Updating..."}
                    </>
                  ) : (
                    isCreating ? "Create Machine" : "Update Machine"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default MachineEditor;
