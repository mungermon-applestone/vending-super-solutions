
import React from 'react';
import Layout from '@/components/layout/Layout';
import InquiryForm from '@/components/machines/contact/InquiryForm';
import TechnologyHeroSimple from '@/components/technology/TechnologyHeroSimple';
import TechnologySections from '@/components/technology/TechnologySections';
import { useTechnologySections } from '@/hooks/useTechnologySections';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';
import type { CMSTechnologySection } from '@/types/cms';

const SimpleTechnologyPage = () => {
  const { technologies = [], isLoading, error } = useTechnologySections({
    enableToasts: true
  });

  // Extract all sections from technologies
  const allSections: CMSTechnologySection[] = React.useMemo(() => {
    console.log('[SimpleTechnologyPage] Processing technologies:', {
      count: technologies?.length || 0,
      data: technologies
    });
    
    if (!technologies || technologies.length === 0) return [];
    
    return technologies.flatMap(tech => {
      if (!tech.sections) {
        console.warn(`[SimpleTechnologyPage] No sections found for technology ${tech.title}`);
        return [];
      }
      
      console.log(`[SimpleTechnologyPage] Found ${tech.sections.length} sections for ${tech.title}`);
      return tech.sections;
    });
  }, [technologies]);

  return (
    <Layout>
      {/* Hero Section */}
      <TechnologyHeroSimple 
        title="Our Technology Platform"
        description="Powerful, reliable, and secure technology solutions designed specifically for the vending industry"
        imageUrl="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789"
        imageAlt="Vending Technology Platform"
      />

      {/* Loading State */}
      {isLoading && (
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <div className="space-y-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col md:flex-row gap-8">
                <Skeleton className="h-64 w-full md:w-1/2" />
                <div className="w-full md:w-1/2 space-y-4">
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-24 w-full" />
                  <div className="grid grid-cols-1 gap-4">
                    <Skeleton className="h-20" />
                    <Skeleton className="h-20" />
                    <Skeleton className="h-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Loading Technologies</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : 'Failed to load technology information. Please try again later.'}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Technology Sections */}
      {!isLoading && !error && (
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <TechnologySections sections={allSections} />
        </div>
      )}

      {/* Contact Form */}
      <InquiryForm title="Technology Solutions" />
    </Layout>
  );
};

export default SimpleTechnologyPage;
