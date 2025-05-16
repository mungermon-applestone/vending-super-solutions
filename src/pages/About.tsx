
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import Layout from '@/components/layout/Layout';
import { fetchContentfulEntry } from '@/services/contentful/utils';
import { isContentfulConfigured } from '@/services/contentful/environment';
import { Loader } from '@/components/ui/loader';

const About = () => {
  // Log configuration status to help debugging
  console.log('[About] Contentful configured:', isContentfulConfigured());
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['about-page'],
    queryFn: async () => {
      console.log('[About] Fetching about-page entry from Contentful');
      try {
        const entry = await fetchContentfulEntry('about-page');
        console.log('[About] Successfully retrieved entry:', entry);
        return entry;
      } catch (err) {
        console.error('[About] Error fetching about-page:', err);
        throw err;
      }
    },
    retry: 1
  });

  const renderRichText = (content: any) => {
    const options = {
      renderNode: {
        [BLOCKS.HEADING_1]: (_: any, children: React.ReactNode) => (
          <h1 className="text-4xl font-bold mb-6">{children}</h1>
        ),
        [BLOCKS.HEADING_2]: (_: any, children: React.ReactNode) => (
          <h2 className="text-3xl font-bold mb-4 mt-8">{children}</h2>
        ),
        [BLOCKS.HEADING_3]: (_: any, children: React.ReactNode) => (
          <h3 className="text-2xl font-bold mb-3 mt-6">{children}</h3>
        ),
        [BLOCKS.PARAGRAPH]: (_: any, children: React.ReactNode) => (
          <p className="mb-4">{children}</p>
        ),
        [BLOCKS.UL_LIST]: (_: any, children: React.ReactNode) => (
          <ul className="list-disc pl-6 mb-4">{children}</ul>
        ),
        [BLOCKS.OL_LIST]: (_: any, children: React.ReactNode) => (
          <ol className="list-decimal pl-6 mb-4">{children}</ol>
        ),
        [BLOCKS.LIST_ITEM]: (_: any, children: React.ReactNode) => (
          <li className="mb-1">{children}</li>
        ),
        [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => (
          <a 
            href={node.data.uri} 
            target="_blank" 
            rel="noreferrer"
            className="text-blue-600 hover:underline"
          >
            {children}
          </a>
        ),
      }
    };

    return documentToReactComponents(content, options);
  };
  
  // Debug section to show raw data when available
  const debugData = () => {
    if (!data) return null;
    
    return (
      <div className="mt-12 p-4 bg-gray-100 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Debug: Entry Structure</h3>
        <pre className="whitespace-pre-wrap text-xs">
          {JSON.stringify({
            id: data.sys?.id,
            contentType: data.sys?.contentType?.sys?.id,
            hasFields: !!data.fields,
            fieldNames: data.fields ? Object.keys(data.fields) : [],
            hasBodyContent: !!data.fields?.bodyContent
          }, null, 2)}
        </pre>
      </div>
    );
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">About Us</h1>
        
        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader size="large" />
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-700 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-medium">Error loading about page</h3>
            <p className="text-sm">{error instanceof Error ? error.message : 'Please try again later.'}</p>
            <div className="mt-4">
              <h4 className="text-sm font-medium">Contentful Configuration Status:</h4>
              <p className="text-xs mt-1">Contentful configured: {isContentfulConfigured() ? 'Yes' : 'No'}</p>
              <p className="text-xs mt-1">
                Using Space ID: {import.meta.env.VITE_CONTENTFUL_SPACE_ID ? 'Yes (from env)' : 'No'}
                {typeof window !== 'undefined' && window.env?.VITE_CONTENTFUL_SPACE_ID ? ' (from window.env)' : ''}
              </p>
            </div>
          </div>
        )}
        
        {!isLoading && !error && data && data.fields?.bodyContent && (
          <div className="prose max-w-none">
            {renderRichText(data.fields.bodyContent)}
          </div>
        )}
        
        {!isLoading && !error && data && !data.fields?.bodyContent && (
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-yellow-800">Content Structure Issue</h3>
            <p className="text-yellow-700 mt-2">
              We found the "about-page" entry, but it doesn't have a 'bodyContent' field as expected.
            </p>
            {debugData()}
          </div>
        )}
        
        {!isLoading && !error && !data && (
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-yellow-800">No Content Found</h3>
            <p className="text-yellow-700 mt-2">
              We couldn't find the "about-page" entry in your Contentful space.
            </p>
            <p className="mt-2 text-sm">
              Please create an entry with ID "about-page" in your Contentful space with a 'bodyContent' rich text field.
            </p>
          </div>
        )}
        
        {/* Show debug data when in development mode */}
        {import.meta.env.MODE === 'development' && debugData()}
      </div>
    </Layout>
  );
};

export default About;
