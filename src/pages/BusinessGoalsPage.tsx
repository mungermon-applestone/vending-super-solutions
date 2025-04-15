
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useBusinessGoals } from '@/hooks/cms/useBusinessGoals';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import PageHero from '@/components/common/PageHero';
import MachineTypeIcon from '@/components/admin/machines/MachineTypeIcon';

const BusinessGoalsPage = () => {
  const { data: businessGoals, isLoading, error } = useBusinessGoals();
  const navigate = useNavigate();
  
  return (
    <Layout>
      {/* Hero Section using PageHero */}
      <PageHero 
        pageKey="business-goals"
        fallbackTitle="Business Goals"
        fallbackSubtitle="Our comprehensive vending solutions help you achieve your business goals with powerful technology and customizable options."
        fallbackImage="https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        fallbackImageAlt="Business Goals"
        fallbackPrimaryButtonText="Request a Demo"
        fallbackPrimaryButtonUrl="/contact"
        fallbackSecondaryButtonText="Explore Solutions"
        fallbackSecondaryButtonUrl="/products"
      />

      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h2 className="text-3xl font-bold text-vending-blue-dark mb-6">Achieve Your Business Objectives</h2>
          <p className="text-xl text-gray-700">
            Transform your vending operations with solutions designed to meet specific business needs.
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6">
                <div className="mb-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
                <Skeleton className="h-8 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Business Goals</h3>
            <p className="text-red-600">{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
          </div>
        )}

        {businessGoals && businessGoals.length === 0 && !isLoading && !error && (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Business Goals Found</h3>
            <p className="text-gray-600">Check back later for information on how our solutions can help your business.</p>
          </div>
        )}

        {businessGoals && businessGoals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businessGoals.map((goal) => (
              <div 
                key={goal.id} 
                className="border border-gray-200 rounded-lg p-6 bg-white hover:border-vending-blue transition-colors duration-300 card-hover"
              >
                <div className="mb-4">
                  {goal.icon ? (
                    <div className="bg-vending-blue-light bg-opacity-20 p-3 rounded-full w-12 h-12 flex items-center justify-center text-vending-blue">
                      <MachineTypeIcon type={goal.icon} />
                    </div>
                  ) : (
                    <div className="bg-vending-blue-light bg-opacity-20 p-3 rounded-full w-12 h-12 flex items-center justify-center text-vending-blue">
                      <ArrowRight className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-3">{goal.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{goal.description}</p>
                <Button 
                  variant="ghost" 
                  className="text-vending-blue hover:text-vending-blue-dark font-medium flex items-center p-0"
                  onClick={() => navigate(`/business/${goal.slug}`)}
                >
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BusinessGoalsPage;
