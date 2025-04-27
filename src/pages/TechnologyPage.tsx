
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

const HERO_CONTENT_ID = "4b40Npa9Hgp8jO0jDX98F6";

const TechnologyPage = () => {
  const { technologies, isLoading, error } = useTechnologySections();
  const { setBreadcrumbs, getSchemaFormattedBreadcrumbs } = useBreadcrumbs();
  
  useEffect(() => {
    setBreadcrumbs([
      { name: "Home", url: "/", position: 1 },
      { name: "Technology", url: "/technology", position: 2 }
    ]);
  }, [setBreadcrumbs]);

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
      <TechnologySections sections={technologies} />
    </Layout>
  );
};

export default TechnologyPage;
