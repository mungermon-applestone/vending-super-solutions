
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ChevronRight, Server, HardDrive } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useMachines } from '@/hooks/useMachinesData';
import { Wifi } from '@/components/ui/Wifi';
import { CMSMachine } from '@/types/cms';
import PageHero from '@/components/common/PageHero';
import { useTestimonialSection } from '@/hooks/cms/useTestimonialSection';
import { SimpleContactCTA } from '@/components/common';
import ContentfulTestimonialsCarousel from '@/components/testimonials/ContentfulTestimonialsCarousel';

const MachinesLanding = () => {
  const location = useLocation();
  const { data: machines = [], isLoading } = useMachines();
  const typedMachines = machines as CMSMachine[];
  const { data: testimonialSection, isLoading: isLoadingTestimonials, error: testimonialError } = useTestimonialSection('machines');
  
  // Filter machines by type
  const vendingMachines = typedMachines.filter(machine => machine.type === 'vending');
  const smartLockers = typedMachines.filter(machine => machine.type === 'locker');

  // Scroll to section if hash is present in URL
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.hash]);

  const renderMachineCard = (machine) => {
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
            <Link to={`/machines/${machine.type}/${machine.slug}`} className="flex items-center justify-center">
              View Specifications <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  };

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
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive selection of vending machines to suit various environments and product requirements.
            </p>
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
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Secure, temperature-controlled locker solutions for automated pickup and delivery.
            </p>
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

export default MachinesLanding;
