
import React from 'react';
import Layout from "@/components/layout/Layout";
import { useContentful } from '@/hooks/useContentful';
import { fetchContentfulEntry } from '@/services/cms/utils/contentfulClient';
import { ContentfulErrorBoundary, ContentfulFallbackMessage } from '@/components/common';
import { renderRichText } from '@/utils/contentful/richTextRenderer';
import { Document } from '@contentful/rich-text-types';
import { Spinner } from '@/components/ui/spinner';
import { ContentfulResponse } from '@/types/contentful';
import SEO from '@/components/seo/SEO';

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
    termsOfUse?: Document;
  };
  includes?: {
    Asset?: any[];
  };
}

const TermsOfService = () => {
  // Corrected entry ID for the Privacy Policy content that contains terms of use
  const entryId = '4SiOG2H5N7dLSnWbvZN5GW'; 
  
  const { data: privacyPolicy, isLoading, error, isContentReady } = useContentful<ContentfulResponse<PrivacyPolicyEntry>>({
    queryKey: ['privacy-policy', entryId],
    queryFn: async () => {
      try {
        const entry = await fetchContentfulEntry<ContentfulResponse<PrivacyPolicyEntry>>(entryId);
        console.log('Privacy policy content fetched for terms of use:', entry);
        return entry;
      } catch (error) {
        console.error('Error fetching privacy policy for terms of use:', error);
        throw error;
      }
    }
  });

  return (
    <Layout>
      <SEO 
        title="Terms of Use"
        description="Terms and conditions for using our services"
        type="article"
      />
      <div className="container-wide py-12">
        <h1 className="text-4xl font-bold text-vending-blue mb-8">Terms of Use</h1>
        
        <ContentfulErrorBoundary 
          contentType="Terms of Use" 
          fallback={
            <ContentfulFallbackMessage 
              message="There was an error displaying the terms of use." 
              contentType="Terms of Use"
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
              message={`Error loading terms of use: ${error.message}`} 
              contentType="Terms of Use"
              showRefresh={true}
            />
          ) : isContentReady && privacyPolicy?.fields?.termsOfUse ? (
            <div className="prose prose-lg max-w-none">
              {renderRichText(
                privacyPolicy.fields.termsOfUse,
                { includedAssets: privacyPolicy.includes?.Asset || [] }
              )}
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
              <h2 className="text-yellow-800 text-lg font-medium">Content Not Available</h2>
              <p className="text-yellow-700 mt-1">
                The Terms of Use content could not be loaded. Please check that the content has been published in Contentful.
              </p>
              <p className="text-sm text-yellow-600 mt-2">
                Looking for field "termsOfUse" in Privacy Policy content (ID: {entryId})
              </p>
            </div>
          )}
        </ContentfulErrorBoundary>
      </div>
    </Layout>
  );
};

export default TermsOfService;
