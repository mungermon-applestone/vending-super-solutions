
import React from 'react';
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from '@/components/common/Image';
import { ContentfulAsset } from '@/types/contentful';

// Helper function to normalize Contentful URLs
export const normalizeContentfulUrl = (url: string): string => {
  if (!url) return '';
  return url.startsWith('//') 
    ? `https:${url}` 
    : url.startsWith('http') ? url : `https:${url}`;
};

// Helper to find an asset using multiple strategies
export const findContentfulAsset = (
  assetId: string,
  includedAssets: ContentfulAsset[],
  contentIncludes?: { Asset?: ContentfulAsset[] },
  nodeData?: any
): ContentfulAsset | null => {
  // Strategy 1: Direct lookup in includedAssets
  let asset = includedAssets.find(a => a.sys.id === assetId);

  // Strategy 2: Check node data for direct file references
  if (!asset && nodeData?.target?.fields?.file) {
    asset = {
      sys: { id: assetId },
      fields: nodeData.target.fields
    };
  }

  // Strategy 3: Look through content includes
  if (!asset && contentIncludes?.Asset) {
    asset = contentIncludes.Asset.find(a => 
      a.sys.id === assetId || 
      a.fields.file?.url?.includes(assetId)
    );
  }

  return asset || null;
};

interface RichTextRendererOptions {
  includedAssets: ContentfulAsset[];
  contentIncludes?: { Asset?: ContentfulAsset[] };
}

export const getRichTextRenderOptions = ({ includedAssets, contentIncludes }: RichTextRendererOptions) => ({
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, children: React.ReactNode) => (
      <p className="mb-4">{children}</p>
    ),
    [BLOCKS.HEADING_1]: (node: any, children: React.ReactNode) => (
      <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node: any, children: React.ReactNode) => (
      <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node: any, children: React.ReactNode) => (
      <h3 className="text-xl font-bold mt-5 mb-2">{children}</h3>
    ),
    [BLOCKS.HEADING_4]: (node: any, children: React.ReactNode) => (
      <h4 className="text-lg font-bold mt-4 mb-2">{children}</h4>
    ),
    [BLOCKS.HEADING_5]: (node: any, children: React.ReactNode) => (
      <h5 className="text-base font-bold mt-3 mb-1">{children}</h5>
    ),
    [BLOCKS.HEADING_6]: (node: any, children: React.ReactNode) => (
      <h6 className="text-sm font-bold mt-3 mb-1">{children}</h6>
    ),
    [BLOCKS.UL_LIST]: (node: any, children: React.ReactNode) => (
      <ul className="list-disc pl-6 mb-4">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node: any, children: React.ReactNode) => (
      <ol className="list-decimal pl-6 mb-4">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node: any, children: React.ReactNode) => (
      <li className="mb-1">{children}</li>
    ),
    [BLOCKS.QUOTE]: (node: any, children: React.ReactNode) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">{children}</blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="my-6 border-t border-gray-300" />,
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      try {
        const assetId = node.data?.target?.sys?.id;
        
        if (!assetId) {
          console.error('Missing asset ID in embedded asset node');
          return <div className="text-red-500">Image reference error (no ID)</div>;
        }

        const asset = findContentfulAsset(assetId, includedAssets, contentIncludes, node.data);
        
        if (!asset) {
          console.error(`Asset not found for ID: ${assetId}`);
          return <div className="text-red-500">Image not found (ID: {assetId})</div>;
        }

        const { title, file } = asset.fields;

        if (!file || !file.url) {
          console.error('Asset file or URL missing:', asset);
          return <div className="text-red-500">Image file data missing</div>;
        }

        const fullUrl = normalizeContentfulUrl(file.url);

        return (
          <div className="my-8">
            <AspectRatio ratio={16/9} className="overflow-hidden rounded-md border border-gray-200">
              <Image 
                src={fullUrl}
                alt={title || 'Content image'}
                className="w-full h-full object-cover"
              />
            </AspectRatio>
          </div>
        );
      } catch (err) {
        console.error('Error rendering embedded asset:', err);
        return <div className="text-red-500">Error rendering asset: {String(err)}</div>;
      }
    },
    [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => (
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
    [MARKS.BOLD]: (text: React.ReactNode) => <strong>{text}</strong>,
    [MARKS.ITALIC]: (text: React.ReactNode) => <em>{text}</em>,
    [MARKS.UNDERLINE]: (text: React.ReactNode) => <u>{text}</u>,
    [MARKS.CODE]: (text: React.ReactNode) => (
      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{text}</code>
    ),
  },
});

export const renderRichText = (
  content: any,
  options: RichTextRendererOptions
) => {
  return documentToReactComponents(content, getRichTextRenderOptions(options));
};
