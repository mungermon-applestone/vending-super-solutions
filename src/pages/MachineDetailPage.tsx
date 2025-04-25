
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useContentfulMachine } from '@/hooks/cms/useContentfulMachines';
import { Loader2, AlertTriangle } from 'lucide-react';
import MachineDetail from '@/components/machineDetail/MachineDetail';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { forceContentfulProvider } from '@/services/cms/cmsInit';

const MachineDetailPage = () => {
  const { slug, machineId } = useParams<{ slug?: string; machineId?: string }>();
  const navigate = useNavigate();
  const identifier = slug || machineId;

  // Force use of Contentful provider for this page
  useEffect(() => {
    forceContentfulProvider();
  }, []);

  console.log('MachineDetailPage - Route params:', { slug, machineId, identifier });

  const { data: machine, isLoading, error } = useContentfulMachine(identifier);

  useEffect(() => {
    // If we loaded a machine and we're on the old /machine/:id route,
    // redirect to the new URL structure
    if (machine && machineId) {
      console.log('Redirecting from legacy ID route to slug route');
      navigate(`/machines/${machine.slug}`, { replace: true });
    }
  }, [machine, machineId, navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div className="py-24 text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
          <p>Loading machine information from Contentful...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    console.error('Error loading machine from Contentful:', error);
    return (
      <Layout>
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
      </Layout>
    );
  }

  if (!machine) {
    return (
      <Layout>
        <div className="container mx-auto py-20">
          <div className="max-w-lg mx-auto">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-amber-800 mb-3">Machine Not Found</h3>
              <p className="text-amber-600 mb-6">
                {identifier ? (
                  `The machine "${identifier}" couldn't be found in Contentful.`
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
      </Layout>
    );
  }

  return (
    <Layout>
      <MachineDetail machine={machine} />
    </Layout>
  );
};

export default MachineDetailPage;
