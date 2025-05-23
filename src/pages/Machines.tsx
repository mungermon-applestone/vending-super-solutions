
import React, { useEffect } from 'react';
import { useMachines } from '@/hooks/useMachinesData';
import { Loader2 } from 'lucide-react';
import { CMSMachine } from '@/types/cms';
import { forceContentfulProvider } from '@/services/cms/cmsInit';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageHero from '@/components/common/PageHero';
import { useTestimonialSection } from '@/hooks/cms/useTestimonialSection';
import { Server, HardDrive, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { SimpleContactCTA } from '@/components/common';
import ContentfulTestimonialsCarousel from '@/components/testimonials/ContentfulTestimonialsCarousel';

const MachinesPage = () => {
  // Force Contentful provider
  useEffect(() => {
    try {
      forceContentfulProvider();
    } catch (err) {
      console.error('Error forcing Contentful provider:', err);
    }
  }, []);

  const { data: machines = [], isLoading, error } = useMachines();
  const { data: testimonialSection, isLoading: isLoadingTestimonials, error: testimonialError } = useTestimonialSection('machines');
  
  const vendingMachines = machines.filter(machine => machine.type === 'vending');
  const smartLockers = machines.filter(machine => machine.type === 'locker');

  const renderMachineCard = (machine: CMSMachine) => {
    const machineImage = machine.images?.[0]?.url || 'https://placehold.co/600x400?text=No+Image';
    const machineAlt = machine.images?.[0]?.alt || machine.title;
    
    return (
      <Card key={machine.id} className="overflow-hidden hover:shadow-xl transition-shadow">
        <div className="relative h-48">
          <img 
            src={machineImage} 
            alt={machineAlt} 
            className="w-full h-full object-cover"
          />
          {machine.temperature && (
            <div className="absolute top-0 right-0 bg-vending-teal/90 text-white px-3 py-1 rounded-bl-lg text-sm font-medium">
              {machine.temperature.charAt(0).toUpperCase() + machine.temperature.slice(1)}
            </div>
          )}
        </div>
        <CardContent className="p-6">
          <div className="flex items-start mb-2">
            <div className="bg-vending-blue-light p-2 rounded-full mr-3">
              {machine.type === 'vending' ? (
                <Server className="h-4 w-4 text-vending-blue" />
              ) : (
                <HardDrive className="h-4 w-4 text-vending-blue" />
              )}
            </div>
            <h3 className="text-xl font-semibold">{machine.title}</h3>
          </div>
          <p className="text-gray-600 mb-4 line-clamp-2">{machine.description}</p>
          
          <Button asChild variant="outline" className="w-full">
            <Link to={`/machines/${machine.slug}`} className="flex items-center justify-center">
              View Specifications <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
        <p>Loading machines information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 text-center text-red-500">
        <h2 className="text-2xl font-bold mb-4">Error Loading Machines</h2>
        <p>Unable to load machines. Please try again later.</p>
        <p className="mt-4 text-sm">{error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section using PageHero component */}
      <PageHero 
        pageKey="machines"
        fallbackTitle="Our Machines"
        fallbackSubtitle="Explore our comprehensive range of vending machines and smart lockers designed to meet diverse business needs."
        fallbackImage="https://images.unsplash.com/photo-1493723843671-1d655e66ac1c"
        fallbackImageAlt="Various vending machines"
        fallbackPrimaryButtonText="Vending Machines"
        fallbackPrimaryButtonUrl="#vending-machines"
        fallbackSecondaryButtonText="Smart Lockers"
        fallbackSecondaryButtonUrl="#smart-lockers"
      />

      {/* Vending Machines Section */}
      <section id="vending-machines" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-vending-blue-dark mb-4">Vending Machines</h2>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 h-80">
                  <div className="animate-pulse">
                    <div className="bg-gray-300 h-40 w-full mb-4"></div>
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-6"></div>
                    <div className="h-10 bg-gray-300 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : vendingMachines.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendingMachines.map(renderMachineCard)}
            </div>
          ) : (
            <div className="text-center py-10">
              <p>No vending machines found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Smart Lockers Section */}
      <section id="smart-lockers" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-vending-blue-dark mb-4">Smart Lockers</h2>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="bg-gray-50 rounded-lg shadow-md p-6 h-80">
                  <div className="animate-pulse">
                    <div className="bg-gray-300 h-40 w-full mb-4"></div>
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-6"></div>
                    <div className="h-10 bg-gray-300 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : smartLockers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {smartLockers.map(renderMachineCard)}
            </div>
          ) : (
            <div className="text-center py-10">
              <p>No smart lockers found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <ContentfulTestimonialsCarousel 
        data={testimonialSection} 
        isLoading={isLoadingTestimonials}
        error={testimonialError}
      />

      {/* Replace CTASection with SimpleContactCTA */}
      <SimpleContactCTA />
    </>
  );
};

export default MachinesPage;
