
import React, { useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useContentfulMachine } from '@/hooks/cms/useContentfulMachines';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import MachineDetail from '@/components/machineDetail/MachineDetail';

const MachineDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  
  // Ensure slug is a string and not undefined
  const machineSlug = slug || '';
  
  // Special case for direct URL access to /machines/divi-wp
  const isDiviWP = machineSlug === 'divi-wp' || location.pathname.endsWith('/divi-wp');
  
  // If explicitly divi-wp, force that slug
  const querySlug = isDiviWP ? 'divi-wp' : machineSlug;
  
  const { data: machine, isLoading, error } = useContentfulMachine(querySlug);

  console.log('MachineDetailPage render - URL path:', location.pathname);
  console.log('MachineDetailPage render - slug param:', slug);
  console.log('MachineDetailPage render - query slug:', querySlug);
  console.log('Machine data from Contentful:', machine);
  
  // Special case for divi-wp, force direct fetch by ID
  useEffect(() => {
    if (isDiviWP) {
      console.log('Special case for divi-wp detected, should fetch ID: 1omUbnEhB6OeBFpwPFj1Ww');
    }
    
    // Scroll to top when the component mounts or slug changes
    window.scrollTo(0, 0);
  }, [isDiviWP]);
  
  if (isLoading) {
    console.log('Machine detail page is in loading state');
    return (
      <Layout>
        <div className="py-12 md:py-16 bg-gradient-to-br from-blue-500 to-blue-600">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <Skeleton className="h-6 w-32 mb-4" />
                <Skeleton className="h-16 w-3/4 mb-4" />
                <Skeleton className="h-24 w-full mb-6" />
                <div className="flex gap-4">
                  <Skeleton className="h-10 w-40" />
                  <Skeleton className="h-10 w-40" />
                </div>
              </div>
              <Skeleton className="h-80 rounded-lg" />
            </div>
          </div>
        </div>
        <div className="container mx-auto py-16">
          <Skeleton className="h-8 w-64 mx-auto mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    console.error('Error loading machine:', error);
    return (
      <Layout>
        <div className="container mx-auto py-20">
          <div className="max-w-lg mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
              <h3 className="text-xl font-semibold text-red-800 mb-3">Error Loading Machine</h3>
              <p className="text-red-600 mb-6">{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
              <Button asChild variant="outline">
                <Link to="/machines" className="flex items-center gap-2">
                  <ArrowLeft size={16} /> Return to Machines
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!machine) {
    console.log('No machine data found for slug:', querySlug);
    return (
      <Layout>
        <div className="container mx-auto py-20">
          <div className="max-w-lg mx-auto">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-amber-800 mb-3">Machine Not Found</h3>
              <p className="text-amber-600 mb-6">
                {querySlug ? (
                  `The machine with slug "${querySlug}" couldn't be found in Contentful.`
                ) : (
                  "No machine slug was provided in the URL."
                )}
                {isDiviWP && (
                  <div className="mt-4 p-3 bg-amber-100 rounded text-left">
                    <p className="font-medium">Looking for Divi-WP?</p>
                    <p>Trying to fetch entry with ID: 1omUbnEhB6OeBFpwPFj1Ww</p>
                  </div>
                )}
              </p>
              <Button asChild variant="outline">
                <Link to="/machines" className="flex items-center gap-2">
                  <ArrowLeft size={16} /> Return to Machines
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  console.log('Rendering MachineDetail component with data:', machine);
  return (
    <Layout>
      <MachineDetail machine={machine} />
    </Layout>
  );
};

export default MachineDetailPage;
