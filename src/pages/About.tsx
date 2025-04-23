
import React from 'react';
import Layout from '@/components/layout/Layout';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS, Document } from '@contentful/rich-text-types';
import { Skeleton } from '@/components/ui/skeleton';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import Image from '@/components/common/Image';
import ContentfulErrorBoundary from '@/components/common/ContentfulErrorBoundary';
import useContentful from '@/hooks/useContentful';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ContentfulAsset, ContentfulResponse, AboutPageFields, ContentfulRichTextDocument } from '@/types/contentful';

const About = () => {
  const { data, isLoading, error, isContentReady } = useContentful<ContentfulResponse<AboutPageFields>>({
    queryKey: ['about', '3Dn6DWVQR0VzhcQL6gdU0H'],
    queryFn: async () => {
      const client = await getContentfulClient();
      
      const response = await client.getEntry('3Dn6DWVQR0VzhcQL6gdU0H', {
        include: 3, // Increase to level 3 to ensure deeply nested references are resolved
      });
      
      console.log('Raw Contentful About page response:', JSON.stringify(response, null, 2));
      
      return response as unknown as ContentfulResponse<AboutPageFields>;
    }
  });

  // Enhanced debug logging for About page
  React.useEffect(() => {
    if (data) {
      console.log('About page data structure:', data);
      
      if (data.fields && "bodyContent" in data.fields) {
        console.log('About page bodyContent structure:', (data.fields as AboutPageFields).bodyContent);
      } else {
        console.log('No bodyContent found in data.fields:', data.fields);
      }
      
      // Additional specific logging for the image with ID 5G5dFI3gxzO5NPxjnyGzNG
      if (data.includes?.Asset) {
        console.log('Found assets in includes:', data.includes.Asset.length);
        const targetImage = data.includes.Asset.find(asset => asset.sys.id === '5G5dFI3gxzO5NPxjnyGzNG');
        if (targetImage) {
          console.log('Found the specific image (5G5dFI3gxzO5NPxjnyGzNG):', targetImage);
          console.log('Image URL:', targetImage.fields.file?.url);
          console.log('Image title:', targetImage.fields.title);
        } else {
          console.log('Image with ID 5G5dFI3gxzO5NPxjnyGzNG NOT found in includes. Available asset IDs:');
          data.includes.Asset.forEach(asset => {
            console.log(`- ${asset.sys.id}: ${asset.fields.title || 'No title'}`);
          });
        }
      } else {
        console.log('No assets found in includes');
      }
    }
  }, [data]);

  const richTextOptions = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, children) => <p className="mb-4">{children}</p>,
      [BLOCKS.HEADING_1]: (node, children) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
      [BLOCKS.HEADING_2]: (node, children) => <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>,
      [BLOCKS.HEADING_3]: (node, children) => <h3 className="text-xl font-bold mt-5 mb-2">{children}</h3>,
      [BLOCKS.HEADING_4]: (node, children) => <h4 className="text-lg font-bold mt-4 mb-2">{children}</h4>,
      [BLOCKS.HEADING_5]: (node, children) => <h5 className="text-base font-bold mt-3 mb-1">{children}</h5>,
      [BLOCKS.HEADING_6]: (node, children) => <h6 className="text-sm font-bold mt-3 mb-1">{children}</h6>,
      [BLOCKS.UL_LIST]: (node, children) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
      [BLOCKS.OL_LIST]: (node, children) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
      [BLOCKS.LIST_ITEM]: (node, children) => <li className="mb-1">{children}</li>,
      [BLOCKS.QUOTE]: (node, children) => (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">{children}</blockquote>
      ),
      [BLOCKS.HR]: () => <hr className="my-6 border-t border-gray-300" />,
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        try {
          const assetId = node.data?.target?.sys?.id;
          console.log('Rendering embedded asset with ID:', assetId);
          
          // Special case for the specific asset ID
          if (assetId === '5G5dFI3gxzO5NPxjnyGzNG') {
            console.log('Found our target image ID in the rich text content!');
          }
          
          if (!assetId || !data?.includes?.Asset) {
            console.error('Missing asset ID or includes.Asset array');
            return <div className="text-red-500">Image reference error</div>;
          }
          
          const asset = data.includes.Asset.find(a => a.sys.id === assetId);
          
          if (!asset) {
            console.error('Asset not found for ID:', assetId);
            
            // Check if this is our target asset and log more details
            if (assetId === '5G5dFI3gxzO5NPxjnyGzNG') {
              console.error('The specific image we are looking for was not found in includes!');
              
              // Log available assets
              if (data.includes?.Asset?.length) {
                console.log('Available assets:', data.includes.Asset.map(a => ({
                  id: a.sys.id,
                  title: a.fields.title
                })));
              }
            }
            
            return <div className="text-red-500">Image not found (ID: {assetId})</div>;
          }
          
          const { title, file } = asset.fields;
          if (!file || !file.url) {
            console.error('Asset file or URL missing:', asset);
            return <div className="text-red-500">Image file data missing</div>;
          }
          
          const imageUrl = file.url;
          console.log(`Rendering image ${assetId} with URL:`, imageUrl);
          
          // Ensure URL has protocol
          const fullUrl = imageUrl.startsWith('//') ? 
            `https:${imageUrl}` : 
            imageUrl.startsWith('http') ? imageUrl : `https:${imageUrl}`;
          
          return (
            <div className="my-8">
              <AspectRatio ratio={16/9} className="overflow-hidden rounded-md border border-gray-200">
                <Image 
                  src={fullUrl}
                  alt={title || 'About image'}
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
              {title && <p className="text-sm text-gray-500 mt-2">{title}</p>}
            </div>
          );
        } catch (err) {
          console.error('Error in renderAsset:', err);
          return <div className="text-red-500">Error rendering asset: {String(err)}</div>;
        }
      },
      [INLINES.HYPERLINK]: (node, children) => (
        <a 
          href={node.data.uri} 
          className="text-blue-600 hover:underline" 
          target={node.data.uri.startsWith('http') ? '_blank' : '_self'} 
          rel="noopener noreferrer"
        >
          {children}
        </a>
      ),
    },
    renderMark: {
      [MARKS.BOLD]: (text) => <strong>{text}</strong>,
      [MARKS.ITALIC]: (text) => <em>{text}</em>,
      [MARKS.UNDERLINE]: (text) => <u>{text}</u>,
      [MARKS.CODE]: (text) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{text}</code>,
    },
  };

  // Process data after it's loaded
  const processedData: AboutPageFields = React.useMemo(() => {
    return data?.fields ? (data.fields as AboutPageFields) : {};
  }, [data]);

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-12">
        <h1 className="text-4xl font-bold mb-8">About Us</h1>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : error ? (
          <div className="text-red-500">
            Error loading content: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        ) : (
          <ContentfulErrorBoundary contentType="About page">
            <div className="prose max-w-none">
              {isContentReady && processedData.bodyContent && (
                <>{documentToReactComponents(processedData.bodyContent as Document, richTextOptions)}</>
              )}
              {isContentReady && !processedData.bodyContent && (
                <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-md">
                  <p>The About page content was loaded, but no body content was found.</p>
                </div>
              )}
            </div>
          </ContentfulErrorBoundary>
        )}
      </div>
    </Layout>
  );
};

export default About;
