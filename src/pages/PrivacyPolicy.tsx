
import React, { useEffect } from 'react';
import Layout from "@/components/layout/Layout";
import { useContentful } from '@/hooks/useContentful';
import { fetchContentfulEntry } from '@/services/cms/utils/contentfulClient';
import { ContentfulErrorBoundary, ContentfulFallbackMessage } from '@/components/common';
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
  const entryId = '4SiOG2H5N7dLSnWbvZN5GW';
  
  const { data: privacyContent, isLoading, error, isContentReady } = useContentful<ContentfulResponse<PrivacyPolicyEntry>>({
    queryKey: ['privacy-policy', entryId],
    queryFn: async () => {
      try {
        // Fetch the specific privacy policy entry by ID
        const entry = await fetchContentfulEntry<ContentfulResponse<PrivacyPolicyEntry>>(entryId);
        console.log('Privacy policy content fetched:', JSON.stringify(entry, null, 2));
        return entry;
      } catch (error) {
        console.error('Error fetching privacy policy:', error);
        throw error;
      }
    }
  });

  // Debug useEffect to see what's in the response
  useEffect(() => {
    if (privacyContent) {
      console.log('Privacy content in component:', privacyContent);
      console.log('Has fields?', !!privacyContent.fields);
      if (privacyContent.fields) {
        console.log('Privacy-main-text exists?', 'Privacy-main-text' in privacyContent.fields);
        console.log('Privacy-main-text value:', privacyContent.fields['Privacy-main-text']);
      }
    }
  }, [privacyContent]);

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
                  privacyContent.fields['Privacy-main-text'],
                  { includedAssets: privacyContent.includes?.Asset || [] }
                )
              ) : (
                <div>
                  <p>No privacy policy content found with ID: {entryId}</p>
                  <div className="mt-4 p-4 bg-gray-100 rounded-md text-sm">
                    <p className="font-semibold">Debugging Info:</p>
                    <pre className="whitespace-pre-wrap mt-2">
                      {JSON.stringify({
                        contentReceived: !!privacyContent,
                        hasFields: privacyContent ? !!privacyContent.fields : false,
                        hasPrivacyText: privacyContent?.fields ? 'Privacy-main-text' in privacyContent.fields : false
                      }, null, 2)}
                    </pre>
                  </div>
                </div>
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
