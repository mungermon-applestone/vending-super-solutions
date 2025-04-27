
import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import TechnologySections from '@/components/technology/TechnologySections';
import TechnologyPageHero from '@/components/technology/TechnologyPageHero';
import { useTechnologySections } from '@/hooks/useTechnologySections';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Link } from 'react-router-dom';
import { useBreadcrumbs } from '@/context/BreadcrumbContext';
import TechnologySchemaData from '@/components/technology/TechnologySchemaData';
import SEO from '@/components/seo/SEO';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';

const HERO_CONTENT_ID = "66FG7FxpIy3YkSXj2mu846";

const TechnologyPage = () => {
  const { technologies = [], isLoading, error } = useTechnologySections();
  const { setBreadcrumbs, getSchemaFormattedBreadcrumbs } = useBreadcrumbs();
  
  useEffect(() => {
    console.log('[TechnologyPage] Technologies data loaded:', {
      count: technologies?.length,
      data: technologies
    });
    
    setBreadcrumbs([
      { name: "Home", url: "/", position: 1 },
      { name: "Technology", url: "/technology", position: 2 }
    ]);
  }, [setBreadcrumbs, technologies]);

  // Extract sections from all technologies to create a flattened array of sections
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
    console.error('[TechnologyPage] Error loading technology data:', error);
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Loading Technology Data</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : 'An unexpected error occurred while loading technology data.'}
            </AlertDescription>
          </Alert>
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
          <p className="text-muted-foreground">
            Technology information is currently being updated. Please check back later.
          </p>
        </div>
      )}
    </Layout>
  );
};

export default TechnologyPage;
