
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import CTASection from '@/components/common/CTASection';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useContentfulMachines } from '@/hooks/cms/useContentfulMachines';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Server, HardDrive } from 'lucide-react';

const MachinesPage: React.FC = () => {
  const { data: machines, isLoading, error } = useContentfulMachines();
  
  console.log('Machines data:', machines);

  return (
    <Layout>
      <div className="bg-gradient-to-b from-vending-blue-light to-white py-16">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-vending-blue-dark">
            Our Machines
          </h1>
          <p className="text-lg text-center max-w-3xl mx-auto mb-12 text-gray-700">
            Discover our range of innovative vending and locker solutions designed to meet diverse business needs.
          </p>
        </div>
      </div>

      <div className="container mx-auto py-12">
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-8 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Machines</h3>
            <p className="text-red-600">{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
          </div>
        )}

        {!isLoading && !error && machines && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {machines.map((machine) => (
              <Card key={machine.id} className="overflow-hidden flex flex-col h-full">
                <div className="relative h-48 bg-gray-50">
                  {machine.images && machine.images[0] ? (
                    <img 
                      src={machine.images[0].url} 
                      alt={machine.images[0].alt || machine.title} 
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      {machine.type === 'vending' ? (
                        <Server className="h-16 w-16 text-gray-300" />
                      ) : (
                        <HardDrive className="h-16 w-16 text-gray-300" />
                      )}
                    </div>
                  )}
                  {machine.temperature && (
                    <div className="absolute top-0 right-0 bg-vending-blue text-white px-3 py-1 m-2 rounded-md text-sm">
                      {machine.temperature}
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{machine.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 line-clamp-3">{machine.description}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to={`/machines/${machine.slug}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <CTASection />
    </Layout>
  );
};

export default MachinesPage;
