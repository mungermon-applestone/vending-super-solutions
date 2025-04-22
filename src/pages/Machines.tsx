
import { useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { useMachines } from '@/hooks/cms/useMachines';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import TechnologyPageHero from '@/components/technology/TechnologyPageHero';
import { useMachinesPageContent } from '@/hooks/cms/useMachinesPageContent';
import InquiryForm from '@/components/machines/contact/InquiryForm';

const Machines = () => {
  const { data: machines, isLoading, error, refetch } = useMachines();
  const { data: pageContent } = useMachinesPageContent();
  const queryClient = useQueryClient();
  
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['machines'] });
  };

  // Separate machines by type
  const vendingMachines = machines?.filter(machine => machine.type === 'vending') || [];
  const lockers = machines?.filter(machine => machine.type === 'locker') || [];
  
  const renderMachineGrid = (machineList: typeof machines, title: string) => {
    if (!machineList?.length) return null;
    
    return (
      <div className="mb-16">
        <h3 className="text-2xl font-semibold mb-6">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machineList.map((machine) => (
            <Card key={machine.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{machine.title}</CardTitle>
                <CardDescription className="flex gap-2">
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    {machine.type}
                  </span>
                  {machine.temperature && (
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      {machine.temperature}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-3 mb-4">{machine.description}</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" size="sm">
                  <Link to={`/machines/${machine.type}/${machine.slug}`}>
                    View Details <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <Layout>
      {/* Hero Section */}
      <TechnologyPageHero entryId="3bH4WrT0pLKDeG35mUekGq" />
      
      {/* Intro Section */}
      {pageContent && (
        <section className="bg-white py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {pageContent.introTitle}
              </h2>
              <p className="text-lg text-gray-600">
                {pageContent.introDescription}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Machines Section */}
      <div className="container py-12 md:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {pageContent?.machineTypesTitle}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {pageContent?.machineTypesDescription}
          </p>
        </div>

        <div className="flex justify-end mb-8">
          <Button onClick={handleRefresh} variant="outline">
            Refresh Data
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <Card>
            <CardContent className="py-10">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-red-500 mb-2">Error Loading Machines</h3>
                <p className="text-gray-600">
                  {error instanceof Error ? error.message : 'An unknown error occurred'}
                </p>
                <Button onClick={() => refetch()} className="mt-4" variant="outline">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : machines && machines.length > 0 ? (
          <div>
            {renderMachineGrid(vendingMachines, "Vending Machines")}
            {renderMachineGrid(lockers, "Smart Lockers")}
          </div>
        ) : (
          <Card>
            <CardContent className="py-10">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">No Machines Found</h3>
                <p className="text-gray-600">
                  There are no machines in the database.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Inquiry Form */}
      <InquiryForm title="Interested in our machines?" />
    </Layout>
  );
};

export default Machines;
