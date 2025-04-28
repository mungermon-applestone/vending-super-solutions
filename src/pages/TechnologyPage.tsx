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
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HERO_CONTENT_ID = "66FG7FxpIy3YkSXj2mu846";

const TechnologyPage = () => {
  const { isValid: isConfigValid, error: configError } = useContentfulConfig();
  const { technologies = [], isLoading, error, refetch } = useTechnologySections({ 
    enableToasts: true,
    refetchInterval: isConfigValid ? false : 5000  // Retry every 5 seconds if config is invalid
  });
  const { setBreadcrumbs, getSchemaFormattedBreadcrumbs } = useBreadcrumbs();
  
  useEffect(() => {
    console.log('[TechnologyPage] Rendering with config valid:', isConfigValid);
    console.log('[TechnologyPage] Technologies data:', {
      count: technologies?.length,
      data: technologies
    });
    
    setBreadcrumbs([
      { name: "Home", url: "/", position: 1 },
      { name: "Technology", url: "/technology", position: 2 }
    ]);
  }, [setBreadcrumbs, technologies, isConfigValid]);

  const showError = (error: Error | null, title: string) => (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {error instanceof Error ? error.message : 'An unexpected error occurred'}
      </AlertDescription>
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-2"
        onClick={() => refetch()}
      >
        Try Again
      </Button>
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
      
      {allSections.length > 0 ? (
        <TechnologySections sections={allSections} />
      ) : (
        <div className="container mx-auto px-4 py-12 text-center">
          <h3 className="text-lg font-medium mb-2">No Technology Sections Available</h3>
          <p className="text-muted-foreground mb-4">
            Technology information is currently being updated. Please check back later.
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Refresh Data
          </Button>
        </div>
      )}
    </Layout>
  );
};

export default TechnologyPage;
