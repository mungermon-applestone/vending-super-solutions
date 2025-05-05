import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { ArrowLeft, Loader2, Star, Bug, AlertTriangle, RefreshCw } from 'lucide-react';
import { useBusinessGoal } from '@/hooks/cms/useBusinessGoal';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import BusinessGoalHero from '@/components/businessGoals/BusinessGoalHero';
import BusinessGoalFeatures from '@/components/businessGoals/BusinessGoalFeatures';
import BusinessGoalKeyBenefits from '@/components/businessGoals/BusinessGoalKeyBenefits';
import BusinessGoalInquiry from '@/components/businessGoals/BusinessGoalInquiry';
import ContentfulErrorBoundary from '@/components/common/ContentfulErrorBoundary';
import ContentfulFallbackMessage from '@/components/common/ContentfulFallbackMessage';
import { normalizeSlug, getCanonicalSlug, resolveSlug, getHardcodedSlug } from '@/services/cms/utils/slugMatching';
import BusinessGoalSEO from '@/components/seo/BusinessGoalSEO';
import BusinessGoalsLoader from '@/components/businessGoals/BusinessGoalsLoader';
import { CONTENTFUL_CONFIG, isContentfulConfigured } from '@/config/cms';

interface BusinessGoalDetailProps {
  forcedSlug?: string;
}

const BusinessGoalDetail = ({ forcedSlug }: BusinessGoalDetailProps) => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const [showDebug, setShowDebug] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [effectiveSlug, setEffectiveSlug] = useState<string>('');
  const [contentfulConfig, setContentfulConfig] = useState<any>(null);
  
  // Determine the effective slug to use
  useEffect(() => {
    // Priority order:
    // 1. forcedSlug prop (for special cases like expand-footprint)
    // 2. URL parameter slug
    // 3. Extract from path
    
    if (forcedSlug) {
      console.log(`[BusinessGoalDetail] Using forced slug: "${forcedSlug}"`);
      setEffectiveSlug(forcedSlug);
      return;
    }
    
    if (slug) {
      console.log(`[BusinessGoalDetail] Using URL param slug: "${slug}"`);
      setEffectiveSlug(slug);
      return;
    }
    
    // Last resort: extract from path
    const pathSegments = location.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    if (lastSegment && lastSegment !== 'business-goals') {
      console.log(`[BusinessGoalDetail] Extracted slug from path: "${lastSegment}"`);
      setEffectiveSlug(lastSegment);
    } else {
      console.warn('[BusinessGoalDetail] Could not determine a slug from any source');
      setEffectiveSlug('');
    }
  }, [slug, forcedSlug, location.pathname]);
  
  // Get Contentful config information
  useEffect(() => {
    const checkContentfulConfig = async () => {
      try {
        setContentfulConfig({
          spaceId: CONTENTFUL_CONFIG.SPACE_ID ? '✓ Set' : '✗ Missing',
          accessToken: CONTENTFUL_CONFIG.DELIVERY_TOKEN ? '✓ Set' : '✗ Missing',
          environment: CONTENTFUL_CONFIG.ENVIRONMENT_ID || 'master'
        });
      } catch (err) {
        console.error('Error checking Contentful config:', err);
        setContentfulConfig({ error: 'Failed to load configuration' });
      }
    };
    
    checkContentfulConfig();
  }, []);
  
  const toggleDebug = () => {
    setShowDebug(!showDebug);
    
    // When enabling debug, fetch additional diagnostic information
    if (!showDebug) {
      const diagnostics = {
        urlSlug: slug,
        forcedSlug,
        effectiveSlug,
        normalizedSlug: effectiveSlug ? normalizeSlug(effectiveSlug) : '',
        canonicalSlug: effectiveSlug ? getCanonicalSlug(normalizeSlug(effectiveSlug)) : '',
        resolvedSlug: effectiveSlug ? resolveSlug(effectiveSlug) : '',
        hardcodedSlug: effectiveSlug ? getHardcodedSlug(effectiveSlug) : null,
        path: location.pathname,
        search: location.search,
        hostname: window.location.hostname,
        contentfulConfig
      };
      
      console.log("[BusinessGoalDetail] Debug diagnostics:", diagnostics);
      setErrorDetails(JSON.stringify(diagnostics, null, 2));
    }
  };
  
  console.log("[BusinessGoalDetail] Current state:", {
    urlSlug: slug,
    forcedSlug,
    effectiveSlug,
    path: location.pathname
  });
  
  // Show error if we couldn't determine a slug
  if (!effectiveSlug) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>No slug parameter found in URL</AlertDescription>
          </Alert>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/business-goals">View All Business Goals</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <ContentfulErrorBoundary contentType="Business Goal Details">
        <div className="bg-white p-2 border-b">
          <div className="container flex items-center justify-between">
            <Link to="/business-goals" className="inline-flex items-center text-vending-blue-dark hover:text-vending-blue py-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Business Goals
            </Link>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleDebug}
              className="text-xs"
            >
              <Bug className="h-3 w-3 mr-1" />
              {showDebug ? 'Hide' : 'Show'} Debug
            </Button>
          </div>
        </div>
        
        {showDebug && (
          <div className="bg-gray-100 border-b border-gray-200 p-3">
            <div className="container">
              <details open className="text-xs font-mono">
                <summary className="cursor-pointer font-medium">Slug Information</summary>
                <div className="p-2 bg-white rounded mt-1">
                  <p>URL slug: <code className="bg-gray-100 px-1">{slug || 'none from params'}</code></p>
                  <p>Forced slug: <code className="bg-gray-100 px-1">{forcedSlug || 'none'}</code></p>
                  <p>Effective slug: <code className="bg-gray-100 px-1">{effectiveSlug}</code></p>
                  <p>Normalized slug: <code className="bg-gray-100 px-1">{normalizeSlug(effectiveSlug)}</code></p>
                  <p>Canonical slug: <code className="bg-gray-100 px-1">{getCanonicalSlug(normalizeSlug(effectiveSlug))}</code></p>
                  <p>Resolved slug: <code className="bg-gray-100 px-1">{resolveSlug(effectiveSlug)}</code></p>
                  <p>Hardcoded slug: <code className="bg-gray-100 px-1">{getHardcodedSlug(effectiveSlug) || 'none'}</code></p>
                  <p>Current path: <code className="bg-gray-100 px-1">{location.pathname}</code></p>
                  
                  <div className="mt-2 border-t pt-2">
                    <p className="font-medium">Contentful Configuration:</p>
                    {contentfulConfig && (
                      <ul>
                        {Object.entries(contentfulConfig).map(([key, value]) => (
                          <li key={key}>{key}: {String(value)}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  {errorDetails && (
                    <>
                      <p className="mt-3 font-semibold">Additional Diagnostics:</p>
                      <pre className="text-xs overflow-auto p-2 bg-gray-100 border border-gray-200 rounded mt-1 max-h-40">
                        {errorDetails}
                      </pre>
                    </>
                  )}
                </div>
              </details>
            </div>
          </div>
        )}
        
        <BusinessGoalContent slug={effectiveSlug} showDebug={showDebug} />
      </ContentfulErrorBoundary>
    </Layout>
  );
};

const BusinessGoalContent = ({ slug, showDebug = false }: { slug: string, showDebug?: boolean }) => {
  const { data: businessGoal, isLoading, error, refetch } = useBusinessGoal(slug);
  const [retryCount, setRetryCount] = useState(0);
  const [isRefetching, setIsRefetching] = useState(false);

  // Handle retrying with improved feedback
  const handleRetry = async () => {
    setIsRefetching(true);
    setRetryCount(prev => prev + 1);
    
    try {
      // Force refresh the contentful client before refetching
      const { refreshContentfulClient } = await import('@/services/cms/utils/contentfulClient');
      await refreshContentfulClient();
      
      // Wait a moment to ensure client is refreshed
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await refetch();
    } catch (err) {
      console.error('Error during retry:', err);
    } finally {
      setIsRefetching(false);
    }
  };

  // Add SEO component for business goal
  return (
    <>
      {businessGoal && <BusinessGoalSEO businessGoal={businessGoal} />}
      
      {isLoading ? (
        <BusinessGoalsLoader />
      ) : error ? (
        <div className="container py-12">
          <div className="max-w-3xl mx-auto">
            <ContentfulFallbackMessage
              title="Error Loading Business Goal"
              message={error instanceof Error ? error.message : 'Failed to load business goal details'}
              contentType="businessGoal"
              actionText="Retry Loading"
              actionHref="#"
              onAction={handleRetry}
              showAdmin={false}
            />
            
            {/* Add manual content fetch button */}
            <div className="mt-6 flex justify-center">
              <Button 
                onClick={handleRetry} 
                disabled={isRefetching}
                className="flex items-center"
              >
                {isRefetching ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Force Refresh Content ({retryCount})
                  </>
                )}
              </Button>
            </div>
            
            {/* Special case debugging for expand-footprint */}
            {slug === 'expand-footprint' && showDebug && (
              <Alert className="mt-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Debugging Expand Footprint</AlertTitle>
                <AlertDescription>
                  <p className="mb-2">Special handling is enabled for this business goal.</p>
                  <p>Error Details:</p>
                  <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-auto max-h-40">
                    {error instanceof Error ? error.stack : JSON.stringify(error, null, 2)}
                  </pre>
                </AlertDescription>
              </Alert>
            )}
            
            {showDebug && (
              <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-md">
                <h3 className="text-sm font-semibold text-red-800 mb-2">Debug Information</h3>
                <pre className="text-xs overflow-auto p-2 bg-white border border-red-100 rounded">
                  {error instanceof Error ? error.stack : JSON.stringify(error, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      ) : !businessGoal ? (
        <div className="container py-12">
          <div className="max-w-3xl mx-auto">
            <ContentfulFallbackMessage
              title="Business Goal Not Found"
              message={`We couldn't find the business goal "${slug}" in our database.`}
              contentType="businessGoal"
              actionText="Browse Business Goals"
              actionHref="/business-goals"
              showAdmin={false}
            />
            
            {/* Add manual content fetch button */}
            <div className="mt-6 flex justify-center">
              <Button 
                onClick={handleRetry} 
                disabled={isRefetching}
                className="flex items-center"
              >
                {isRefetching ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Force Refresh Content ({retryCount})
                  </>
                )}
              </Button>
            </div>
            
            {showDebug && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-100 rounded-md">
                <h3 className="text-sm font-semibold text-yellow-800 mb-2">Debug Information</h3>
                <p className="text-xs mb-2">No business goal found for the following slug information:</p>
                <pre className="text-xs overflow-auto p-2 bg-white border border-yellow-100 rounded">
                  {JSON.stringify({
                    slug,
                    normalized: normalizeSlug(slug),
                    canonical: getCanonicalSlug(normalizeSlug(slug)),
                    resolved: resolveSlug(slug),
                    hardcoded: getHardcodedSlug(slug)
                  }, null, 2)}
                </pre>
                <Button 
                  onClick={handleRetry} 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  disabled={isRefetching}
                >
                  {isRefetching ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Retry Query
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {showDebug && businessGoal && (
            <div className="bg-green-50 border-b border-green-100 p-3">
              <div className="container">
                <details className="text-xs font-mono">
                  <summary className="cursor-pointer font-medium text-green-800">Business Goal Data Loaded Successfully</summary>
                  <div className="p-2 bg-white rounded mt-1 overflow-auto max-h-60">
                    <pre>{JSON.stringify(businessGoal, null, 2)}</pre>
                  </div>
                </details>
              </div>
            </div>
          )}
          
          <BusinessGoalHero
            title={businessGoal.title}
            description={businessGoal.description}
            image={businessGoal.image?.url || '/placeholder.svg'}
            icon={businessGoal.icon ? <span className="text-white">{businessGoal.icon}</span> : <Star className="h-6 w-6 text-white" />}
          />

          {businessGoal.benefits && businessGoal.benefits.length > 0 && (
            <BusinessGoalKeyBenefits 
              benefits={businessGoal.benefits}
              title={`Key Benefits of ${businessGoal.title}`}
            />
          )}

          {businessGoal.features && businessGoal.features.length > 0 && (
            <BusinessGoalFeatures 
              features={businessGoal.features.map(feature => ({
                ...feature,
                icon: feature.icon || <Star className="h-6 w-6" />
              }))} 
            />
          )}

          <BusinessGoalInquiry title={`Ready to learn more about ${businessGoal.title}?`} />
        </>
      )}
    </>
  );
};

export default BusinessGoalDetail;
