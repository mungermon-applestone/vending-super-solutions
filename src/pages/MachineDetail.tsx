
import { useParams } from 'react-router-dom';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MachineDetailComponent from '@/components/machineDetail/MachineDetail';
import { useContentfulMachine } from '@/hooks/cms/useContentfulMachines';
import { useEffect } from 'react';

const MachineDetail = () => {
  const { machineId } = useParams<{ machineId: string }>();
  
  // Use the recommended useContentfulMachine hook
  const { data: machine, isLoading, error } = useContentfulMachine(machineId);
  
  // Scroll to the top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  console.log("Fetching machine:", machineId);
  console.log("Machine data:", machine);

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
        <p>Loading machine information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-20">
        <div className="max-w-lg mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-800 mb-3">Error Loading Machine</h3>
            <p className="text-red-600 mb-6">{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
            <Button asChild variant="outline">
              <Link to="/machines">View All Machines</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!machine) {
    return (
      <div className="container mx-auto py-20">
        <div className="max-w-lg mx-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-amber-800 mb-3">Machine Not Found</h3>
            <p className="text-amber-600 mb-6">
              {machineId ? (
                `The machine "${machineId}" couldn't be found.`
              ) : (
                "No machine identifier was provided."
              )}
            </p>
            <Button asChild variant="outline">
              <Link to="/machines">View All Machines</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <MachineDetailComponent machine={machine} />;
};

export default MachineDetail;
