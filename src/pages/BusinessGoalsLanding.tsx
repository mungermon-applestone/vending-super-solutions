import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useContentfulBusinessGoals } from '@/hooks/cms/useContentfulBusinessGoals';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import MachineTypeIcon from '@/components/admin/machines/MachineTypeIcon';
import InquiryForm from '@/components/machines/contact/InquiryForm';
import CaseStudyCarousel from '@/components/case-studies/CaseStudyCarousel';
import { getBusinessGoalCaseStudies } from '@/data/caseStudiesData';
import PageHero from '@/components/common/PageHero';

const BusinessGoalsLanding = () => {
  const { data: businessGoals, isLoading, error } = useContentfulBusinessGoals();
  const navigate = useNavigate();
  const businessGoalCaseStudies = getBusinessGoalCaseStudies();

  return (
    <Layout>
      <PageHero 
        pageKey="business-goals"
        fallbackTitle="Business Goals"
        fallbackSubtitle="Our comprehensive vending solutions help you achieve your business goals with powerful technology and customizable options"
        fallbackImage="https://images.unsplash.com/photo-1553877522-43269d4ea984"
        fallbackImageAlt="Business Goals"
        fallbackPrimaryButtonText="Request a Demo"
        fallbackPrimaryButtonUrl="/contact"
        fallbackSecondaryButtonText="Explore Solutions"
        fallbackSecondaryButtonUrl="#solutions"
      />

      {/* Business Goals Grid */}
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

        {!isLoading && !error && (!businessGoals || businessGoals.length === 0) && (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Business Goals Found</h3>
            <p className="text-gray-600">Check back later for information on how our solutions can help your business.</p>
            
            {/* Fallback content for preview environments */}
            {window.location.hostname.includes('lovable') && (
              <div className="mt-8">
                <h4 className="text-md font-semibold text-gray-700 mb-2">Preview Environment</h4>
                <p className="text-gray-600 mb-4">Using fallback business goals data for demonstration purposes</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Fallback business goals */}
                  <FallbackBusinessGoal 
                    title="Expand Footprint" 
                    description="Grow your business with scalable vending solutions that adapt to various locations and needs."
                    icon="trending-up"
                    slug="expand-footprint"
                  />
                  <FallbackBusinessGoal 
                    title="Increase Revenue" 
                    description="Drive more sales through smart inventory management and targeted marketing campaigns."
                    icon="dollar-sign"
                    slug="increase-revenue"
                  />
                  <FallbackBusinessGoal 
                    title="Customer Satisfaction" 
                    description="Enhance user experience with intuitive interfaces and reliable service."
                    icon="users"
                    slug="customer-satisfaction"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {businessGoals && businessGoals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businessGoals.filter(goal => goal.visible !== false).map((goal) => (
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
                  onClick={() => navigate(`/goals/${goal.slug}`)}
                >
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Case Studies Section */}
      <CaseStudyCarousel 
        title="Business Goal Success Stories" 
        subtitle="Real-world examples of how our solutions help achieve business objectives"
        caseStudies={businessGoalCaseStudies}
      />

      {/* Inquiry Form */}
      <InquiryForm title="Business Goal Solutions" />
    </Layout>
  );
};

// Fallback business goal component for preview environments
const FallbackBusinessGoal = ({ title, description, icon, slug }: {
  title: string;
  description: string;
  icon: string;
  slug: string;
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="border border-amber-100 bg-amber-50 rounded-lg p-6 hover:border-amber-300 transition-colors duration-300">
      <div className="mb-4">
        <div className="bg-amber-100 p-3 rounded-full w-12 h-12 flex items-center justify-center text-amber-800">
          <MachineTypeIcon type={icon} />
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-700 mb-4 line-clamp-3">{description}</p>
      <Button 
        variant="outline"
        className="border-amber-500 text-amber-700 hover:bg-amber-100 hover:text-amber-800 flex items-center"
        onClick={() => navigate(`/goals/${slug}`)}
      >
        Preview
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default BusinessGoalsLanding;
