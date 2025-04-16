import React from 'react';
import Layout from '@/components/layout/Layout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import useTechnologySections from '@/hooks/useTechnologySections';
import { CMSImage, CMSTechnologySection } from '@/types/cms';
import Image from '@/components/common/Image';
import { toast } from 'sonner';

const TechnologyTestPage = () => {
  // Use the custom hook to fetch technology data
  const { technologies = [], isLoading, error, refetch } = useTechnologySections();
  
  // Use the first technology entry for the page
  const mainTechnology = technologies[0];
  
  console.log('Test page - Technologies from hook:', technologies);
  console.log('Test page - Main technology:', mainTechnology);
  
  // Function to manually trigger a refetch
  const handleRefresh = () => {
    toast.info('Refreshing technology data...');
    refetch();
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <Skeleton className="h-64 w-full mb-8" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <Alert variant="destructive">
            <AlertDescription>
              {error instanceof Error ? error.message : 'Failed to load technology information'}
            </AlertDescription>
          </Alert>
          <button 
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry Loading
          </button>
        </div>
      </Layout>
    );
  }

  if (!mainTechnology) {
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <Alert>
            <AlertDescription>
              No technology information available.
            </AlertDescription>
          </Alert>
          <button 
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry Loading
          </button>
        </div>
      </Layout>
    );
  }
  
  // Check if sections exist and cast to array if needed
  const sections = Array.isArray(mainTechnology.sections) ? mainTechnology.sections : [];
  
  console.log('Test page - Sections:', sections);
  
  return (
    <Layout>
      <div className="container mx-auto py-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{mainTechnology.title}</h1>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Data
          </button>
        </div>
        <p className="text-lg mb-8">{mainTechnology.description}</p>
        
        {/* Display technical info */}
        <div className="mb-8 p-4 bg-gray-100 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Technical Information:</h2>
          <p><strong>Technology ID:</strong> {mainTechnology.id}</p>
          <p><strong>Slug:</strong> {mainTechnology.slug}</p>
          <p><strong>Sections Count:</strong> {sections.length}</p>
        </div>
        
        {/* Display hero image if available */}
        {mainTechnology.image && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Hero Image:</h2>
            <div className="border p-4 rounded-md">
              {typeof mainTechnology.image === 'string' ? (
                <Image src={mainTechnology.image} alt="Technology image" className="max-w-full h-auto" />
              ) : (
                <Image 
                  src={mainTechnology.image.url} 
                  alt={mainTechnology.image.alt} 
                  className="max-w-full h-auto" 
                />
              )}
            </div>
          </div>
        )}
        
        {/* Debug section to display sections data */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Sections Debug Info:</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
            {JSON.stringify(sections, null, 2)}
          </pre>
        </div>
        
        {/* Display each section */}
        {sections && sections.length > 0 ? (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold mb-4">Technology Sections</h2>
            {sections.map((section, index) => (
              <SingleSection key={section.id || `section-${index}`} section={section} index={index} />
            ))}
          </div>
        ) : (
          <Alert>
            <AlertDescription>No technology sections available.</AlertDescription>
          </Alert>
        )}
      </div>
    </Layout>
  );
};

// Simple component to display a single section
const SingleSection = ({ section, index }: { section: CMSTechnologySection, index: number }) => {
  return (
    <div className="border p-6 rounded-lg bg-white shadow-sm">
      <h3 className="text-xl font-semibold mb-2">
        {index + 1}. {section.title || 'Untitled Section'}
      </h3>
      <p className="mb-4">{section.summary || section.description || 'No description provided'}</p>
      
      {/* Display bullet points if available */}
      {section.bulletPoints && section.bulletPoints.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">Bullet Points:</h4>
          <ul className="list-disc pl-5">
            {section.bulletPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Display section image if available */}
      {(section.sectionImage || section.image) && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Section Image:</h4>
          {section.sectionImage ? (
            typeof section.sectionImage === 'string' ? (
              <Image 
                src={section.sectionImage} 
                alt={section.title || 'Section image'} 
                className="max-w-full h-auto" 
              />
            ) : section.sectionImage.url ? (
              <Image 
                src={section.sectionImage.url} 
                alt={section.title || 'Section image'} 
                className="max-w-full h-auto" 
              />
            ) : (
              <div className="text-gray-500">Image data found but URL is missing</div>
            )
          ) : section.image ? (
            typeof section.image === 'string' ? (
              <Image 
                src={section.image} 
                alt={section.title || 'Section image'} 
                className="max-w-full h-auto" 
              />
            ) : section.image.url ? (
              <Image 
                src={section.image.url} 
                alt={section.title || 'Section image'} 
                className="max-w-full h-auto" 
              />
            ) : (
              <div className="text-gray-500">Image data found but URL is missing</div>
            )
          ) : (
            <div className="text-gray-500">No image data available</div>
          )}
        </div>
      )}
      
      {/* Display features if available */}
      {section.features && section.features.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium mb-2">Features ({section.features.length}):</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.features.map((feature, i) => (
              <div key={i} className="border p-4 rounded">
                <h5 className="font-medium">{feature.title}</h5>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnologyTestPage;
