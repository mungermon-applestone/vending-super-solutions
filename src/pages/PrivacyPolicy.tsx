
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
    privacyMainText?: Document;
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
      console.log('All field names:', privacyContent.fields ? Object.keys(privacyContent.fields) : []);
      
      if (privacyContent.fields) {
        // Check for all possible variations of the field name
        const possibleFieldNames = ['Privacy-main-text', 'privacyMainText', 'privacy_main_text', 'privacyMainText', 'privacyText', 'content', 'body'];
        possibleFieldNames.forEach(fieldName => {
          console.log(`Has ${fieldName}?`, fieldName in privacyContent.fields);
        });
      }
    }
  }, [privacyContent]);

  // Helper function to find the rich text content regardless of field name
  const getRichTextContent = () => {
    if (!privacyContent?.fields) return null;
    
    // Check for common field name variations
    const fieldNames = Object.keys(privacyContent.fields);
    console.log('Available fields:', fieldNames);
    
    // Try to find a rich text field (Document type)
    for (const fieldName of fieldNames) {
      const field = privacyContent.fields[fieldName];
      if (field && typeof field === 'object' && 'content' in field && 'nodeType' in field) {
        console.log(`Found rich text content in field: ${fieldName}`);
        return field as Document;
      }
    }
    
    return null;
  };

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
              {(() => {
                // Try to get rich text content from any field
                const richTextContent = getRichTextContent();
                
                if (richTextContent) {
                  return renderRichText(
                    richTextContent,
                    { includedAssets: privacyContent.includes?.Asset || [] }
                  );
                }
                
                return (
                  <div>
                    <p>No privacy policy content found with ID: {entryId}</p>
                    <div className="mt-4 p-4 bg-gray-100 rounded-md text-sm">
                      <p className="font-semibold">Debugging Info:</p>
                      <pre className="whitespace-pre-wrap mt-2">
                        {JSON.stringify({
                          contentReceived: !!privacyContent,
                          hasFields: privacyContent ? !!privacyContent.fields : false,
                          availableFields: privacyContent?.fields ? Object.keys(privacyContent.fields) : [],
                          entryType: privacyContent?.sys?.contentType?.sys?.id || 'unknown'
                        }, null, 2)}
                      </pre>
                    </div>
                  </div>
                );
              })()}
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
