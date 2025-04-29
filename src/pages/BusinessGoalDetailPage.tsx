import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Check, Shield, Server, Settings, Bell, Battery, ClipboardCheck, RefreshCcw, TrendingUp, PieChart, Map, UserCheck } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useContentfulBusinessGoal } from '@/hooks/cms/useContentfulBusinessGoals';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check as CheckIcon } from 'lucide-react';
import BusinessGoalHero from '@/components/businessGoals/BusinessGoalHero';
import MachineTypeIcon from '@/components/admin/machines/MachineTypeIcon';
import BusinessGoalVideoSection from '@/components/businessGoals/BusinessGoalVideoSection';
import RecommendedMachines from '@/components/products/sections/RecommendedMachines';
import InquiryForm from '@/components/machines/contact/InquiryForm';
import ContentfulInitializer from '@/components/blog/ContentfulInitializer';
import ContentfulFallbackMessage from '@/components/common/ContentfulFallbackMessage';

const getIconComponent = (iconName: string | undefined): React.ReactNode => {
  if (!iconName) return <Star className="h-6 w-6" />;
  
  switch (iconName.toLowerCase()) {
    case 'check':
      return <Check className="h-6 w-6" />;
    case 'shield':
      return <Shield className="h-6 w-6" />;
    case 'server':
      return <Server className="h-6 w-6" />;
    case 'settings':
      return <Settings className="h-6 w-6" />;
    case 'bell':
      return <Bell className="h-6 w-6" />;
    case 'battery':
      return <Battery className="h-6 w-6" />;
    case 'clipboard-check':
      return <ClipboardCheck className="h-6 w-6" />;
    case 'refresh-ccw':
      return <RefreshCcw className="h-6 w-6" />;
    case 'trending-up':
      return <TrendingUp className="h-6 w-6" />;
    case 'pie-chart':
      return <PieChart className="h-6 w-6" />;
    case 'map':
      return <Map className="h-6 w-6" />;
    case 'user-check':
      return <UserCheck className="h-6 w-6" />;
    default:
      return <Star className="h-6 w-6" />;
  }
};

const BusinessGoalDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  
  console.log('[BusinessGoalDetailPage] Rendering with slug:', slug);
  console.log('[BusinessGoalDetailPage] Current route path:', window.location.pathname);
  
  return (
    <Layout>
      <ContentfulInitializer
        fallback={
          <div className="container mx-auto p-4">
            <ContentfulFallbackMessage
              title="Business Goal Not Available"
              message="We're having trouble loading this business goal. Please check your Contentful configuration."
              contentType="business goal"
              showRefresh={true}
              actionText="View All Business Goals"
              actionHref="/business-goals"
            />
          </div>
        }
      >
        <BusinessGoalContent slug={slug} />
      </ContentfulInitializer>
    </Layout>
  );
};

const BusinessGoalContent = ({ slug }: { slug: string | undefined }) => {
  const { data: businessGoal, isLoading, error } = useContentfulBusinessGoal(slug || '');
  
  console.log('[BusinessGoalContent] Content data for slug:', slug, {
    isLoading,
    hasError: !!error,
    errorMessage: error ? error.message : null,
    businessGoalData: businessGoal ? {
      id: businessGoal.id,
      title: businessGoal.title,
      slug: businessGoal.slug,
      hasFeatures: businessGoal.features?.length > 0,
      hasBenefits: businessGoal.benefits?.length > 0,
      hasVideo: !!businessGoal.video,
      hasRecommendedMachines: businessGoal.recommendedMachines?.length > 0
    } : null
  });
  
  if (isLoading) {
    return (
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
    );
  }
  
  if (error) {
    console.error('[BusinessGoalContent] Error loading business goal:', error);
    return (
      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto">
          <ContentfulFallbackMessage
            title="Error Loading Business Goal"
            message={error instanceof Error ? error.message : 'An unknown error occurred'}
            contentType="business goal"
            actionText="Return to Business Goals"
            actionHref="/business-goals"
            showAdmin={false}
          />
        </div>
      </div>
    );
  }
  
  if (!businessGoal) {
    console.warn('[BusinessGoalContent] No business goal data returned for slug:', slug);
    return (
      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto">
          <ContentfulFallbackMessage
            title="Business Goal Not Found"
            message={`The business goal with slug "${slug}" doesn't exist or has been removed.`}
            contentType="business goal"
            actionText="Return to Business Goals"
            actionHref="/business-goals"
            showAdmin={false}
          />
        </div>
      </div>
    );
  }
  
  console.log('[BusinessGoalContent] Successfully loaded business goal:', businessGoal.title);
  
  const icon = businessGoal?.icon ? (
    <MachineTypeIcon type={businessGoal.icon} className="text-white" />
  ) : (
    <Star className="text-white h-6 w-6" />
  );
  
  const imageUrl = businessGoal?.image?.url || "https://via.placeholder.com/1200x800?text=Business+Goal+Image";
  
  const showDebugInfo = false; // Set to true to show debug info in production
  
  return (
    <>
      <BusinessGoalHero
        title={businessGoal?.title || ''}
        description={businessGoal?.description || ''}
        icon={icon}
        image={imageUrl}
      />
      
      {showDebugInfo && (
        <section className="py-4 bg-gray-50 border-t border-b border-gray-200">
          <div className="container mx-auto">
            <details className="max-w-4xl mx-auto bg-white p-4 rounded shadow">
              <summary className="cursor-pointer font-medium text-blue-600 mb-2">
                Debug Information (Click to expand)
              </summary>
              <div className="text-xs font-mono bg-gray-100 p-4 rounded overflow-auto max-h-96">
                <h4 className="font-bold mb-2">Business Goal Data:</h4>
                <pre>{JSON.stringify(businessGoal, null, 2)}</pre>
                
                <h4 className="font-bold mt-4 mb-2">Video Status:</h4>
                <p>Has Video Object: {businessGoal.video ? 'Yes' : 'No'}</p>
                {businessGoal.video && (
                  <>
                    <p>Video ID: {businessGoal.video.id || 'Not available'}</p>
                    <p>Video URL: {businessGoal.video.url || 'Not available'}</p>
                    <p>Video Title: {businessGoal.video.title || 'Not available'}</p>
                  </>
                )}
              </div>
            </details>
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
                      <CheckIcon className="h-4 w-4" />
                    </div>
                    <p className="text-gray-800">{String(benefit)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      
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
                        {getIconComponent(typeof feature.icon === 'string' ? feature.icon : undefined)}
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
      
      {businessGoal?.video && (
        <BusinessGoalVideoSection 
          video={businessGoal.video}
          title={`See how ${businessGoal.title} works`}
          description="Watch our solution in action to understand how it can help your business"
        />
      )}
      
      {!businessGoal.video && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-center mb-4">Video Content Not Available</h3>
              <p className="text-gray-600 text-center">
                The video for this business goal is not available. This could be due to the video not being set in the content management system
                or an issue with the video asset.
              </p>
              <div className="mt-6 p-4 bg-gray-100 rounded text-sm">
                <p className="font-medium text-gray-700">Technical Information:</p>
                <p>Content ID: {businessGoal.id}</p> 
                <p>Slug: {businessGoal.slug}</p>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {businessGoal?.recommendedMachines && businessGoal.recommendedMachines.length > 0 && (
        <RecommendedMachines machines={businessGoal.recommendedMachines} />
      )}
      
      <InquiryForm title={`Ready to learn more about ${businessGoal?.title || 'achieving your business goals'}?`} />
    </>
  );
};

export default BusinessGoalDetailPage;
