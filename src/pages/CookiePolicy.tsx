
import React, { useEffect } from 'react';
import Layout from "@/components/layout/Layout";
import { useContentful } from '@/hooks/useContentful';
import { fetchContentfulEntry } from '@/services/cms/utils/contentfulClient';
import { ContentfulErrorBoundary, ContentfulFallbackMessage } from '@/components/common';
import { renderRichText } from '@/utils/contentful/richTextRenderer';
import { Document } from '@contentful/rich-text-types';
import { Spinner } from '@/components/ui/spinner';
import { ContentfulResponse } from '@/types/contentful';
import SEO from '@/components/seo/SEO';

interface CookiePolicyEntry {
  sys: {
    id: string;
    contentType?: {
      sys: {
        id: string;
      };
    };
  };
  fields: {
    cookiePolicyContent?: Document;
    title?: string;
  };
  includes?: {
    Asset?: any[];
  };
}

const CookiePolicy = () => {
  // You'll need to create this entry in Contentful and replace this ID
  const entryId = '8GbFs4k7L2jQsM5pR9q3Vy';
  
  const { data: cookieContent, isLoading, error, isContentReady } = useContentful<ContentfulResponse<CookiePolicyEntry>>({
    queryKey: ['cookie-policy', entryId],
    queryFn: async () => {
      try {
        const entry = await fetchContentfulEntry<ContentfulResponse<CookiePolicyEntry>>(entryId);
        console.log('Cookie policy content fetched:', JSON.stringify(entry, null, 2));
        return entry;
      } catch (error) {
        console.error('Error fetching cookie policy:', error);
        throw error;
      }
    }
  });

  // Helper function to find the rich text content regardless of field name
  const getRichTextContent = () => {
    if (!cookieContent?.fields) return null;
    
    // Check for common field name variations
    const fieldNames = Object.keys(cookieContent.fields);
    
    // Try to find a rich text field (Document type)
    for (const fieldName of fieldNames) {
      const field = cookieContent.fields[fieldName];
      if (field && typeof field === 'object' && 'content' in field && 'nodeType' in field) {
        return field as Document;
      }
    }
    
    return null;
  };

  return (
    <Layout>
      <SEO 
        title="Cookie Policy"
        description="Information about how we use cookies on this website"
        type="article"
      />
      <div className="container-wide py-12">
        <h1 className="text-4xl font-bold text-vending-blue mb-8">Cookie Policy</h1>
        
        <ContentfulErrorBoundary 
          contentType="Cookie Policy" 
          fallback={
            <ContentfulFallbackMessage 
              message="There was an error displaying the cookie policy." 
              contentType="Cookie Policy"
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
              message={`Error loading cookie policy: ${error.message}`} 
              contentType="Cookie Policy"
              showRefresh={true}
            />
          ) : isContentReady && cookieContent ? (
            <div className="prose prose-lg max-w-none">
              {(() => {
                const richTextContent = getRichTextContent();
                
                if (richTextContent) {
                  return renderRichText(
                    richTextContent,
                    { includedAssets: cookieContent.includes?.Asset || [] }
                  );
                }
                
                return (
                  <div>
                    <p>No cookie policy content found with ID: {entryId}</p>
                    <div className="mt-4 p-4 bg-gray-100 rounded-md text-sm">
                      <p className="font-semibold">Debugging Info:</p>
                      <pre className="whitespace-pre-wrap mt-2">
                        {JSON.stringify({
                          contentReceived: !!cookieContent,
                          hasFields: cookieContent ? !!cookieContent.fields : false,
                          availableFields: cookieContent?.fields ? Object.keys(cookieContent.fields) : [],
                          entryType: cookieContent?.sys?.contentType?.sys?.id || 'unknown'
                        }, null, 2)}
                      </pre>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <p>No cookie policy content available.</p>
          )}
        </ContentfulErrorBoundary>
      </div>
    </Layout>
  );
};

export default CookiePolicy;
