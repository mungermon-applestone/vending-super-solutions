
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

// Update hero content ID to use the correct technology hero
const HERO_CONTENT_ID = "66FG7FxpIy3YkSXj2mu846";

const TechnologyPage = () => {
  const { technologies, isLoading, error } = useTechnologySections();
  const { setBreadcrumbs, getSchemaFormattedBreadcrumbs } = useBreadcrumbs();
  
  useEffect(() => {
    console.log('[TechnologyPage] Technologies data:', technologies);
    setBreadcrumbs([
      { name: "Home", url: "/", position: 1 },
      { name: "Technology", url: "/technology", position: 2 }
    ]);
  }, [setBreadcrumbs, technologies]);

  // Add error handling
  if (error) {
    console.error('[TechnologyPage] Error loading technology data:', error);
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <p className="text-red-600">Error loading technology data. Please try again later.</p>
        </div>
      </Layout>
    );
  }

  // Extract sections from all technologies to create a flattened array of sections
  const allSections = technologies?.flatMap(tech => {
    if (!tech.sections) {
      console.warn(`[TechnologyPage] Technology ${tech.id} has no sections`);
      return [];
    }
    return tech.sections.map(section => ({
      ...section,
      id: section.id || `section-${Math.random()}`,
      title: section.title || '',
      summary: section.description || '',
      bulletPoints: Array.isArray(section.bulletPoints) ? section.bulletPoints : [],
      image: section.sectionImage?.url || section.image?.url || '',
    }));
  }) || [];

  console.log('[TechnologyPage] Processed sections:', allSections);

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
      
      {isLoading ? (
        <div className="container mx-auto px-4 py-8">
          <p>Loading technology sections...</p>
        </div>
      ) : (
        <TechnologySections sections={allSections} />
      )}
    </Layout>
  );
};

export default TechnologyPage;
