
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { contentfulClient } from '@/services/contentful/client';
import Layout from '@/components/layout/Layout';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { TermsOfServiceFields } from '@/types/contentful';

const TermsOfService = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['contentful', 'termsOfService'],
    queryFn: async () => {
      try {
        console.log('[TermsOfService] Fetching terms of service content');
        const response = await contentfulClient.getEntries({
          content_type: 'termsOfService',
          limit: 1,
        });
        
        if (response.items.length === 0) {
          console.warn('[TermsOfService] Terms of service not found');
          throw new Error('Terms of service not found');
        }
        
        console.log('[TermsOfService] Found terms of service content');
        return response.items[0];
      } catch (error) {
        console.error('[TermsOfService] Error fetching terms of service:', error);
        throw error;
      }
    },
  });
  
  const fields = data?.fields as unknown as TermsOfServiceFields;
  
  if (error) {
    console.error('[TermsOfService] Render error:', error);
  }
  
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
        ) : error ? (
          <div className="p-4 border border-red-300 bg-red-50 rounded-md">
            <p className="text-red-700">
              We're currently having trouble loading our terms of service. Please try again later.
            </p>
          </div>
        ) : (
          <div className="prose max-w-none">
            {fields?.content && documentToReactComponents(fields.content)}
            {!fields?.content && (
              <p>Our terms of service content is currently being updated. Please check back soon.</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TermsOfService;
