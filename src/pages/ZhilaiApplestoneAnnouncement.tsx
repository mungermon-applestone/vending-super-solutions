
import React from 'react';
import { useContentfulBlogPostBySlug } from '@/hooks/useContentfulBlogPostBySlug';
import ContentfulBlogPostContent from '@/components/blog/ContentfulBlogPostContent';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import ContentfulInitializer from '@/components/blog/ContentfulInitializer';
import ContentfulFallbackMessage from '@/components/common/ContentfulFallbackMessage';
import { SimpleContactCTA } from '@/components/common';

// Interface for adjacent post navigation
interface AdjacentBlogPost {
  slug: string;
  title: string;
}

// Extract blog post info for navigation
const extractBlogInfo = (entry: any): AdjacentBlogPost | null => {
  if (!entry || !entry.fields || typeof entry.fields.slug !== 'string' || typeof entry.fields.title !== 'string') {
    return null;
  }
  
  return {
    slug: entry.fields.slug,
    title: entry.fields.title
  };
};

// Hook for getting adjacent posts
function useAdjacentContentfulPosts(currentSlug: string | undefined) {
  return useQuery({
    queryKey: ["contentful-adjacent-posts", currentSlug],
    enabled: !!currentSlug,
    queryFn: async () => {
      if (!currentSlug) return { previous: null, next: null };
      const client = await getContentfulClient();
      
      // Fetch all published posts sorted by publishDate descending (newest first)
      // This means "previous" is newer and "next" is older
      const response = await client.getEntries({
        content_type: "blogPost",
        order: ["-fields.publishDate"],
        select: ["fields.slug", "fields.title", "fields.publishDate"],
      });
      
      const posts = response.items || [];
      
      const idx = posts.findIndex(p => p.fields && p.fields.slug === currentSlug);
      if (idx === -1) return { previous: null, next: null };
      
      // Previous is a newer post (comes before in the sorted array)
      const previous = idx > 0 ? extractBlogInfo(posts[idx - 1]) : null;
      // Next is an older post (comes after in the sorted array)
      const next = idx < posts.length - 1 ? extractBlogInfo(posts[idx + 1]) : null;
      
      return { previous, next };
    }
  });
}

const ZhilaiApplestoneAnnouncement: React.FC = () => {
  return (
    <ContentfulInitializer
      fallback={
        <div className="container mx-auto p-4">
          <ContentfulFallbackMessage
            message="We're having trouble loading this announcement. Please configure Contentful in the Admin area."
            contentType="blog post"
            showRefresh={true}
          />
        </div>
      }
    >
      <AnnouncementContent />
    </ContentfulInitializer>
  );
};

const AnnouncementContent: React.FC = () => {
  const slug = 'zhilai-applestone-announcement';
  const { data: post, isLoading, error } = useContentfulBlogPostBySlug({ slug });
  const { data: adjacentPosts, isLoading: isLoadingAdjacent } = useAdjacentContentfulPosts(slug);

  if (isLoading || isLoadingAdjacent) return (
    <div className="container mx-auto py-16 flex justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
    </div>
  );

  if (error) return (
    <div className="container mx-auto p-4">
      <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-8">
        <h2 className="text-lg font-semibold text-red-700 mb-2">Error loading blog post</h2>
        <p className="text-red-600">{error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    </div>
  );
  
  if (!post) return (
    <div className="container mx-auto p-4">
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
        <h2 className="text-lg font-semibold mb-2">No post found</h2>
        <p>No blog post found for slug "{slug}"</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto py-8 flex-grow">        
        <ContentfulBlogPostContent 
          post={post} 
          previousPost={adjacentPosts?.previous}
          nextPost={adjacentPosts?.next}
        />
      </div>
      <SimpleContactCTA className="w-full mt-auto" />
    </div>
  );
};

export default ZhilaiApplestoneAnnouncement;
