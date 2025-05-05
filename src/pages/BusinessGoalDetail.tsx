
import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { ArrowLeft, Loader2, Star, Bug, AlertTriangle } from 'lucide-react';
import { useBusinessGoal } from '@/hooks/cms/useBusinessGoal';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import BusinessGoalHero from '@/components/businessGoals/BusinessGoalHero';
import BusinessGoalFeatures from '@/components/businessGoals/BusinessGoalFeatures';
import BusinessGoalKeyBenefits from '@/components/businessGoals/BusinessGoalKeyBenefits';
import BusinessGoalInquiry from '@/components/businessGoals/BusinessGoalInquiry';
import ContentfulErrorBoundary from '@/components/common/ContentfulErrorBoundary';
import ContentfulFallbackMessage from '@/components/common/ContentfulFallbackMessage';
import { redirectToCanonicalBusinessGoalIfNeeded } from '@/services/cms/utils/routeRedirector';
import { normalizeSlug, getCanonicalSlug, resolveSlug, getHardcodedSlug } from '@/services/cms/utils/slugMatching';
import BusinessGoalSEO from '@/components/seo/BusinessGoalSEO';
import BusinessGoalsLoader from '@/components/businessGoals/BusinessGoalsLoader';

const BusinessGoalDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const [showDebug, setShowDebug] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [forceSlug, setForceSlug] = useState<string | null>(null);
  
  // Perform redirection if needed and scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (slug) {
      // Special handling for expand-footprint to ensure it works
      if (slug === 'expand-footprint' || (slug.includes('expand') && slug.includes('footprint'))) {
        console.log(`[BusinessGoalDetail] Special handling for expand-footprint slug`);
        setForceSlug('expand-footprint');
        return;
      }
      
      // Check for hardcoded slug before redirection
      const hardcodedSlug = getHardcodedSlug(slug);
      if (hardcodedSlug && hardcodedSlug !== slug) {
        console.log(`[BusinessGoalDetail] Found hardcoded slug match: ${hardcodedSlug}`);
        // Redirect to hardcoded slug if needed
        window.location.href = `/business-goals/${hardcodedSlug}`;
        return;
      }
      
      redirectToCanonicalBusinessGoalIfNeeded(slug);
    }
  }, [slug]);
  
  const toggleDebug = () => {
    setShowDebug(!showDebug);
    
    // When enabling debug, fetch additional diagnostic information
    if (!showDebug) {
      const diagnostics = {
        slug,
        forceSlug,
        normalizedSlug: slug ? normalizeSlug(slug) : '',
        canonicalSlug: slug ? getCanonicalSlug(normalizeSlug(slug)) : '',
        resolvedSlug: slug ? resolveSlug(slug) : '',
        hardcodedSlug: slug ? getHardcodedSlug(slug) : null,
        path: location.pathname,
        search: location.search,
        hostname: window.location.hostname
      };
      
      console.log("[BusinessGoalDetail] Debug diagnostics:", diagnostics);
      setErrorDetails(JSON.stringify(diagnostics, null, 2));
    }
  };
  
  console.log("[BusinessGoalDetail] Rendering with slug:", slug);
  console.log("[BusinessGoalDetail] Current path:", location.pathname);
  
  if (!slug) {
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
                  <p>Original slug: <code className="bg-gray-100 px-1">{slug}</code></p>
                  <p>Force slug: <code className="bg-gray-100 px-1">{forceSlug || 'none'}</code></p>
                  <p>Normalized slug: <code className="bg-gray-100 px-1">{normalizeSlug(slug)}</code></p>
                  <p>Canonical slug: <code className="bg-gray-100 px-1">{getCanonicalSlug(normalizeSlug(slug))}</code></p>
                  <p>Resolved slug: <code className="bg-gray-100 px-1">{resolveSlug(slug)}</code></p>
                  <p>Hardcoded slug: <code className="bg-gray-100 px-1">{getHardcodedSlug(slug) || 'none'}</code></p>
                  <p>Current path: <code className="bg-gray-100 px-1">{location.pathname}</code></p>
                  
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
        
        <BusinessGoalContent slug={forceSlug || slug} showDebug={showDebug} />
      </ContentfulErrorBoundary>
    </Layout>
  );
};

const BusinessGoalContent = ({ slug, showDebug = false }: { slug: string, showDebug?: boolean }) => {
  const { data: businessGoal, isLoading, error, refetch } = useBusinessGoal(slug);
  const [retryCount, setRetryCount] = useState(0);

  // Special handling for expand-footprint when it fails to load
  useEffect(() => {
    if (error && slug === 'expand-footprint' && retryCount < 2) {
      console.log(`[BusinessGoalContent] Special handling for expand-footprint (retry ${retryCount + 1})`);
      
      // Add a delay before retrying
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        refetch();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [error, slug, retryCount, refetch]);

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
              onAction={() => refetch()}
              showAdmin={false}
            />
            
            {/* Special case for expand-footprint */}
            {slug === 'expand-footprint' && (
              <Alert className="mt-6 bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertTitle className="text-amber-700">Known Issue with Expand Footprint</AlertTitle>
                <AlertDescription className="text-amber-600">
                  We're aware of an issue loading the "Expand Footprint" business goal. Our team is working to fix this.
                  In the meantime, you can view other business goals or check our documentation for more information.
                </AlertDescription>
                <div className="mt-4">
                  <Button 
                    onClick={() => refetch()} 
                    variant="outline" 
                    size="sm" 
                    className="bg-white border-amber-300 text-amber-800 hover:bg-amber-50"
                  >
                    Try Loading Again
                  </Button>
                </div>
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
                  onClick={() => refetch()} 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                >
                  Retry Query
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
