
import React from 'react';
import { BLOCKS, INLINES, MARKS, Document } from '@contentful/rich-text-types';
import { Options, documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Asset } from 'contentful';
import { Link } from 'react-router-dom';

interface RenderOptions {
  includedAssets?: Asset[];
}

/**
 * Renders Contentful rich text content with custom components
 */
export const renderRichText = (document: Document, options: RenderOptions = {}) => {
  if (!document) return null;
  
  const { includedAssets = [] } = options;
  
  // Find an asset by ID in the included assets
  const findAssetById = (id: string): Asset | undefined => {
    return includedAssets.find(asset => asset.sys.id === id);
  };
  
  // Create rendering options for the rich text renderer
  const renderOptions: Options = {
    renderMark: {
      [MARKS.BOLD]: (text) => <strong>{text}</strong>,
      [MARKS.ITALIC]: (text) => <em>{text}</em>,
      [MARKS.UNDERLINE]: (text) => <u>{text}</u>,
      [MARKS.CODE]: (text) => <code className="bg-gray-100 p-1 rounded font-mono text-sm">{text}</code>,
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, children) => <p className="mb-4">{children}</p>,
      [BLOCKS.HEADING_1]: (node, children) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
      [BLOCKS.HEADING_2]: (node, children) => <h2 className="text-2xl font-bold mt-8 mb-3">{children}</h2>,
      [BLOCKS.HEADING_3]: (node, children) => <h3 className="text-xl font-semibold mt-6 mb-3">{children}</h3>,
      [BLOCKS.HEADING_4]: (node, children) => <h4 className="text-lg font-semibold mt-5 mb-2">{children}</h4>,
      [BLOCKS.HEADING_5]: (node, children) => <h5 className="text-base font-semibold mt-4 mb-2">{children}</h5>,
      [BLOCKS.HEADING_6]: (node, children) => <h6 className="text-sm font-semibold mt-4 mb-2">{children}</h6>,
      [BLOCKS.UL_LIST]: (node, children) => <ul className="list-disc pl-10 mb-6">{children}</ul>,
      [BLOCKS.OL_LIST]: (node, children) => <ol className="list-decimal pl-10 mb-6">{children}</ol>,
      [BLOCKS.LIST_ITEM]: (node, children) => <li className="mb-1">{children}</li>,
      [BLOCKS.HR]: () => <hr className="my-8" />,
      [BLOCKS.QUOTE]: (node, children) => (
        <blockquote className="border-l-4 border-gray-200 pl-4 py-1 my-6 italic text-gray-700">
          {children}
        </blockquote>
      ),
      
      // Handle embedded assets
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const assetId = node.data?.target?.sys?.id;
        if (!assetId) return null;
        
        const asset = findAssetById(assetId);
        if (!asset || !asset.fields || !asset.fields.file) {
          console.warn('[richTextRenderer] Asset not found or invalid:', assetId);
          return null;
        }
        
        const { file, title, description } = asset.fields;
        const url = file.url;
        const contentType = file.contentType || '';
        
        // Handle images
        if (contentType.includes('image')) {
          return (
            <figure className="my-8">
              <img 
                src={`https:${url}`} 
                alt={description || title || 'Content image'} 
                className="rounded-lg max-w-full mx-auto"
              />
              {title && <figcaption className="text-center text-sm text-gray-500 mt-2">{title}</figcaption>}
            </figure>
          );
        }
        
        // Handle videos
        if (contentType.includes('video')) {
          return (
            <figure className="my-8">
              <video 
                controls 
                className="rounded-lg max-w-full mx-auto"
                title={title || 'Content video'}
              >
                <source src={`https:${url}`} type={contentType} />
                Your browser does not support the video tag.
              </video>
              {title && <figcaption className="text-center text-sm text-gray-500 mt-2">{title}</figcaption>}
            </figure>
          );
        }
        
        // Handle PDFs and other files
        return (
          <div className="my-6 p-4 border rounded-lg bg-gray-50">
            <a 
              href={`https:${url}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center"
            >
              📎 {title || 'Download file'}
            </a>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          </div>
        );
      },
      
      // Handle hyperlinks
      [INLINES.HYPERLINK]: (node, children) => {
        const { uri } = node.data;
        const isInternal = uri.startsWith('/') || uri.includes(window.location.hostname);
        
        if (isInternal) {
          // Handle internal links with React Router
          const path = uri.replace(/https?:\/\/[^/]+/, '');
          return <Link to={path} className="text-blue-600 hover:underline">{children}</Link>;
        }
        
        // External links
        return (
          <a 
            href={uri} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {children}
          </a>
        );
      },
      
      // Handle entry hyperlinks
      [INLINES.ENTRY_HYPERLINK]: (node, children) => {
        // Would need to implement entry resolution
        return <span className="text-blue-600">{children}</span>;
      },
    },
  };
  
  try {
    return documentToReactComponents(document, renderOptions);
  } catch (error) {
    console.error('[richTextRenderer] Error rendering rich text:', error);
    return <p className="text-red-500">Error rendering content. Please try again later.</p>;
  }
};
