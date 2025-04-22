
import React from 'react';
import { useContentfulBlogPostBySlug } from '@/hooks/useContentfulBlogPostBySlug';
import Layout from '@/components/layout/Layout';
import ContentfulBlogPostContent from '@/components/blog/ContentfulBlogPostContent';
import { Loader2 } from 'lucide-react';

const ZhilaiApplestoneAnnouncement: React.FC = () => {
  const slug = 'zhilai-applestone-announcement';
  const { data: post, isLoading, error } = useContentfulBlogPostBySlug({ slug });

  if (isLoading) return (
    <div className="flex justify-center py-16">
      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
    </div>
  );

  if (error) return <div className="p-4">Error: {error instanceof Error ? error.message : 'Unknown error'}</div>;
  
  if (!post) return <div className="p-4">No post found for slug "{slug}"</div>;

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">Raw Content:</h1>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[300px] mb-8">
            {JSON.stringify(post, null, 2)}
          </pre>
        </div>
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">Formatted Content:</h1>
          <ContentfulBlogPostContent post={post} />
        </div>
      </div>
    </Layout>
  );
};

export default ZhilaiApplestoneAnnouncement;
