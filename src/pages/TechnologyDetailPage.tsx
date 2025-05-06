import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useTechnologyData } from '@/hooks/useTechnologyData';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CMSImage } from '@/types/cms';
import { SimpleContactCTA } from '@/components/common';

const getImageProps = (image: CMSImage | string | undefined) => {
  if (!image) return { url: '', alt: '' };
  
  if (typeof image === 'string') {
    return { url: image, alt: 'Technology image' };
  }
  
  return { url: image.url, alt: image.alt || 'Technology image' };
}

const TechnologyDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { technology, isLoading, error } = useTechnologyData(slug || '');
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-8" />
            <Skeleton className="h-96 w-full rounded-lg mb-8" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Technology</h3>
              <p className="text-red-600">{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/technology">Return to Technologies</Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!technology) {
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-amber-50 border border-amber-200 rounded-md p-6 text-center">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Technology Not Found</h3>
              <p className="text-amber-600">The technology you're looking for doesn't exist or has been removed.</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/technology">Return to Technologies</Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  const imageData = technology && technology.image ? getImageProps(technology.image) : { url: '', alt: '' };
  
  return (
    <Layout>
      <div className="bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light py-16">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <Link to="/technology" className="flex items-center text-vending-blue-dark hover:text-vending-blue mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Technologies
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{technology?.title}</h1>
            <p className="text-xl text-gray-700 mb-6">{technology?.description}</p>
            {technology?.image && (
              <img 
                src={imageData.url} 
                alt={imageData.alt} 
                className="w-full rounded-lg shadow-lg mb-8 object-cover h-72 md:h-96"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/1200x600?text=Technology+Image";
                }}
              />
            )}
          </div>
        </div>
      </div>
      
      {technology?.sections && technology.sections.length > 0 ? (
        <div className="container mx-auto py-12">
          <div className="max-w-4xl mx-auto">
            {technology.sections.map((section, index) => (
              <div key={section.id} className={`mb-16 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <h2 className="text-3xl font-bold mb-6">{section.title}</h2>
                <p className="text-lg text-gray-700 mb-6">{section.description}</p>
                
                {section.features && section.features.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {section.features.map(feature => (
                      <div key={feature.id} className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="container mx-auto py-12">
          <div className="max-w-4xl mx-auto bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
            <p className="text-gray-600">Additional information about this technology coming soon.</p>
          </div>
        </div>
      )}
      
      <SimpleContactCTA />
    </Layout>
  );
};

export default TechnologyDetailPage;
