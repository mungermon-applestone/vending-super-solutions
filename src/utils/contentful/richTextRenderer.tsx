
import React from 'react';
import { BLOCKS, INLINES, MARKS, Document } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

interface RenderOptions {
  includedAssets?: any[];
}

/**
 * Render Contentful rich text to React components
 * @param document Contentful Rich Text document
 * @param options Rendering options
 * @returns React components
 */
export function renderRichText(document: Document, options: RenderOptions = {}) {
  // Extract assets from options
  const { includedAssets = [] } = options;
  
  // Create a map of asset IDs to assets for easy lookup
  const assetMap = includedAssets.reduce((map, asset) => {
    map[asset.sys.id] = asset;
    return map;
  }, {});
  
  const renderOptions = {
    renderMark: {
      [MARKS.BOLD]: (text) => <strong>{text}</strong>,
      [MARKS.ITALIC]: (text) => <em>{text}</em>,
      [MARKS.UNDERLINE]: (text) => <u>{text}</u>,
      [MARKS.CODE]: (text) => <code className="bg-gray-100 p-1 rounded">{text}</code>,
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, children) => <p className="mb-4">{children}</p>,
      [BLOCKS.HEADING_1]: (node, children) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
      [BLOCKS.HEADING_2]: (node, children) => <h2 className="text-2xl font-bold mb-3">{children}</h2>,
      [BLOCKS.HEADING_3]: (node, children) => <h3 className="text-xl font-bold mb-2">{children}</h3>,
      [BLOCKS.HEADING_4]: (node, children) => <h4 className="text-lg font-bold mb-2">{children}</h4>,
      [BLOCKS.HEADING_5]: (node, children) => <h5 className="text-base font-bold mb-2">{children}</h5>,
      [BLOCKS.HEADING_6]: (node, children) => <h6 className="text-sm font-bold mb-2">{children}</h6>,
      [BLOCKS.UL_LIST]: (node, children) => <ul className="list-disc pl-5 mb-4">{children}</ul>,
      [BLOCKS.OL_LIST]: (node, children) => <ol className="list-decimal pl-5 mb-4">{children}</ol>,
      [BLOCKS.LIST_ITEM]: (node, children) => <li className="mb-1">{children}</li>,
      [BLOCKS.QUOTE]: (node, children) => (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">{children}</blockquote>
      ),
      [BLOCKS.HR]: () => <hr className="my-6" />,
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const assetId = node.data.target.sys.id;
        const asset = assetMap[assetId];
        
        if (!asset) {
          console.warn(`Asset with ID ${assetId} not found in included assets`);
          return null;
        }
        
        const { title, description, file } = asset.fields;
        const { url, contentType } = file;
        
        // Handle different asset types
        if (contentType.startsWith('image/')) {
          return (
            <img
              src={url.startsWith('//') ? `https:${url}` : url}
              alt={description || title || 'Image'}
              className="max-w-full my-4 rounded"
            />
          );
        } else if (contentType.startsWith('video/')) {
          return (
            <video
              controls
              className="max-w-full my-4 rounded"
              title={title || 'Video'}
            >
              <source src={url.startsWith('//') ? `https:${url}` : url} type={contentType} />
              Your browser does not support the video tag.
            </video>
          );
        }
        
        // Fallback for other asset types
        return <a href={url} target="_blank" rel="noreferrer">{title || 'Download asset'}</a>;
      },
      [INLINES.HYPERLINK]: (node, children) => {
        const { uri } = node.data;
        return (
          <a 
            href={uri} 
            target={uri.startsWith('http') ? '_blank' : undefined}
            rel={uri.startsWith('http') ? 'noreferrer' : undefined}
            className="text-blue-600 hover:underline"
          >
            {children}
          </a>
        );
      },
      [INLINES.ENTRY_HYPERLINK]: (node, children) => {
        // This could be expanded to handle different types of linked entries
        return <span className="text-blue-600">{children}</span>;
      },
    },
  };
  
  return documentToReactComponents(document, renderOptions);
}
