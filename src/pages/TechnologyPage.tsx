
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useTechnologySections } from '@/hooks/cms/useTechnologySections';
import TechnologyPageHero from '@/components/technology/TechnologyPageHero';
import TechnologySectionItem from '@/components/technology/TechnologySectionItem';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InquiryForm from '@/components/machines/contact/InquiryForm';

const TechnologyPage = () => {
  const { data: sections, isLoading, error, refetch } = useTechnologySections();
  
  return (
    <Layout>
      <TechnologyPageHero entryId="66FG7FxpIy3YkSXj2mu846" />
      
      <div className="py-12">
        {isLoading && (
          <div className="container mx-auto px-4 space-y-12">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-1/2">
                  <Skeleton className="h-64 w-full" />
                </div>
                <div className="w-full md:w-1/2 space-y-4">
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}
        
        {error && (
          <div className="container mx-auto px-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error loading technology sections</AlertTitle>
              <AlertDescription>
                {error instanceof Error ? error.message : 'An unknown error occurred'}
                <Button 
                  onClick={() => refetch()}
                  variant="outline" 
                  size="sm"
                  className="mt-2 ml-2"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        {!isLoading && !error && sections && sections.length > 0 && (
          <>
            {sections
              .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
              .map((section, index) => (
                <TechnologySectionItem
                  key={section.id}
                  title={section.title}
                  summary={section.summary}
                  bulletPoints={section.bulletPoints || []}
                  imageUrl={section.sectionImage?.url || ''}
                  imageAlt={section.sectionImage?.alt || section.title}
                  index={index}
                />
              ))}
          </>
        )}
        
        {!isLoading && !error && (!sections || sections.length === 0) && (
          <div className="container mx-auto px-4 py-12 text-center">
            <h2 className="text-2xl font-bold mb-4">No Technology Sections Found</h2>
            <p className="text-gray-600 mb-6">
              Please add some technology sections in Contentful to display content here.
            </p>
            <Button onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Content
            </Button>
          </div>
        )}
      </div>
      
      {/* Add Inquiry Form */}
      <InquiryForm title="Interested in our technology solutions?" />
    </Layout>
  );
};

export default TechnologyPage;
