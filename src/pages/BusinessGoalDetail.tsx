
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import BusinessGoalHero from '@/components/businessGoals/BusinessGoalHero';
import BusinessGoalFeatures from '@/components/businessGoals/BusinessGoalFeatures';
import BusinessGoalCaseStudies from '@/components/businessGoals/BusinessGoalCaseStudies';
import BusinessGoalIntegrations from '@/components/businessGoals/BusinessGoalIntegrations';
import CTASection from '@/components/common/CTASection';
import { businessGoalsData } from '@/data/businessGoalsData';
import { useBusinessGoal } from '@/hooks/useCMSData';
import { Skeleton } from "@/components/ui/skeleton";

const BusinessGoalDetail = () => {
  const { goalSlug } = useParams<{ goalSlug: string }>();
  
  // Fetch business goal data from the database
  const { data: cmsGoal, isLoading, error } = useBusinessGoal(goalSlug);
  
  // Fallback to static data if database fetch fails or is loading
  const fallbackGoal = businessGoalsData.find(goal => goal.slug === goalSlug);
  
  // Use CMS data if available, otherwise use fallback data
  const currentGoal = cmsGoal || fallbackGoal || businessGoalsData[0];
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container-wide py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <Skeleton className="h-12 w-3/4 mb-6" />
              <Skeleton className="h-20 w-full mb-4" />
              <div className="flex gap-4 mt-8">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-48" />
              </div>
            </div>
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
          <div className="mt-16">
            <Skeleton className="h-10 w-64 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    console.error("Error loading business goal:", error);
  }

  // Adapt the CMS goal data structure to match what the components expect
  const heroImage = cmsGoal?.image?.url || currentGoal.heroImage;
  
  return (
    <Layout>
      <BusinessGoalHero 
        title={currentGoal.title}
        description={currentGoal.description || currentGoal.heroDescription}
        icon={currentGoal.icon}
        image={heroImage}
      />
      
      <BusinessGoalFeatures features={currentGoal.features} />
      
      <BusinessGoalCaseStudies caseStudies={currentGoal.caseStudies} />
      
      <BusinessGoalIntegrations integrations={currentGoal.integrations} />
      
      <CTASection />
    </Layout>
  );
};

export default BusinessGoalDetail;
