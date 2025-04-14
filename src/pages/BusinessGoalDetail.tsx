
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useBusinessGoal } from '@/hooks/cms/useBusinessGoals';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import BusinessGoalHero from '@/components/businessGoals/BusinessGoalHero';

const BusinessGoalDetail = () => {
  const { goalSlug } = useParams<{ goalSlug: string }>();
  const { data: goal, isLoading, error } = useBusinessGoal(goalSlug || '');

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto" />
          <p className="mt-4">Loading business goal information...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-xl font-semibold text-red-500 mb-4">Error Loading Business Goal</h1>
            <p className="mb-6">{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
            <Button asChild>
              <Link to="/goals">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Business Goals
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!goal) {
    return (
      <Layout>
        <div className="container py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-xl font-semibold mb-4">Business Goal Not Found</h1>
            <p className="mb-6">We couldn't find the business goal "{goalSlug}" in the database.</p>
            <Button asChild>
              <Link to="/goals">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Business Goals
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="mb-6">
        <BusinessGoalHero
          title={goal.title}
          description={goal.description}
          icon={<span className="text-white text-2xl">🎯</span>} // Placeholder icon
          image={goal.image_url || 'https://placehold.co/800x400?text=No+Image'}
        />
      </div>

      <div className="container py-10">
        <Button asChild variant="outline" className="mb-6">
          <Link to="/goals">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Business Goals
          </Link>
        </Button>

        {goal.features && goal.features.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goal.features.map((feature, index) => (
                <div key={index} className="p-6 border rounded-lg">
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {goal.benefits && goal.benefits.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6">Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goal.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-vending-teal-light rounded-full p-2 mr-3 flex-shrink-0">
                    <span className="text-vending-teal">✓</span>
                  </div>
                  <p>{typeof benefit === 'string' ? benefit : benefit.benefit}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BusinessGoalDetail;
