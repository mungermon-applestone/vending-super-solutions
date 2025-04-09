import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import CTASection from '@/components/common/CTASection';
import { Button } from '@/components/ui/button';
import { ChevronRight, Server, HardDrive } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useMachines } from '@/hooks/useMachinesData';
import { Wifi } from '@/components/ui/Wifi';

const MachinesLanding = () => {
  const location = useLocation();

  // Scroll to section if hash is present in URL
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.hash]);

  const { data: machines = [], isLoading } = useMachines();
  
  // Filter machines by type
  const vendingMachines = machines.filter(machine => machine.type === 'vending');
  const smartLockers = machines.filter(machine => machine.type === 'locker');

  const renderMachineCard = (machine) => {
    const machineImage = machine.images?.[0]?.url || machine.image;
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
          <p className="text-gray-600 mb-4">{machine.description}</p>
          
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
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light py-16">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-vending-blue-dark mb-6">
                Our Machines
              </h1>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl">
                Explore our comprehensive range of vending machines and smart lockers designed to meet diverse business needs.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild variant="default" className="btn-primary">
                  <a href="#vending-machines">Vending Machines</a>
                </Button>
                <Button asChild variant="outline" className="btn-outline">
                  <a href="#smart-lockers">Smart Lockers</a>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1493723843671-1d655e66ac1c" 
                alt="Various vending machines" 
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-vending-teal text-white p-4 rounded-lg shadow-lg hidden md:block">
                <p className="font-bold">Hardware agnostic platform</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vending Machines Section */}
      <section id="vending-machines" className="py-16 bg-vending-gray">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-vending-blue-dark mb-4">Vending Machines</h2>
            <p className="subtitle mx-auto">
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vendingMachines.map(renderMachineCard)}
            </div>
          )}
        </div>
      </section>

      {/* Smart Lockers Section */}
      <section id="smart-lockers" className="py-16 bg-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-vending-blue-dark mb-4">Smart Lockers</h2>
            <p className="subtitle mx-auto">
              Secure, temperature-controlled locker solutions for automated pickup and delivery.
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="bg-vending-gray rounded-lg shadow-md p-6 h-80">
                  <div className="animate-pulse">
                    <div className="bg-gray-300 h-40 w-full mb-4"></div>
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-6"></div>
                    <div className="h-10 bg-gray-300 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {smartLockers.map(renderMachineCard)}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-vending-blue-dark text-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Software Compatible with All Machine Types</h2>
              <p className="text-lg opacity-90 mb-6">
                Our platform integrates seamlessly with all our machine types, providing a unified management experience regardless of your hardware mix.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-vending-teal flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Single dashboard to manage all your machines</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-vending-teal flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Real-time inventory tracking across your entire fleet</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-vending-teal flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Unified payment processing and reporting</span>
                </li>
                <li className="flex items-start">
                  <Wifi className="h-6 w-6 text-vending-teal flex-shrink-0 mr-2" />
                  <span>Wireless connectivity for remote management</span>
                </li>
              </ul>
              <Button asChild className="btn-secondary">
                <Link to="/technology">Learn More About Our Technology</Link>
              </Button>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1581092921461-7d56631a4ab9" 
                alt="Software dashboard" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default MachinesLanding;
