import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, ExternalLink, Server, HardDrive, AlertTriangle } from 'lucide-react';
import { useMachinesPageContent } from '@/hooks/cms/useMachinesPageContent';
import InquiryForm from '@/components/machines/contact/InquiryForm';
import TechnologyPageHero from '@/components/technology/TechnologyPageHero';
import { toast } from 'sonner';
import { useTestimonialSection } from '@/hooks/cms/useTestimonialSection';
import TestimonialsSection from '@/components/testimonials/TestimonialsSection';
import { useContentfulMachines } from '@/hooks/cms/useContentfulMachines';
import { forceContentfulProvider, initCMS } from '@/services/cms/cmsInit';
import { isContentfulConfigured } from '@/config/cms';

const MachinesPage: React.FC = () => {
  // Force the use of Contentful provider and initialize CMS
  useEffect(() => {
    const setupCMS = async () => {
      try {
        if (isContentfulConfigured()) {
          await initCMS();
        } else {
          console.log('[MachinesPage] Contentful not configured, forcing provider anyway');
          forceContentfulProvider();
        }
      } catch (error) {
        console.error('[MachinesPage] Error initializing CMS:', error);
      }
    };
    
    setupCMS();
  }, []);

  const { data: machines, isLoading, error, refetch } = useContentfulMachines();
  const { data: pageContent } = useMachinesPageContent();
  const { data: testimonialSection } = useTestimonialSection('machines');
  
  useEffect(() => {
    if (machines) {
      console.log(`Retrieved ${machines.length} machines from Contentful:`, machines);
      if (machines.length === 0) {
        toast.warning('No machines found in Contentful. Check console logs for more details.');
      }
    }
  }, [machines]);

  console.log('Machines data from Contentful:', machines);
  console.log('Page content from Contentful:', pageContent);

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
                {machine.images && machine.images.length > 0 ? (
                  <img 
                    src={machine.images[0].url} 
                    alt={machine.images[0].alt || machine.title} 
                    className="w-full h-full object-contain p-4"
                    onError={(e) => {
                      console.error(`Error loading image for ${machine.title}:`, e);
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
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
                <CardTitle className="text-xl">{machine.title || 'Unnamed Machine'}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-600 line-clamp-3">
                  {machine.description || 'No description available'}
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to={`/machines/${machine.slug}`}>
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
      {/* Use the improved TechnologyPageHero with fallback handling */}
      <TechnologyPageHero 
        entryId="3bH4WrT0pLKDeG35mUekGq" 
        fallbackTitle="Advanced Vending Machines"
        fallbackSubtitle="Our machines combine cutting-edge technology with reliable performance to meet your business needs."
        fallbackImageUrl="https://images.unsplash.com/photo-1562184552-997c461abbe6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
      />

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

      <div className="container py-12 md:py-16" id="machines-section">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {pageContent?.machineTypesTitle || "Our Machine Range"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {pageContent?.machineTypesDescription || "Explore our comprehensive range of vending machines and smart lockers designed to meet diverse business needs."}
          </p>
        </div>

        {!isContentfulConfigured() && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-8">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Contentful is not configured</p>
                <p className="text-sm text-amber-700 mt-1">
                  Please set up your Contentful Space ID and Delivery Token in Admin &gt; Environment Variables.
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Using fallback data for preview purposes.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mb-8">
          <Button onClick={() => refetch()} variant="outline" className="flex items-center gap-2">
            Refresh Contentful Data <Loader2 className={`h-4 w-4 ${isLoading ? 'animate-spin' : 'hidden'}`} />
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
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Machines from Contentful</h3>
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
                <h3 className="text-lg font-semibold text-amber-800 mb-2">No Machines Found in Contentful</h3>
                <p className="text-amber-600">
                  No machines are currently available from Contentful. 
                  This could be due to:
                </p>
                <ul className="text-amber-600 mt-2 list-disc list-inside text-left max-w-lg mx-auto">
                  <li>No machine entries in Contentful</li>
                  <li>Connection issues with Contentful API</li>
                  <li>Data transformation errors</li>
                </ul>
                <p className="text-amber-600 mt-4">Check the browser console for detailed debugging information.</p>
              </div>
            )}
          </>
        )}
      </div>
      
      {testimonialSection && <TestimonialsSection data={testimonialSection} />}
      
      <InquiryForm title="Interested in our machines?" />
    </Layout>
  );
};

export default MachinesPage;
