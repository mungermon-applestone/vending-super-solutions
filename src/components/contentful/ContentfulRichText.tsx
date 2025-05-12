
import React from 'react';
import { Document } from '@contentful/rich-text-types';
import { renderRichText } from '@/utils/contentful/richTextRenderer';
import { ContentfulAsset } from '@/types/contentful';

interface ContentfulRichTextProps {
  content: Document | null | undefined;
  includedAssets?: ContentfulAsset[];
  className?: string;
}

/**
 * A standardized component for rendering Contentful Rich Text content
 * This component wraps the renderRichText utility to provide consistent rendering
 * across the application with proper error handling
 */
const ContentfulRichText: React.FC<ContentfulRichTextProps> = ({
  content,
  includedAssets = [],
  className = "prose max-w-none prose-slate"
}) => {
  if (!content) {
    return <p className="text-gray-500 italic">No content available.</p>;
  }

  try {
    return (
      <div className={className}>
        {renderRichText(content, { includedAssets })}
      </div>
    );
  } catch (error) {
    console.error('Error rendering Contentful rich text:', error);
    return (
      <div className="p-4 border border-red-200 rounded bg-red-50">
        <p className="text-red-700">There was an error rendering this content. Please check the console for more details.</p>
      </div>
    );
  }
};

export default ContentfulRichText;
