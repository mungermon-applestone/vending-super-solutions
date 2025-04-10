
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useBusinessGoal } from '@/hooks/useCMSData';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import InquiryForm from '@/components/machines/contact/InquiryForm';

// Import the business goal components
import BusinessGoalHero from '@/components/businessGoals/BusinessGoalHero';
import BusinessGoalFeatures from '@/components/businessGoals/BusinessGoalFeatures';

const BusinessGoalDetail = () => {
  const { goalSlug } = useParams<{ goalSlug: string }>();
  const { data: goal, isLoading, error } = useBusinessGoal(goalSlug);

  // Function to render icon for features
  const renderFeatureIcon = (iconName: string | undefined) => {
    // Default to Check icon if no icon is provided
    return <Check className="h-6 w-6" />;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-10">
          <Skeleton className="h-16 w-3/4 mb-6" />
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-8 w-full mb-4" />
          <Skeleton className="h-8 w-2/3" />
        </div>
      </Layout>
    );
  }

  if (error || !goal) {
    return (
      <Layout>
        <div className="container mx-auto py-10">
          <div className="bg-red-50 border border-red-200 rounded-md p-6">
            <h1 className="text-2xl font-bold text-red-800 mb-4">Error Loading Business Goal</h1>
            <p className="text-red-600 mb-6">
              {error instanceof Error ? error.message : 'This business goal could not be found.'}
            </p>
            <Button asChild>
              <Link to="/goals">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Business Goals
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Prepare features with icons for the BusinessGoalFeatures component - this is where the error occurs
  // We need to convert the icon property to a React node before passing it to the component
  const featuresWithIcons = goal.features?.map(feature => ({
    ...feature,
    icon: renderFeatureIcon(feature.icon?.toString())
  })) || [];

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto py-3">
          <nav className="flex items-center text-sm">
            <Link to="/" className="text-gray-500 hover:text-vending-blue">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <Link to="/goals" className="text-gray-500 hover:text-vending-blue">Business Goals</Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="text-vending-blue font-medium">{goal.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <BusinessGoalHero
        title={goal.title}
        description={goal.description}
        icon={renderFeatureIcon(goal.icon?.toString())}
        image={goal.image?.url || 'https://placehold.co/600x400?text=Business+Goal'}
      />

      {/* Features Section */}
      {featuresWithIcons.length > 0 && (
        <BusinessGoalFeatures features={featuresWithIcons} />
      )}

      {/* Benefits Section (if available) */}
      {goal.benefits && goal.benefits.length > 0 && (
        <section className="py-16 bg-vending-gray">
          <div className="container-wide">
            <h2 className="text-3xl font-bold text-center text-vending-blue-dark mb-8">
              Key Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {goal.benefits.map((benefit, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm flex">
                  <div className="mr-4 text-vending-teal">
                    <Check className="h-6 w-6" />
                  </div>
                  <p className="text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-vending-blue text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to achieve your {goal.title} goals?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Our team is ready to help you implement the right vending solution for your business needs.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button className="bg-white text-vending-blue hover:bg-gray-100" asChild>
              <Link to="/contact">Request a Demo</Link>
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-vending-blue-dark" asChild>
              <Link to="/products">Explore Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <InquiryForm title={`${goal.title} Solutions`} />
    </Layout>
  );
};

export default BusinessGoalDetail;
