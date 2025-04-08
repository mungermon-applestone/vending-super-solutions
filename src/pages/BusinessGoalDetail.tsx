
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
import { CMSFeature, CMSBusinessGoal } from '@/types/cms';
import { ArrowDownToLine, BarChart3, Building2, RefreshCcw, Users } from 'lucide-react';

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

  // Adapt the CMS data to match the component requirements
  const getIcon = () => {
    if (cmsGoal) {
      // If we have CMS data, use its icon or provide a default
      switch (cmsGoal.icon) {
        case 'Building2': return <Building2 className="h-6 w-6 text-white" />;
        case 'Users': return <Users className="h-6 w-6 text-white" />;
        case 'BarChart3': return <BarChart3 className="h-6 w-6 text-white" />;
        case 'RefreshCcw': return <RefreshCcw className="h-6 w-6 text-white" />;
        case 'ArrowDownToLine': return <ArrowDownToLine className="h-6 w-6 text-white" />;
        default: return <BarChart3 className="h-6 w-6 text-white" />;
      }
    } else {
      // Use the fallback goal's icon
      return currentGoal.icon;
    }
  };

  // Get the appropriate description
  const description = cmsGoal?.description || (fallbackGoal?.heroDescription || '');

  // Get the appropriate image URL
  const imageUrl = cmsGoal?.image?.url || (fallbackGoal?.heroImage || '');

  // Adapt features for the BusinessGoalFeatures component
  const adaptedFeatures = cmsGoal ? cmsGoal.features.map((feature: CMSFeature) => ({
    title: feature.title,
    description: feature.description,
    icon: feature.icon ? getIcon() : <BarChart3 className="h-6 w-6 text-white" /> // Provide default icon if none exists
  })) : currentGoal.features;

  // Adapt case studies or provide empty array if none exist
  const adaptedCaseStudies = cmsGoal ? (cmsGoal.caseStudies || []).map(study => ({
    title: study.title,
    description: study.description,
    image: study.image.url,
    slug: study.title.toLowerCase().replace(/\s+/g, '-'), // Generate a slug from the title
    results: ['Successful implementation'] // Default result
  })) : currentGoal.caseStudies;

  // Default integrations if none provided
  const defaultIntegrations = [
    {
      name: "Analytics",
      description: "Track performance metrics",
      icon: <BarChart3 className="h-6 w-6 text-vending-blue" />
    },
    {
      name: "Customer Data",
      description: "Understand your users",
      icon: <Users className="h-6 w-6 text-vending-blue" />
    }
  ];
  
  return (
    <Layout>
      <BusinessGoalHero 
        title={currentGoal.title}
        description={description}
        icon={getIcon()}
        image={imageUrl}
      />
      
      <BusinessGoalFeatures features={adaptedFeatures} />
      
      <BusinessGoalCaseStudies caseStudies={adaptedCaseStudies} />
      
      <BusinessGoalIntegrations integrations={cmsGoal ? defaultIntegrations : currentGoal.integrations} />
      
      <CTASection />
    </Layout>
  );
};

export default BusinessGoalDetail;
