
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { contentfulClient } from '@/integrations/contentful/client';
import Layout from '@/components/layout/Layout';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { TermsOfServiceFields } from '@/types/contentful';

const TermsOfService = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['contentful', 'termsOfService'],
    queryFn: async () => {
      try {
        const response = await contentfulClient.getEntries({
          content_type: 'termsOfService',
          limit: 1,
        });
        
        if (response.items.length === 0) {
          throw new Error('Terms of service not found');
        }
        
        return response.items[0];
      } catch (error) {
        console.error('Error fetching terms of service:', error);
        throw error;
      }
    },
  });
  
  const fields = data?.fields as unknown as TermsOfServiceFields;
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">{isLoading ? 'Loading...' : fields?.title || 'Terms of Service'}</h1>
        
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        ) : (
          <div className="prose max-w-none">
            {fields?.content && documentToReactComponents(fields.content)}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TermsOfService;
