
import React from "react";
import { ContentfulBlogPost } from "@/hooks/useContentfulBlogPosts";
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
  if (!post) {
    console.error("[ContentfulBlogPostContent] Missing post data");
    return (
      <ContentfulErrorBoundary contentType="blog post">
        <div>Error: Blog post data is missing</div>
      </ContentfulErrorBoundary>
    );
  }

  const title = post.title || post.fields?.title || "Untitled";
  const content = post.content || post.fields?.content;
  const excerpt = post.excerpt || post.fields?.excerpt;
  const publishDate = post.publishDate || post.fields?.publishDate || post.published_at;
  const featuredImage = post.featuredImage || (post.fields?.featuredImage ? {
    url: `https:${post.fields.featuredImage.fields?.file?.url || ''}`,
    title: post.fields.featuredImage.fields?.title || '',
    width: post.fields.featuredImage.fields?.file?.details?.image?.width,
    height: post.fields.featuredImage.fields?.file?.details?.image?.height
  } : undefined);
  
  // Extract included assets from the response if available
  const includedAssets = post.includes?.Asset || [];
  
  // Enhanced debugging
  React.useEffect(() => {
    console.log("[ContentfulBlogPostContent] Rendering post:", {
      title,
      hasContent: !!content,
      assetCount: includedAssets?.length || 0,
      publishDate,
      featuredImage: !!featuredImage
    });
  }, [post, includedAssets, title, content, publishDate, featuredImage]);

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
