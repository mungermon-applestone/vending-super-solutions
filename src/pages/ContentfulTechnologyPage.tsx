
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useContentfulTechnology } from '@/hooks/cms/useContentfulTechnology';
import TechnologyHero from '@/components/technology/TechnologyHero';
import TechnologySections from '@/components/technology/TechnologySections';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import PageHero from '@/components/common/PageHero';
import InquiryForm from '@/components/machines/contact/InquiryForm';

const ContentfulTechnologyPage: React.FC = () => {
  const { data: technologies, isLoading, error } = useContentfulTechnology();
  
  // Use the first technology (main technology page)
  const technology = technologies && technologies.length > 0 ? technologies[0] : null;
  
  console.log('Technology data:', technology);
  
  return (
    <Layout>
      {/* If data is loading, show skeleton */}
      {isLoading && (
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
          {[1, 2, 3].map((i) => (
            <div key={i} className={`py-16 ${i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
              <div className="container">
                <div className="max-w-3xl mx-auto text-center mb-12">
                  <Skeleton className="h-6 w-20 mx-auto mb-4" />
                  <Skeleton className="h-10 w-2/3 mx-auto mb-4" />
                  <Skeleton className="h-6 w-full mx-auto" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="border rounded-lg p-6">
                      <Skeleton className="h-12 w-12 rounded-full mb-4" />
                      <Skeleton className="h-6 w-2/3 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </>
      )}
      
      {/* If there was an error loading the data */}
      {error && !isLoading && (
        <div className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Technology Data</h1>
              <p className="mb-6">
                There was a problem loading the technology information. Please try again later.
              </p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </div>
        </div>
      )}
      
      {/* If no technology data was found */}
      {!isLoading && !error && !technology && (
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
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4">Technology Information Coming Soon</h2>
                <p className="text-muted-foreground mb-8">
                  We're currently updating our technology information. Please check back later for detailed information about our platform capabilities.
                </p>
                
                {/* Fallback content for preview environment */}
                {window.location.hostname.includes('lovable') && (
                  <div className="mt-8 border border-amber-200 rounded-lg p-8 bg-amber-50">
                    <h3 className="text-lg font-semibold mb-2">Preview Environment Notice</h3>
                    <p className="mb-4">
                      This is a preview environment. You need to create a Contentful "Technology" content type to display real content here.
                    </p>
                    
                    <div className="flex justify-center">
                      <Button variant="outline" asChild>
                        <a href="/admin/content-management" className="border-amber-500 text-amber-700 hover:bg-amber-100">
                          Go to Content Management
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* If technology data was found */}
      {!isLoading && !error && technology && (
        <>
          <TechnologyHero technology={technology} />
          
          {technology.sections && technology.sections.length > 0 ? (
            <TechnologySections sections={technology.sections} />
          ) : (
            <div className="py-16">
              <div className="container">
                <div className="text-center max-w-3xl mx-auto">
                  <h2 className="text-2xl font-semibold mb-4">Technology Sections Coming Soon</h2>
                  <p className="text-muted-foreground">
                    We're currently updating our technology information. Please check back later for detailed sections about our platform capabilities.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Contact Form */}
      <InquiryForm title="Technology Solutions" />
    </Layout>
  );
};

export default ContentfulTechnologyPage;
