import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useTechnologies } from '@/hooks/cms/useTechnologies';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import PageHero from '@/components/common/PageHero';
import { CMSImage } from '@/types/cms';

const getImageProps = (image: CMSImage | string | undefined) => {
  if (!image) return { url: '', alt: '' };
  
  if (typeof image === 'string') {
    return { url: image, alt: 'Technology image' };
  }
  
  return { url: image.url, alt: image.alt || 'Technology image' };
}

const TechnologyPage = () => {
  const { data: technologies, isLoading, error } = useTechnologies();
  const navigate = useNavigate();
  
  return (
    <Layout>
      <PageHero 
        pageKey="technology"
        fallbackTitle="Our Technology"
        fallbackSubtitle="Discover the innovative technology powering our vending and locker solutions."
        fallbackImage="https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        fallbackImageAlt="Vending Technology"
        fallbackPrimaryButtonText="Schedule a Demo"
        fallbackPrimaryButtonUrl="/contact"
        fallbackSecondaryButtonText="View Products"
        fallbackSecondaryButtonUrl="/products"
      />

      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h2 className="text-3xl font-bold text-vending-blue-dark mb-6">Cutting-Edge Technology Solutions</h2>
          <p className="text-xl text-gray-700">
            Our platform combines hardware and software innovations to deliver exceptional vending experiences.
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Technologies</h3>
            <p className="text-red-600">{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
          </div>
        )}

        {technologies && technologies.length === 0 && !isLoading && !error && (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Technologies Found</h3>
            <p className="text-gray-600">Check back later for information about our cutting-edge technologies.</p>
          </div>
        )}

        {technologies && technologies.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {technologies.map((tech) => {
              const imageData = tech.image ? getImageProps(tech.image) : { url: '', alt: '' };
              
              return (
                <div key={tech.id} className="border border-gray-200 rounded-lg overflow-hidden transition-all hover:shadow-lg">
                  {tech.image && (
                    <img 
                      src={imageData.url} 
                      alt={imageData.alt || tech.title} 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/400x200?text=Technology+Image";
                      }}
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3">{tech.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{tech.description}</p>
                    <Button 
                      variant="ghost" 
                      className="text-vending-blue hover:text-vending-blue-dark font-medium flex items-center p-0"
                      onClick={() => navigate(`/technology/${tech.slug}`)}
                    >
                      Learn more
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TechnologyPage;
