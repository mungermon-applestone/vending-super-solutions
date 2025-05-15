
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from 'contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import Layout from '@/components/layout/Layout';

const contentfulClient = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN,
  environment: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master',
});

const About = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['about-page'],
    queryFn: async () => {
      const entry = await contentfulClient.getEntry('about-page');
      return entry;
    }
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
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">About Us</h1>
        
        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-700 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-medium">Error loading about page</h3>
            <p>Please try again later.</p>
          </div>
        )}
        
        {!isLoading && !error && data && data.fields?.bodyContent && (
          <div className="prose max-w-none">
            {renderRichText(data.fields.bodyContent)}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default About;
