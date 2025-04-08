
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
import { CMSFeature, CMSBusinessGoal, CMSExample } from '@/types/cms';
import { ArrowDownToLine, BarChart3, Building2, RefreshCcw, Users } from 'lucide-react';
import { ReactNode } from 'react';

// Define interfaces for component props to match expected types
interface Feature {
  title: string;
  description: string;
  icon: ReactNode;
}

interface CaseStudy {
  title: string;
  description: string;
  image: string;
  slug: string;
  results: string[];
}

interface Integration {
  name: string;
  description: string;
  icon: ReactNode;
}

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

  // Convert string icon to React component
  const iconToComponent = (iconName?: string): ReactNode => {
    if (!iconName) return <BarChart3 className="h-6 w-6 text-white" />;
    
    switch (iconName) {
      case 'Building2': return <Building2 className="h-6 w-6 text-white" />;
      case 'Users': return <Users className="h-6 w-6 text-white" />;
      case 'BarChart3': return <BarChart3 className="h-6 w-6 text-white" />;
      case 'RefreshCcw': return <RefreshCcw className="h-6 w-6 text-white" />;
      case 'ArrowDownToLine': return <ArrowDownToLine className="h-6 w-6 text-white" />;
      default: return <BarChart3 className="h-6 w-6 text-white" />;
    }
  };

  // Get the appropriate description
  const description = cmsGoal?.description || (fallbackGoal?.heroDescription || '');

  // Get the appropriate image URL
  const imageUrl = cmsGoal?.image?.url || (fallbackGoal?.heroImage || '');

  // Adapt features from CMS data to match Feature interface
  const adaptedFeatures: Feature[] = cmsGoal 
    ? cmsGoal.features.map((feature: CMSFeature): Feature => ({
        title: feature.title,
        description: feature.description,
        icon: iconToComponent(feature.icon as string)
      })) 
    : (currentGoal.features as Feature[]);

  // Adapt case studies from CMS data to match CaseStudy interface
  const adaptedCaseStudies: CaseStudy[] = cmsGoal 
    ? (cmsGoal.caseStudies || []).map((study: CMSExample): CaseStudy => ({
        title: study.title,
        description: study.description,
        image: study.image.url,
        slug: study.title.toLowerCase().replace(/\s+/g, '-'),
        results: ['Successful implementation']
      }))
    : (currentGoal.caseStudies as CaseStudy[]);

  // Default integrations when using CMS data
  const defaultIntegrations: Integration[] = [
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
        icon={cmsGoal ? iconToComponent(cmsGoal.icon) : currentGoal.icon}
        image={imageUrl}
      />
      
      <BusinessGoalFeatures features={adaptedFeatures} />
      
      <BusinessGoalCaseStudies caseStudies={adaptedCaseStudies} />
      
      <BusinessGoalIntegrations 
        integrations={cmsGoal ? defaultIntegrations : (currentGoal.integrations as Integration[])} 
      />
      
      <CTASection />
    </Layout>
  );
};

export default BusinessGoalDetail;
