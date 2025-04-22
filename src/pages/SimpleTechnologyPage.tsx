
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useTechnologyData } from '@/hooks/useTechnologyData';
import { CMSTechnology, CMSTechnologySection } from '@/types/cms';

interface TechnologySection {
  id: string;
  title: string;
  description: string;
  features?: any[];
}

const SimpleTechnologyPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [sections, setSections] = useState<TechnologySection[]>([]);
  
  const { 
    data: technology,
    isLoading,
    error
  } = useTechnologyData(slug || '');
  
  useEffect(() => {
    if (technology?.sections) {
      setSections(technology.sections);
    }
  }, [technology]);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container py-16">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-10"></div>
            <div className="grid gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <div className="container py-16">
          <h1 className="text-3xl font-bold mb-4">Error</h1>
          <p className="text-red-600">{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
        </div>
      </Layout>
    );
  }
  
  if (!technology) {
    return (
      <Layout>
        <div className="container py-16">
          <h1 className="text-3xl font-bold mb-4">Technology Not Found</h1>
          <p>The technology you're looking for doesn't exist or has been removed.</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container py-16">
        <h1 className="text-3xl font-bold mb-4">{technology.title}</h1>
        <p className="text-lg mb-12">{technology.description}</p>
        
        {sections.map((section, index) => (
          <div key={section.id || index} className="mb-16">
            <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
            <p className="mb-6">{section.description}</p>
            
            {section.features && section.features.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {section.features.map((feature, featureIndex) => (
                  <div key={feature.id || featureIndex} className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
                    <p className="text-gray-700">{feature.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default SimpleTechnologyPage;
