
import React from 'react';
import Layout from "@/components/layout/Layout";
import { useContentful } from '@/hooks/useContentful';
import { fetchContentfulEntries } from '@/services/cms/utils/contentfulClient';
import { ContentfulErrorBoundary, ContentfulFallbackMessage } from '@/components/common';
import { renderRichText } from '@/utils/contentful/richTextRenderer';
import { Document } from '@contentful/rich-text-types';
import { Spinner } from '@/components/ui/spinner';
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
    privacyMainText?: Document;
    title?: string;
  };
  includes?: {
    Asset?: any[];
  };
}

const PrivacyPolicy = () => {
  const { data: privacyEntries, isLoading, error, isContentReady } = useContentful<PrivacyPolicyEntry[]>({
    queryKey: ['privacy-policy-content'],
    queryFn: async () => {
      try {
        console.log('[PrivacyPolicy] Fetching privacy policy content by content type');
        const entries = await fetchContentfulEntries<PrivacyPolicyEntry>('privacyPolicy');
        console.log('[PrivacyPolicy] Fetched entries:', entries);
        return entries;
      } catch (error) {
        console.error('[PrivacyPolicy] Error fetching privacy policy:', error);
        throw error;
      }
    }
  });

  // Get the first privacy policy entry (there should typically be only one)
  const privacyContent = privacyEntries && privacyEntries.length > 0 ? privacyEntries[0] : null;

  return (
    <Layout>
      <SEO 
        title="Privacy Policy"
        description="Privacy policy for our services"
        type="article"
      />
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
          ) : isContentReady && privacyContent?.fields?.privacyMainText ? (
            <div className="prose prose-lg max-w-none">
              {renderRichText(
                privacyContent.fields.privacyMainText,
                { includedAssets: privacyContent.includes?.Asset || [] }
              )}
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
              <h2 className="text-yellow-800 text-lg font-medium">Content Not Available</h2>
              <p className="text-yellow-700 mt-1">
                The Privacy Policy content could not be loaded. Please ensure that:
              </p>
              <ul className="text-yellow-700 mt-2 list-disc list-inside">
                <li>A Privacy Policy entry has been created in Contentful</li>
                <li>The content has been published</li>
                <li>The "privacyMainText" field contains content</li>
              </ul>
            </div>
          )}
        </ContentfulErrorBoundary>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
