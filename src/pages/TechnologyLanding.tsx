
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useTechnologies } from '@/hooks/cms/useTechnologies';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const TechnologyLanding: React.FC = () => {
  const navigate = useNavigate();
  const { data: technologies, isLoading, error } = useTechnologies();
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container py-16">
          <h1 className="text-3xl font-bold mb-8">Our Technologies</h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-lg p-6 shadow-sm border">
                <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5 mb-6"></div>
                <div className="h-10 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
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

  return (
    <Layout>
      <div className="container py-16">
        <h1 className="text-3xl font-bold mb-8">Our Technologies</h1>
        
        {technologies && technologies.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {technologies.map((tech) => (
              <div key={tech.id} className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold mb-3">{tech.title}</h2>
                <p className="text-gray-700 mb-6">{tech.description}</p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/technology/${tech.slug}`)} 
                  className="group"
                >
                  Learn more <ArrowRight className="inline-block ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No technologies found</h3>
            <p className="text-gray-600">We're currently updating our technology information. Please check back later.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TechnologyLanding;
