
import React from "react";
import { ContentfulBlogPost } from "@/hooks/useContentfulBlogPostBySlug";
import ContentfulBlogPostHeader from "./ContentfulBlogPostHeader";
import ContentfulBlogPostBody from "./ContentfulBlogPostBody";
import ContentfulBlogPostFooter from "./ContentfulBlogPostFooter";
import ContentfulErrorBoundary from "@/components/common/ContentfulErrorBoundary";

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
    console.error("[ContentfulBlogPostContent] Missing or invalid post data:", post);
    return (
      <ContentfulErrorBoundary contentType="blog post">
        <div>Error: Blog post data is missing or invalid</div>
      </ContentfulErrorBoundary>
    );
  }

  const { title = "Untitled", content, excerpt, publishDate, featuredImage } = post.fields;
  
  // Extract included assets from the response if available
  const includedAssets = post.includes?.Asset || [];
  
  // Enhanced debugging
  React.useEffect(() => {
    console.log("[ContentfulBlogPostContent] Rendering post:", {
      title,
      hasContent: !!content,
      assetCount: includedAssets.length,
      publishDate,
    });
    
    if (includedAssets?.length) {
      includedAssets.forEach(asset => {
        console.log(`[ContentfulBlogPostContent] Asset ${asset.sys.id}:`, asset.fields);
      });
    }
  }, [post, includedAssets, title, content, publishDate]);

  return (
    <ContentfulErrorBoundary contentType="blog post">
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
    </ContentfulErrorBoundary>
  );
};

export default ContentfulBlogPostContent;
