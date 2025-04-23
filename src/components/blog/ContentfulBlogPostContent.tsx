
import React from "react";
import { ContentfulBlogPost } from "@/hooks/useContentfulBlogPostBySlug";
import ContentfulBlogPostHeader from "./ContentfulBlogPostHeader";
import ContentfulBlogPostBody from "./ContentfulBlogPostBody";
import ContentfulBlogPostFooter from "./ContentfulBlogPostFooter";

interface AdjacentBlogPost {
  slug: string;
  title: string;
}

interface ContentfulBlogPostContentProps {
  post: ContentfulBlogPost;
  previousPost?: AdjacentBlogPost | null;
  nextPost?: AdjacentBlogPost | null;
}

const ContentfulBlogPostContent: React.FC<ContentfulBlogPostContentProps> = ({
  post,
  previousPost,
  nextPost,
}) => {
  if (!post || !post.fields) {
    return <div>Error: Blog post data is missing</div>;
  }

  const { title = "Untitled", content, excerpt, publishDate, featuredImage } = post.fields;
  
  // Extract included assets from the response if available
  const includedAssets = post.includes?.Asset || [];
  
  // For debugging
  React.useEffect(() => {
    console.log("Post data:", post);
    console.log("Included assets:", includedAssets);
    if (includedAssets?.length) {
      includedAssets.forEach(asset => {
        console.log(`Asset ${asset.sys.id}:`, asset.fields);
      });
    }
  }, [post, includedAssets]);

  return (
    <article className="max-w-3xl mx-auto">
      <ContentfulBlogPostHeader
        title={title}
        publishDate={publishDate}
        featuredImage={featuredImage}
        excerpt={excerpt}
      />
      <ContentfulBlogPostBody 
        content={content} 
        includedAssets={includedAssets}
      />
      <ContentfulBlogPostFooter
        previousPost={previousPost}
        nextPost={nextPost}
      />
    </article>
  );
};

export default ContentfulBlogPostContent;
