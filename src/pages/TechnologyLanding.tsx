import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Skeleton } from '@/components/ui/skeleton';
import { useTechnologyData } from '@/hooks/useTechnologyData';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, LayoutTemplate } from 'lucide-react';
import TechnologyHero from '@/components/technology/TechnologyHero';
import TechnologySections from '@/components/technology/TechnologySections';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { getTechnologies } from '@/services/cms';
import { CMSTechnology } from '@/types/cms';
import InquiryForm from '@/components/machines/contact/InquiryForm';
import CaseStudyCarousel from '@/components/case-studies/CaseStudyCarousel';
import { getTechnologyCaseStudies } from '@/data/caseStudiesData';

const TechnologyLanding = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Get technology case studies
  const technologyCaseStudies = getTechnologyCaseStudies();
  
  // If slug is provided, fetch the specific technology
  const { 
    technology, 
    isLoading: isSingleLoading, 
    isError: isSingleError,
    error: singleError 
  } = useTechnologyData(slug || '');

  // If no slug is provided, fetch all technologies
  const {
    data: allTechnologies,
    isLoading: isAllLoading,
    isError: isAllError,
    error: allError
  } = useQuery<CMSTechnology[]>({
    queryKey: ['technologies'],
    queryFn: getTechnologies,
    enabled: !slug // Only run this query when no slug is provided
  });

  // Show loading state
  if ((slug && isSingleLoading) || (!slug && isAllLoading)) {
    return (
      <Layout>
        <div className="container max-w-7xl py-12">
          <Skeleton className="h-12 w-2/3 mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-5/6 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </Layout>
    );
  }

  // Show error state
  if ((slug && isSingleError) || (!slug && isAllError)) {
    return (
      <Layout>
        <div className="container max-w-7xl py-12">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load technology data. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  // If a specific technology is requested and found, show that technology
  if (slug && technology) {
    return (
      <Layout>
        <TechnologyHero technology={technology} />
        <TechnologySections technology={technology} />
        
        {/* Case Studies Section */}
        <CaseStudyCarousel 
          title="Technology Success Stories" 
          subtitle="See how our technology solutions create real business impact"
          caseStudies={technologyCaseStudies}
        />
        
        {/* Inquiry Form */}
        <InquiryForm title={`${technology.title} Technology`} />
      </Layout>
    );
  }

  // If no specific technology is requested, show a list of all technologies
  return (
    <Layout>
      {/* Hero Section with similar styling to machines page */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 py-16">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-vending-blue-dark mb-6">Our Technology Platform</h1>
              <p className="text-lg text-gray-700 mb-8 max-w-2xl">
                Explore our suite of enterprise-grade technologies designed to streamline operations and enhance your business.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild className="bg-vending-blue text-white hover:bg-vending-blue-dark">
                  <Link to="/contact">Request a Demo</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/partner">Partner With Us</Link>
                </Button>
                <Button asChild variant="outline" className="flex items-center gap-2">
                  <Link to="/technology/simple">
                    <LayoutTemplate size={16} /> View Simplified Layout
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789" 
                  alt="Vending Technology" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-vending-teal text-white p-4 rounded-lg shadow-lg hidden md:block">
                <p className="font-bold">Hardware agnostic platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container max-w-7xl py-12">
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h2 className="text-3xl font-bold text-vending-blue-dark mb-6">Advanced Solutions</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Discover how our technology can transform your vending operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allTechnologies && allTechnologies.length > 0 ? (
            allTechnologies.map(tech => (
              <Card key={tech.id} className="overflow-hidden">
                <div className="h-40 bg-slate-100 relative">
                  {tech.image_url ? (
                    <img 
                      src={tech.image_url} 
                      alt={tech.image_alt || tech.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-r from-slate-200 to-slate-300">
                      <span className="text-slate-500 text-xl font-medium">{tech.title.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{tech.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{tech.description}</p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/technology/${tech.slug}`}>Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <h3 className="text-xl font-medium text-gray-700">No technologies found</h3>
              <p className="text-muted-foreground mt-2">Please check back later for updates.</p>
            </div>
          )}
        </div>
      </div>

      {/* Case Studies Section */}
      <CaseStudyCarousel 
        title="Technology Success Stories" 
        subtitle="See how our technology solutions create real business impact"
        caseStudies={technologyCaseStudies}
      />

      {/* Inquiry Form */}
      <InquiryForm title="Technology Solutions" />
    </Layout>
  );
};

export default TechnologyLanding;
