
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useQuery } from '@tanstack/react-query';
import { contentfulClient } from '@/integrations/contentful/client';
import { Document } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

interface PrivacyPolicyFields {
  title: string;
  content: Document;
  lastUpdated?: string;
}

const PrivacyPolicy: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['contentful', 'privacy-policy'],
    queryFn: async () => {
      const response = await contentfulClient.getEntries({
        content_type: 'privacyPolicy',
        limit: 1,
      });
      
      if (response.items.length === 0) {
        throw new Error('Privacy policy not found');
      }
      
      return response.items[0].fields as PrivacyPolicyFields;
    },
  });

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="py-10 text-center">
              <p>Loading privacy policy...</p>
            </div>
          ) : error ? (
            <div className="py-10 text-center">
              <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
              <p className="text-gray-600">
                Our privacy policy content is temporarily unavailable.
                Please check back later.
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-6">{data?.title || 'Privacy Policy'}</h1>
              
              {data?.lastUpdated && (
                <p className="text-gray-500 mb-6">
                  Last updated: {new Date(data.lastUpdated).toLocaleDateString()}
                </p>
              )}
              
              <div className="prose max-w-none">
                {data?.content ? (
                  documentToReactComponents(data.content)
                ) : (
                  <p>Privacy policy content is not available at this time.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
