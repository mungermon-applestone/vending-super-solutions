
import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import TechnologySections from '@/components/technology/TechnologySections';
import TechnologyPageHero from '@/components/technology/TechnologyPageHero';
import { useTechnologySections } from '@/hooks/useTechnologySections';
import { useContentfulConfig } from '@/hooks/useContentfulConfig';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Link } from 'react-router-dom';
import { useBreadcrumbs } from '@/context/BreadcrumbContext';
import TechnologySchemaData from '@/components/technology/TechnologySchemaData';
import SEO from '@/components/seo/SEO';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Loader2, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HERO_CONTENT_ID = "66FG7FxpIy3YkSXj2mu846";

const TechnologyPage = () => {
  const { isValid: isConfigValid, error: configError } = useContentfulConfig();
  const { technologies = [], isLoading, error, refetch } = useTechnologySections({ 
    enableToasts: true,
    debug: true, // Always enable debug mode to troubleshoot issues
    refetchInterval: isConfigValid ? false : 5000  // Retry every 5 seconds if config is invalid
  });
  const { setBreadcrumbs, getSchemaFormattedBreadcrumbs } = useBreadcrumbs();
  
  useEffect(() => {
    console.log('[TechnologyPage] Rendering with config valid:', isConfigValid);
    console.log('[TechnologyPage] Technologies data:', {
      count: technologies?.length,
      data: technologies
    });
    
    // If we have window.env, log its contentful values for debugging
    if (typeof window !== 'undefined' && window.env) {
      console.log('[TechnologyPage] Window.env contentful values:', {
        spaceId: window.env.VITE_CONTENTFUL_SPACE_ID || window.env.spaceId,
        hasDeliveryToken: !!(window.env.VITE_CONTENTFUL_DELIVERY_TOKEN || window.env.deliveryToken),
        environmentId: window.env.VITE_CONTENTFUL_ENVIRONMENT_ID || window.env.environmentId || 'master'
      });
    }
    
    setBreadcrumbs([
      { name: "Home", url: "/", position: 1 },
      { name: "Technology", url: "/technology", position: 2 }
    ]);
  }, [setBreadcrumbs, technologies, isConfigValid]);

  const showError = (error: Error | null, title: string) => (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>{error instanceof Error ? error.message : 'An unexpected error occurred'}</p>
        <div className="mt-2 p-2 bg-black/10 rounded text-sm font-mono whitespace-pre-wrap">
          {typeof window !== 'undefined' && window.env ? 
            `window.env: ${JSON.stringify({
              spaceId: window.env.VITE_CONTENTFUL_SPACE_ID || window.env.spaceId,
              hasToken: !!(window.env.VITE_CONTENTFUL_DELIVERY_TOKEN || window.env.deliveryToken),
              envId: window.env.VITE_CONTENTFUL_ENVIRONMENT_ID || window.env.environmentId || 'master'
            }, null, 2)}`
            : 'window.env not available'
          }
        </div>
      </AlertDescription>
      <div className="flex gap-2 mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={() => refetch()}
        >
          Try Again
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('vending-cms-env-variables');
              window.location.reload();
            }
          }}
        >
          Clear Cache & Reload
        </Button>
      </div>
    </Alert>
  );

  const showDebugInfo = () => (
    <Alert variant="default" className="mb-4 border-amber-300 bg-amber-50">
      <Bug className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800">Debug Information</AlertTitle>
      <AlertDescription className="text-amber-700">
        <div className="space-y-2 text-sm">
          <p><strong>Configuration Status:</strong> {isConfigValid ? 'Valid' : 'Invalid'}</p>
          {configError && <p><strong>Config Error:</strong> {configError}</p>}
          <p><strong>Technologies Loaded:</strong> {technologies?.length || 0}</p>
          <p>
            <strong>Environment:</strong> {process.env.NODE_ENV} / 
            {typeof window !== 'undefined' && window.env?.VITE_CONTENTFUL_ENVIRONMENT_ID || 'Not set'}
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );

  const allSections = React.useMemo(() => {
    if (!technologies?.length) {
      console.log('[TechnologyPage] No technologies data available to extract sections');
      return [];
    }
    
    const sections = technologies.flatMap(tech => {
      if (!tech.sections?.length) {
        console.warn(`[TechnologyPage] Technology ${tech.id} has no sections`);
        return [];
      }
      
      console.log(`[TechnologyPage] Processing ${tech.sections.length} sections for technology "${tech.title}"`);
      
      return tech.sections.map(section => ({
        ...section,
        id: section.id || `section-${Math.random()}`,
        title: section.title || '',
        summary: section.description || '',
        bulletPoints: Array.isArray(section.bulletPoints) ? section.bulletPoints : [],
        image: section.sectionImage || section.image || {
          url: '',
          alt: section.title || 'Technology section'
        },
        technology_id: tech.id,
        section_type: section.section_type || 'default',
        display_order: section.display_order || 0
      }));
    });
    
    console.log(`[TechnologyPage] Total sections extracted: ${sections.length}`);
    return sections;
  }, [technologies]);

  if (!isConfigValid) {
    console.error('[TechnologyPage] Invalid Contentful configuration:', configError);
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          {showDebugInfo()}
          {showError(configError ? new Error(configError) : new Error('Invalid configuration'), "Contentful Configuration Error")}
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[40vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading technology data...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          {showDebugInfo()}
          {showError(error as Error, "Error Loading Technology Data")}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO 
        title="Vending Machine Technology | Vending Solutions"
        description="Explore our cutting-edge vending machine technologies and innovations."
        canonicalUrl="https://yourdomain.com/technology"
      />
      <TechnologySchemaData 
        breadcrumbItems={getSchemaFormattedBreadcrumbs()}
        isListPage={true}
      />
      
      <div className="container mx-auto px-4">
        <nav aria-label="Breadcrumb" className="py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink aria-current="page">Technology</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </nav>
      </div>

      <TechnologyPageHero entryId={HERO_CONTENT_ID} />
      
      {process.env.NODE_ENV === 'development' && showDebugInfo()}
      
      {allSections.length > 0 ? (
        <TechnologySections sections={allSections} />
      ) : (
        <div className="container mx-auto px-4 py-12 text-center">
          <h3 className="text-lg font-medium mb-2">No Technology Sections Available</h3>
          <p className="text-muted-foreground mb-4">
            Technology information is currently being updated. Please check back later.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="outline" onClick={() => refetch()}>
              Refresh Data
            </Button>
            {process.env.NODE_ENV === 'development' && (
              <Button 
                variant="outline" 
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('vending-cms-env-variables');
                    window.location.reload();
                  }
                }}
              >
                Clear Cache & Reload
              </Button>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default TechnologyPage;
