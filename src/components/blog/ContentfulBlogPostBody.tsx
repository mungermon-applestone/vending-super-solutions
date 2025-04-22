
import React from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { Document } from "@contentful/rich-text-types";

interface ContentfulBlogPostBodyProps {
  content?: Document;
}

const ContentfulBlogPostBody: React.FC<ContentfulBlogPostBodyProps> = ({ content }) => (
  <div className="prose max-w-none prose-slate mb-12">
    {content
      ? documentToReactComponents(content)
      : <p>No content available for this blog post.</p>
    }
  </div>
);

export default ContentfulBlogPostBody;
