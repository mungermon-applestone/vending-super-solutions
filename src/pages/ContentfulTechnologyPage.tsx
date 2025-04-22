
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useContentfulTechnology } from '@/hooks/cms/useContentfulTechnology';
import TechnologyHero from '@/components/technology/TechnologyHero';
import TechnologySections from '@/components/technology/TechnologySections';
import { Skeleton } from '@/components/ui/skeleton';
import PageHero from '@/components/common/PageHero';
import InquiryForm from '@/components/machines/contact/InquiryForm';
import ContentfulErrorBoundary from '@/components/common/ContentfulErrorBoundary';
import ContentfulFallbackMessage from '@/components/common/ContentfulFallbackMessage';
import { testContentfulConnection, checkContentfulConfig } from '@/utils/contentfulConnectionTest';
import { Button } from '@/components/ui/button';
import { useTestimonialSection } from '@/hooks/cms/useTestimonialSection';
import TestimonialsSection from '@/components/testimonials/TestimonialsSection';

const ContentfulTechnologyPage: React.FC = () => {
  const { data: technologies, isLoading, error, refetch } = useContentfulTechnology();
  const { data: testimonialSection } = useTestimonialSection('technology');
  const [connectionStatus, setConnectionStatus] = React.useState<{
    checked: boolean;
    isConnected: boolean;
    message: string;
  }>({
    checked: false,
    isConnected: true,
    message: ''
  });
  
  const technology = technologies && technologies.length > 0 ? technologies[0] : null;
  
  const checkConnection = React.useCallback(async () => {
    setConnectionStatus({
      checked: true,
      isConnected: false,
      message: 'Checking connection...'
    });
    
    try {
      const { success, message } = await testContentfulConnection();
      
      setConnectionStatus({
        checked: true,
        isConnected: success,
        message: message
      });
      
      if (success) {
        refetch();
      }
    } catch (error) {
      setConnectionStatus({
        checked: true,
        isConnected: false,
        message: error instanceof Error ? error.message : 'Unknown error checking connection'
      });
    }
  }, [refetch]);

  React.useEffect(() => {
    if (error && !connectionStatus.checked) {
      checkConnection();
    }
  }, [error, connectionStatus.checked, checkConnection]);

  const configCheck = React.useMemo(() => checkContentfulConfig(), []);
  
  return (
    <Layout>
      <ContentfulErrorBoundary contentType="Technology Page">
        {!configCheck.isConfigured && (
          <div className="py-8 px-4">
            <ContentfulFallbackMessage
              title="Contentful Configuration Missing"
              message={`Missing environment variables: ${configCheck.missingValues.join(', ')}`}
              contentType="Technology"
              actionText="Set Environment Variables"
              actionHref="#"
            />
          </div>
        )}
        
        {configCheck.isConfigured && isLoading && (
          <div className="py-16 bg-slate-50">
            <div className="container">
              <div className="max-w-3xl mx-auto text-center">
                <Skeleton className="h-12 w-2/3 mx-auto mb-4" />
                <Skeleton className="h-6 w-full mx-auto mb-2" />
                <Skeleton className="h-6 w-4/5 mx-auto mb-8" />
                <div className="flex justify-center gap-4">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-40" />
                </div>
              </div>
            </div>
            
            {[1, 2].map((i) => (
              <div key={i} className={`py-16 ${i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
                <div className="container">
                  <div className="max-w-3xl mx-auto text-center mb-12">
                    <Skeleton className="h-6 w-20 mx-auto mb-4" />
                    <Skeleton className="h-10 w-2/3 mx-auto mb-4" />
                    <Skeleton className="h-6 w-full mx-auto" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {configCheck.isConfigured && error && !isLoading && (
          <div className="py-16">
            <div className="container max-w-4xl mx-auto px-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Technology Data</h1>
                <p className="mb-6 text-red-700">
                  {error instanceof Error ? error.message : 'An unknown error occurred while fetching technology data.'}
                </p>
                
                {connectionStatus.checked && (
                  <div className="mb-6 p-4 bg-white rounded border border-red-100">
                    <h3 className="font-semibold mb-2">Connection Status</h3>
                    <p className={connectionStatus.isConnected ? 'text-green-600' : 'text-red-600'}>
                      {connectionStatus.message}
                    </p>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => refetch()} variant="outline">
                    Retry Loading
                  </Button>
                  
                  {!connectionStatus.checked && (
                    <Button onClick={checkConnection} variant="secondary">
                      Check Contentful Connection
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {configCheck.isConfigured && !isLoading && !error && !technology && (
          <>
            <PageHero
              pageKey="technology"
              fallbackTitle="Our Technology Platform"
              fallbackSubtitle="Powerful, reliable, and secure technology solutions designed specifically for the vending industry"
              fallbackImage="https://images.unsplash.com/photo-1558494949-ef010cbdcc31"
              fallbackImageAlt="Technology Platform"
              fallbackPrimaryButtonText="Request a Demo"
              fallbackPrimaryButtonUrl="/contact"
              fallbackSecondaryButtonText="View Detailed Layout"
              fallbackSecondaryButtonUrl="/technology/detailed"
            />
            
            <div className="py-16">
              <div className="container">
                <ContentfulFallbackMessage
                  title="Technology Information Coming Soon"
                  message="We're currently updating our technology information. Please check back later for detailed information about our platform capabilities."
                  contentType="Technology"
                  actionText={window.location.hostname.includes('lovable') ? "Go to Content Management" : undefined}
                  actionHref={window.location.hostname.includes('lovable') ? "/admin/content-management" : undefined}
                />
              </div>
            </div>
          </>
        )}
        
        {configCheck.isConfigured && !isLoading && !error && technology && (
          <>
            <TechnologyHero technology={technology} />
            
            {technology.sections && technology.sections.length > 0 ? (
              <TechnologySections sections={technology.sections} />
            ) : (
              <div className="py-16">
                <div className="container">
                  <ContentfulFallbackMessage
                    title="Technology Sections Coming Soon"
                    message="We're currently updating our technology information. Please check back later for detailed sections about our platform capabilities."
                    contentType="Technology Sections"
                    showRefresh={false}
                  />
                </div>
              </div>
            )}
          </>
        )}
        
        {testimonialSection && <TestimonialsSection data={testimonialSection} />}
        
        <InquiryForm title="Ready to transform your vending operations?" />
      </ContentfulErrorBoundary>
    </Layout>
  );
};

export default ContentfulTechnologyPage;
