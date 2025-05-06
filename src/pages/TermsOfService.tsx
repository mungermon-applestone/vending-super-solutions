
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

interface TermsOfServiceEntry {
  sys: {
    id: string;
    contentType?: {
      sys: {
        id: string;
      };
    };
  };
  fields: {
    termsContent?: Document;
    title?: string;
  };
  includes?: {
    Asset?: any[];
  };
}

const TermsOfService = () => {
  // You'll need to create this entry in Contentful and replace this ID
  const entryId = '7FtGs9k2P3jQsR4mN8p2Vx';
  
  const { data: termsContent, isLoading, error, isContentReady } = useContentful<ContentfulResponse<TermsOfServiceEntry>>({
    queryKey: ['terms-of-service', entryId],
    queryFn: async () => {
      try {
        const entry = await fetchContentfulEntry<ContentfulResponse<TermsOfServiceEntry>>(entryId);
        console.log('Terms of service content fetched:', JSON.stringify(entry, null, 2));
        return entry;
      } catch (error) {
        console.error('Error fetching terms of service:', error);
        throw error;
      }
    }
  });

  // Helper function to find the rich text content regardless of field name
  const getRichTextContent = () => {
    if (!termsContent?.fields) return null;
    
    // Check for common field name variations
    const fieldNames = Object.keys(termsContent.fields);
    
    // Try to find a rich text field (Document type)
    for (const fieldName of fieldNames) {
      const field = termsContent.fields[fieldName];
      if (field && typeof field === 'object' && 'content' in field && 'nodeType' in field) {
        return field as Document;
      }
    }
    
    return null;
  };

  return (
    <Layout>
      <SEO 
        title="Terms of Service"
        description="Terms and conditions for using our services"
        type="article"
      />
      <div className="container-wide py-12">
        <h1 className="text-4xl font-bold text-vending-blue mb-8">Terms of Service</h1>
        
        <ContentfulErrorBoundary 
          contentType="Terms of Service" 
          fallback={
            <ContentfulFallbackMessage 
              message="There was an error displaying the terms of service." 
              contentType="Terms of Service"
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
              message={`Error loading terms of service: ${error.message}`} 
              contentType="Terms of Service"
              showRefresh={true}
            />
          ) : isContentReady && termsContent ? (
            <div className="prose prose-lg max-w-none">
              {(() => {
                const richTextContent = getRichTextContent();
                
                if (richTextContent) {
                  return renderRichText(
                    richTextContent,
                    { includedAssets: termsContent.includes?.Asset || [] }
                  );
                }
                
                return (
                  <div>
                    <p>No terms of service content found with ID: {entryId}</p>
                    <div className="mt-4 p-4 bg-gray-100 rounded-md text-sm">
                      <p className="font-semibold">Debugging Info:</p>
                      <pre className="whitespace-pre-wrap mt-2">
                        {JSON.stringify({
                          contentReceived: !!termsContent,
                          hasFields: termsContent ? !!termsContent.fields : false,
                          availableFields: termsContent?.fields ? Object.keys(termsContent.fields) : [],
                          entryType: termsContent?.sys?.contentType?.sys?.id || 'unknown'
                        }, null, 2)}
                      </pre>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <p>No terms of service content available.</p>
          )}
        </ContentfulErrorBoundary>
      </div>
    </Layout>
  );
};

export default TermsOfService;
