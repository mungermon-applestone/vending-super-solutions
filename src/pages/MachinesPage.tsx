
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import CTASection from '@/components/common/CTASection';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useContentfulMachines } from '@/hooks/cms/useContentfulMachines';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, ExternalLink, Server, HardDrive } from 'lucide-react';
import { useMachinesPageContent } from '@/hooks/cms/useMachinesPageContent';
import InquiryForm from '@/components/machines/contact/InquiryForm';
import TechnologyPageHero from '@/components/technology/TechnologyPageHero';

const MachinesPage: React.FC = () => {
  const { data: machines, isLoading, error, refetch } = useContentfulMachines();
  const { data: pageContent } = useMachinesPageContent();
  
  console.log('Machines data from Contentful:', machines);
  console.log('Page content from Contentful:', pageContent);

  // Separate machines by type
  const vendingMachines = machines?.filter(machine => machine.type === 'vending') || [];
  const lockers = machines?.filter(machine => machine.type === 'locker') || [];

  const renderMachineCards = (machineList: any[], title: string) => {
    if (!machineList?.length) return null;
    
    return (
      <div className="mb-16">
        <h3 className="text-2xl font-semibold mb-6">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machineList.map((machine) => (
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
                  <Link to={`/machine/${machine.id}`}>
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
      {/* Hero Section - Using TechnologyPageHero with specific entry ID */}
      <TechnologyPageHero entryId="3bH4WrT0pLKDeG35mUekGq" />

      {/* Intro Section */}
      {pageContent && (
        <section className="bg-white py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {pageContent.introTitle || "Innovative Machine Solutions"}
              </h2>
              <p className="text-lg text-gray-600">
                {pageContent.introDescription || "Our machines combine cutting-edge technology with reliable performance to deliver exceptional value."}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Machines Section */}
      <div className="container py-12 md:py-16" id="machines-section">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {pageContent?.machineTypesTitle || "Our Machine Range"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {pageContent?.machineTypesDescription || "Explore our comprehensive range of vending machines and smart lockers designed to meet diverse business needs."}
          </p>
        </div>

        <div className="flex justify-end mb-8">
          <Button onClick={() => refetch()} variant="outline" className="flex items-center gap-2">
            Refresh Data <Loader2 className={`h-4 w-4 ${isLoading ? 'animate-spin' : 'hidden'}`} />
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
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
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Machines</h3>
            <p className="text-red-600">{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
            <Button onClick={() => refetch()} className="mt-4" variant="outline">
              Try Again
            </Button>
          </div>
        ) : (
          <>
            {renderMachineCards(vendingMachines, "Vending Machines")}
            {renderMachineCards(lockers, "Smart Lockers")}
            
            {vendingMachines.length === 0 && lockers.length === 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-6 text-center">
                <h3 className="text-lg font-semibold text-amber-800 mb-2">No Machines Found</h3>
                <p className="text-amber-600">No machines are currently available from our content management system.</p>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Inquiry Form */}
      <InquiryForm title="Interested in our machines?" />
      
      <CTASection />
    </Layout>
  );
};

export default MachinesPage;
