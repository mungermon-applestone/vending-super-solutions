
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ContentfulBlogPostContent from "@/components/blog/ContentfulBlogPostContent";
import { useContentfulBlogPostBySlug, ContentfulBlogPost } from "@/hooks/useContentfulBlogPostBySlug";
import { Loader2 } from "lucide-react";
import { getContentfulClient } from "@/services/cms/utils/contentfulClient";
import { useQuery } from "@tanstack/react-query";
import { EntryCollection } from "contentful";

// Interface for adjacent post navigation
interface AdjacentBlogPost {
  slug: string;
  title: string;
}

// Type safety helper for extracting field data
const extractSafeBlogInfo = (entry: any): AdjacentBlogPost | null => {
  if (!entry || !entry.fields || typeof entry.fields.slug !== 'string' || typeof entry.fields.title !== 'string') {
    return null;
  }
  
  return {
    slug: entry.fields.slug,
    title: entry.fields.title
  };
};

// Hook for getting "previous" and "next" posts for navigation
function useAdjacentContentfulPosts(currentSlug: string | undefined) {
  return useQuery({
    queryKey: ["contentful-adjacent-posts", currentSlug],
    enabled: !!currentSlug,
    queryFn: async () => {
      if (!currentSlug) return { previous: null, next: null };
      const client = await getContentfulClient();
      
      // Fetch all published posts sorted by publishDate ascending
      const response = await client.getEntries({
        content_type: "blogPost",
        order: ["fields.publishDate"],
        select: ["fields.slug", "fields.title", "fields.publishDate"],
      });
      
      const posts = response.items || [];
      
      const idx = posts.findIndex(p => p.fields && p.fields.slug === currentSlug);
      if (idx === -1) return { previous: null, next: null };
      
      // Create strongly typed objects for adjacent posts
      const previous = idx > 0 ? extractSafeBlogInfo(posts[idx - 1]) : null;
      const next = idx < posts.length - 1 ? extractSafeBlogInfo(posts[idx + 1]) : null;
      
      return { previous, next };
    }
  });
}

const ContentfulBlogPostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const {
    data: post,
    isLoading: isLoadingPost,
    error,
  } = useContentfulBlogPostBySlug({ slug });

  // Fetch prev/next posts based on publish date order (for navigation)
  const { data: adjacentPosts, isLoading: isLoadingAdjacent } = useAdjacentContentfulPosts(slug);

  React.useEffect(() => {
    if (!isLoadingPost && !post && slug) {
      navigate("/not-found", { replace: true });
    }
  }, [slug, post, isLoadingPost, navigate]);

  return (
    <Layout>
      <div className="container mx-auto py-12">
        {(isLoadingPost || isLoadingAdjacent) ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500">Something went wrong. Please try again later.</p>
            <div className="text-xs mt-4">{String(error)}</div>
          </div>
        ) : post ? (
          <ContentfulBlogPostContent
            post={post}
            previousPost={adjacentPosts?.previous}
            nextPost={adjacentPosts?.next}
          />
        ) : null}
      </div>
    </Layout>
  );
};

export default ContentfulBlogPostDetail;
