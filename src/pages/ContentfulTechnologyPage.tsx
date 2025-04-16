
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

const ContentfulTechnologyPage: React.FC = () => {
  const { data: technologies, isLoading, error } = useContentfulTechnology();
  const [connectionStatus, setConnectionStatus] = React.useState<{
    checked: boolean;
    isConnected: boolean;
    message: string;
  }>({
    checked: false,
    isConnected: true,
    message: ''
  });
  
  // Use the first technology (main technology page)
  const technology = technologies && technologies.length > 0 ? technologies[0] : null;
  
  // Function to test the Contentful connection if an error occurs
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
    } catch (error) {
      setConnectionStatus({
        checked: true,
        isConnected: false,
        message: error instanceof Error ? error.message : 'Unknown error checking connection'
      });
    }
  }, []);

  // Check connection if we have an error
  React.useEffect(() => {
    if (error && !connectionStatus.checked) {
      checkConnection();
    }
  }, [error, connectionStatus.checked, checkConnection]);

  // Check if Contentful config is set up properly
  const configCheck = React.useMemo(() => checkContentfulConfig(), []);
  
  return (
    <Layout>
      <ContentfulErrorBoundary contentType="Technology Page">
        {/* If environment variables are missing */}
        {!configCheck.isConfigured && (
          <div className="py-8 px-4">
            <ContentfulFallbackMessage
              title="Contentful Configuration Missing"
              message={`Missing environment variables: ${configCheck.missingValues.join(', ')}`}
              contentType="Technology"
              actionText="View Documentation"
              actionHref="https://docs.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk"
            />
          </div>
        )}
        
        {/* If data is loading, show skeleton */}
        {configCheck.isConfigured && isLoading && (
          <>
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
            </div>
            
            {/* Skeleton for sections */}
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
          </>
        )}
        
        {/* If there was an error loading the data */}
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
                  <Button onClick={() => window.location.reload()} variant="outline">
                    Retry Loading
                  </Button>
                  
                  {!connectionStatus.checked && (
                    <Button onClick={checkConnection} variant="secondary">
                      Check Contentful Connection
                    </Button>
                  )}
                  
                  {!connectionStatus.isConnected && (
                    <Button 
                      variant="default"
                      onClick={() => window.open('/admin/contentful-settings', '_self')}
                    >
                      Check Contentful Settings
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* If no technology data was found */}
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
        
        {/* If technology data was found */}
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
        
        {/* Contact Form */}
        <InquiryForm title="Technology Solutions" />
      </ContentfulErrorBoundary>
    </Layout>
  );
};

export default ContentfulTechnologyPage;
