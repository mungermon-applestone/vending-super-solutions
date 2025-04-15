
import React, { ReactNode } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useBusinessGoal } from '@/hooks/cms/useBusinessGoals';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';
import BusinessGoalHero from '@/components/businessGoals/BusinessGoalHero';
import MachineTypeIcon from '@/components/admin/machines/MachineTypeIcon';

const BusinessGoalDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: businessGoal, isLoading, error } = useBusinessGoal(slug || '');
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-8" />
            <Skeleton className="h-96 w-full rounded-lg mb-8" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Business Goal</h3>
              <p className="text-red-600">{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/business">Return to Business Goals</Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!businessGoal) {
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-amber-50 border border-amber-200 rounded-md p-6 text-center">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Business Goal Not Found</h3>
              <p className="text-amber-600">The business goal you're looking for doesn't exist or has been removed.</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/business">Return to Business Goals</Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  const icon = businessGoal?.icon ? (
    <MachineTypeIcon type={businessGoal.icon} className="text-white" />
  ) : (
    <div className="h-6 w-6 bg-white rounded-full"></div>
  );
  
  const renderContent = (content: any): ReactNode => {
    if (content === null || content === undefined) {
      return '';
    }
    if (typeof content === 'string' || typeof content === 'number' || typeof content === 'boolean') {
      return String(content);
    }
    if (typeof content === 'object') {
      return JSON.stringify(content);
    }
    return String(content);
  };
  
  return (
    <Layout>
      <BusinessGoalHero
        title={businessGoal?.title || ''}
        description={businessGoal?.description || ''}
        icon={icon}
        image={businessGoal?.image?.url || "https://via.placeholder.com/1200x800?text=Business+Goal+Image"}
      />
      
      {businessGoal?.features && businessGoal.features.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {businessGoal.features.map((feature) => (
                  <div key={feature.id} className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    {feature.icon && (
                      <div className="mb-4 text-vending-blue">
                        <MachineTypeIcon type={feature.icon} />
                      </div>
                    )}
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      
      {businessGoal?.benefits && businessGoal.benefits.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {businessGoal.benefits.map((benefit, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-sm flex items-start">
                    <div className="bg-vending-teal rounded-full p-2 mr-4 text-white flex-shrink-0">
                      <Check className="h-4 w-4" />
                    </div>
                    <p className="text-gray-800">{String(benefit)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      
      <section className="py-16 bg-vending-blue-dark text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Achieve Your Business Goals?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact our team today to learn more about how we can help you with {businessGoal?.title || 'your business goals'}.
          </p>
          <Button size="lg" className="bg-vending-teal hover:bg-vending-teal-dark">Contact Us</Button>
        </div>
      </section>
    </Layout>
  );
};

export default BusinessGoalDetailPage;
