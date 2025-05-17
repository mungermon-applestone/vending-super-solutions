
import React from 'react';
import { Document } from '@contentful/rich-text-types';
import { Skeleton } from '@/components/ui/skeleton';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import ContentfulErrorBoundary from '@/components/common/ContentfulErrorBoundary';
import useContentful from '@/hooks/useContentful';
import { ContentfulResponse, AboutPageFields } from '@/types/contentful';
import { renderRichText } from '@/utils/contentful/richTextRenderer';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Link } from 'react-router-dom';
import AboutSchemaData from '@/components/about/AboutSchemaData';
import SEO from '@/components/seo/SEO';
import ContentfulFallbackMessage from '@/components/common/ContentfulFallbackMessage';

const About = () => {
  const { data, isLoading, error, isContentReady, refetch } = useContentful<ContentfulResponse<AboutPageFields>>({
    queryKey: ['about', '3Dn6DWVQR0VzhcQL6gdU0H'],
    queryFn: async () => {
      const client = await getContentfulClient();
      const response = await client.getEntry('3Dn6DWVQR0VzhcQL6gdU0H', {
        include: 10,
      });
      return response as unknown as ContentfulResponse<AboutPageFields>;
    }
  });

  const includedAssets = React.useMemo(() => {
    if (!data?.includes?.Asset) return [];
    return data.includes.Asset;
  }, [data?.includes?.Asset]);

  const breadcrumbItems = [
    { name: "Home", url: "https://yourdomain.com", position: 1 },
    { name: "About", url: "https://yourdomain.com/about", position: 2 }
  ];

  return (
    <>
      <SEO 
        title="About Us | Vending Solutions"
        description="Learn more about Vending Solutions and our mission to revolutionize vending machine operations."
        canonicalUrl="https://yourdomain.com/about"
      />
      <AboutSchemaData breadcrumbItems={breadcrumbItems} />
      
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <nav aria-label="Breadcrumb" className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink aria-current="page">About</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </nav>

        <h1 className="text-4xl font-bold mb-8">About Us</h1>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : error ? (
          <ContentfulFallbackMessage
            contentType="About page content"
            message="Unable to load the about page content. Please try again later or contact support if the problem persists."
            showRefresh={true}
            onAction={() => refetch()}
            title="Content Loading Error"
          />
        ) : (
          <ContentfulErrorBoundary contentType="About page">
            <div className="prose max-w-none">
              {isContentReady && data?.fields && 'bodyContent' in data.fields && data.fields.bodyContent ? (
                <>
                  {renderRichText(data.fields.bodyContent as Document, {
                    includedAssets,
                    contentIncludes: data.includes
                  })}
                </>
              ) : (
                <p className="text-gray-500">
                  No content available. Please check the Contentful entry for the About page.
                </p>
              )}
            </div>
          </ContentfulErrorBoundary>
        )}
      </div>
    </>
  );
};

export default About;
