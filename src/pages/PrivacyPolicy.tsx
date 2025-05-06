
import React from 'react';
import Layout from "@/components/layout/Layout";
import { useContentful } from '@/hooks/useContentful';
import { fetchContentfulEntry } from '@/services/cms/utils/contentfulClient';
import { ContentfulErrorBoundary } from '@/components/common';
import ContentfulFallbackMessage from '@/components/common/ContentfulFallbackMessage';
import { renderRichText } from '@/utils/contentful/richTextRenderer';
import { Document } from '@contentful/rich-text-types';
import { Spinner } from '@/components/ui/spinner';
import { ContentfulResponse } from '@/types/contentful';

interface PrivacyPolicyEntry {
  sys: {
    id: string;
    contentType?: {
      sys: {
        id: string;
      };
    };
  };
  fields: {
    'Privacy-main-text'?: Document;
    title?: string;
  };
  includes?: {
    Asset?: any[];
  };
}

const PrivacyPolicy = () => {
  const { data: privacyContent, isLoading, error, isContentReady } = useContentful<ContentfulResponse<PrivacyPolicyEntry>>({
    queryKey: ['privacy-policy', '4SiOG2H5N7dLSnWbvZN5GW'],
    queryFn: async () => {
      try {
        // Fetch the specific privacy policy entry by ID
        const entry = await fetchContentfulEntry<ContentfulResponse<PrivacyPolicyEntry>>('4SiOG2H5N7dLSnWbvZN5GW');
        console.log('Privacy policy content fetched:', entry);
        return entry;
      } catch (error) {
        console.error('Error fetching privacy policy:', error);
        throw error;
      }
    }
  });

  return (
    <Layout>
      <div className="container-wide py-12">
        <h1 className="text-4xl font-bold text-vending-blue mb-8">Privacy Policy</h1>
        
        <ContentfulErrorBoundary 
          contentType="Privacy Policy" 
          fallback={
            <ContentfulFallbackMessage 
              message="There was an error displaying the privacy policy." 
              contentType="Privacy Policy"
              showRefresh={true}
            />
          }
        >
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <ContentfulFallbackMessage 
              message={`Error loading privacy policy: ${error.message}`} 
              contentType="Privacy Policy"
              showRefresh={true}
            />
          ) : isContentReady && privacyContent ? (
            <div className="prose prose-lg max-w-none">
              {privacyContent.fields && privacyContent.fields['Privacy-main-text'] ? (
                renderRichText(
                  privacyContent.fields['Privacy-main-text'] as Document, 
                  { includedAssets: privacyContent.includes?.Asset || [] }
                )
              ) : (
                <p>No privacy policy content available.</p>
              )}
            </div>
          ) : (
            <p>No privacy policy content available.</p>
          )}
        </ContentfulErrorBoundary>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
