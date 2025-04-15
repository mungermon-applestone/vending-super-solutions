import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useContentfulMachines } from '@/hooks/cms/useContentfulMachines';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';
import PageHero from '@/components/common/PageHero';

const MachinesPage = () => {
  const { data: machines, isLoading, error } = useContentfulMachines();
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero Section using PageHero */}
      <PageHero 
        pageKey="machines"
        fallbackTitle="Our Machines"
        fallbackSubtitle="Discover our range of cutting-edge vending machines and smart lockers designed for modern businesses."
        fallbackImage="https://images.unsplash.com/photo-1584680226833-0d680d0a0794?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        fallbackImageAlt="Vending Machines"
        fallbackPrimaryButtonText="Request Information"
        fallbackPrimaryButtonUrl="/contact"
        fallbackSecondaryButtonText="How It Works"
        fallbackSecondaryButtonUrl="/technology"
      />

      {/* Filters Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-center">
              <Button
                variant="outline"
                className="w-full md:w-auto"
                onClick={() => navigate('/machines?type=all')}
              >
                All Machines
              </Button>
            </div>
            <div className="flex items-center justify-center">
              <Button
                variant="outline"
                className="w-full md:w-auto"
                onClick={() => navigate('/machines?type=vending')}
              >
                Vending Machines
              </Button>
            </div>
            <div className="flex items-center justify-center">
              <Button
                variant="outline"
                className="w-full md:w-auto"
                onClick={() => navigate('/machines?type=locker')}
              >
                Smart Lockers
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-12">
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Machines</h3>
            <p className="text-red-600">{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
          </div>
        )}

        {machines && machines.length === 0 && !isLoading && !error && (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Machines Found</h3>
            <p className="text-gray-600">Check back later for our machine offerings.</p>
          </div>
        )}

        {machines && machines.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {machines.map((machine) => (
              <Card key={machine.id} className="overflow-hidden transition-all hover:shadow-lg">
                {machine.images && machine.images.length > 0 && (
                  <img 
                    src={machine.images[0].url} 
                    alt={machine.images[0].alt || machine.title} 
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/400x200?text=Machine+Image";
                    }}
                  />
                )}
                <CardHeader>
                  <CardTitle>{machine.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700">
                      {machine.type === 'vending' ? 'Vending' : 'Locker'}
                    </span>
                    {machine.temperature && (
                      <span className="text-xs px-2 py-1 bg-blue-100 rounded-full text-blue-700">
                        {machine.temperature}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">{machine.description}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    className="text-vending-blue hover:text-vending-blue-dark font-medium flex items-center p-0"
                    onClick={() => navigate(`/machines/${machine.slug}`)}
                  >
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MachinesPage;
