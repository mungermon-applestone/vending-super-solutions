
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ContentfulBlogPostContent from "@/components/blog/ContentfulBlogPostContent";
import { useContentfulBlogPostBySlug, ContentfulBlogPost } from "@/hooks/useContentfulBlogPostBySlug";
import { Loader2 } from "lucide-react";
import { getContentfulClient } from "@/services/cms/utils/contentfulClient";
import { useQuery } from "@tanstack/react-query";

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
      console.log('[useAdjacentContentfulPosts] Current slug:', currentSlug);
      
      if (!currentSlug) return { previous: null, next: null };
      const client = await getContentfulClient();
      
      // Fetch all published posts sorted by publishDate ascending
      const response = await client.getEntries({
        content_type: "blogPost",
        order: ["fields.publishDate"],
        select: ["fields.slug", "fields.title", "fields.publishDate"],
      });
      
      const posts = response.items || [];
      console.log('[useAdjacentContentfulPosts] Total posts:', posts.length);
      
      const idx = posts.findIndex(p => p.fields && p.fields.slug === currentSlug);
      console.log('[useAdjacentContentfulPosts] Current post index:', idx);
      
      if (idx === -1) return { previous: null, next: null };
      
      const previous = idx > 0 ? extractSafeBlogInfo(posts[idx - 1]) : null;
      const next = idx < posts.length - 1 ? extractSafeBlogInfo(posts[idx + 1]) : null;
      
      console.log('[useAdjacentContentfulPosts] Previous post:', previous);
      console.log('[useAdjacentContentfulPosts] Next post:', next);
      
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

  const { data: adjacentPosts, isLoading: isLoadingAdjacent } = useAdjacentContentfulPosts(slug);

  React.useEffect(() => {
    console.log('ContentfulBlogPostDetail - Current slug:', slug);
    console.log('ContentfulBlogPostDetail - Post data:', post);
    
    if (!isLoadingPost && !post) {
      console.error('No post found, navigating to not found');
      navigate("/not-found", { replace: true });
    }
  }, [post, slug, isLoadingPost, navigate]);

  const isLoading = isLoadingPost || isLoadingAdjacent;

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-16 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-8">
            <h2 className="text-lg font-semibold text-red-700 mb-2">Error loading blog post</h2>
            <p className="text-red-600">{error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!post) return null;

  return (
    <Layout>
      <div className="container mx-auto py-12">        
        <ContentfulBlogPostContent 
          post={post} 
          previousPost={adjacentPosts?.previous}
          nextPost={adjacentPosts?.next}
        />
      </div>
    </Layout>
  );
};

export default ContentfulBlogPostDetail;
