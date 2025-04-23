
import React from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, MARKS, Document } from "@contentful/rich-text-types";
import Image from "@/components/common/Image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ContentfulBlogPostBodyProps {
  content?: Document;
  includedAssets?: any[];
}

const ContentfulBlogPostBody: React.FC<ContentfulBlogPostBodyProps> = ({ content, includedAssets = [] }) => {
  // For debugging
  React.useEffect(() => {
    if (content) {
      console.log("Blog post rich text content structure:", JSON.stringify(content, null, 2));
      console.log("Available included assets:", includedAssets);
    }
  }, [content, includedAssets]);

  const renderOptions = {
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
          console.log("Rendering embedded asset with ID:", assetId);
          
          if (!assetId) {
            console.error("Missing asset ID in embedded asset node");
            return null;
          }
          
          const asset = includedAssets?.find(asset => asset.sys.id === assetId);
          
          if (!asset) {
            console.error(`Asset not found for ID: ${assetId}`);
            return <div className="text-red-500">Image not found (ID: {assetId})</div>;
          }
          
          const { title, description, file } = asset.fields;
          const imageUrl = file?.url;
          
          if (!imageUrl) {
            console.error("Missing image URL in asset", asset);
            return <div className="text-red-500">Image URL not available</div>;
          }
          
          const fullUrl = imageUrl.startsWith('//') ? 
            `https:${imageUrl}` : 
            imageUrl.startsWith('http') ? imageUrl : `https:${imageUrl}`;
          
          console.log("Rendering image with URL:", fullUrl);
          
          return (
            <div className="my-6">
              <AspectRatio ratio={16/9} className="overflow-hidden rounded-md border border-gray-200">
                <Image 
                  src={fullUrl}
                  alt={description || title || "Blog image"} 
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
              {title && <p className="text-sm text-gray-500 mt-2">{title}</p>}
            </div>
          );
        } catch (err) {
          console.error("Error rendering embedded asset:", err);
          return <div className="text-red-500">Error rendering image</div>;
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

  return (
    <div className="prose max-w-none prose-slate mb-12">
      {content ? (
        documentToReactComponents(content, renderOptions)
      ) : (
        <p>No content available for this blog post.</p>
      )}
    </div>
  );
};

export default ContentfulBlogPostBody;
