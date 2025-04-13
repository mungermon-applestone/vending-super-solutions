
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useTechnologySections } from '@/hooks/useTechnologySections';
import PageHero from '@/components/common/PageHero';
import CTASection from '@/components/common/CTASection';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const TechnologyLanding = () => {
  const { technologies, isLoading } = useTechnologySections();
  
  return (
    <Layout>
      <PageHero 
        pageKey="technology"
        fallbackTitle="Enterprise-Grade Technology"
        fallbackSubtitle="Our platform is built with security, scalability, and flexibility in mind to power your vending operations."
        fallbackImage="https://images.unsplash.com/photo-1550751827-4bd374c3f58b"
        fallbackImageAlt="Technology circuit board and digital interface"
        fallbackPrimaryButtonText="Learn More"
        fallbackPrimaryButtonUrl="/contact"
        fallbackSecondaryButtonText="View Tech Specs"
        fallbackSecondaryButtonUrl="#tech-details"
      />
      
      <div className="container mx-auto py-16" id="tech-details">
        <h2 className="text-3xl font-bold text-center mb-2">Our Technology Solutions</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Discover how our advanced technology solutions can transform your vending operations
        </p>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video w-full">
                  <Skeleton className="h-full w-full" />
                </div>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-5/6 mb-4" />
                  <Skeleton className="h-10 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : technologies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No technology solutions found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech) => (
              <Card key={tech.id} className="overflow-hidden h-full flex flex-col">
                {tech.image_url && (
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={tech.image_url} 
                      alt={tech.image_alt || tech.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  </div>
                )}
                <CardContent className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold mb-2">{tech.title}</h3>
                  <p className="text-muted-foreground mb-4 flex-grow">{tech.description}</p>
                  <Link 
                    to={`/technology/${tech.slug}`}
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <CTASection />
    </Layout>
  );
};

export default TechnologyLanding;
