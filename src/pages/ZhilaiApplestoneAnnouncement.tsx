
import React from 'react';
import { useContentfulBlogPostBySlug } from '@/hooks/useContentfulBlogPostBySlug';
import Layout from '@/components/layout/Layout';
import ContentfulBlogPostContent from '@/components/blog/ContentfulBlogPostContent';
import { Loader2 } from 'lucide-react';

const ZhilaiApplestoneAnnouncement: React.FC = () => {
  const slug = 'zhilai-applestone-announcement';
  const { data: post, isLoading, error } = useContentfulBlogPostBySlug({ slug });

  if (isLoading) return (
    <Layout>
      <div className="container mx-auto py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    </Layout>
  );

  if (error) return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-8">
          <h2 className="text-lg font-semibold text-red-700 mb-2">Error loading blog post</h2>
          <p className="text-red-600">{error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    </Layout>
  );
  
  if (!post) return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">No post found</h2>
          <p>No blog post found for slug "{slug}"</p>
        </div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="container mx-auto py-8">        
        <div className="mb-8">
          <ContentfulBlogPostContent post={post} />
        </div>
      </div>
    </Layout>
  );
};

export default ZhilaiApplestoneAnnouncement;
