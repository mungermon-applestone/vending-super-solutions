
import React from 'react';
import { useContentfulBlogPostBySlug } from '@/hooks/useContentfulBlogPostBySlug';

const ZhilaiApplestoneAnnouncement: React.FC = () => {
  const slug = 'zhilai-applestone-announcement';
  const { data: post, isLoading, error } = useContentfulBlogPostBySlug({ slug });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error instanceof Error ? error.message : 'Unknown error'}</div>;

  // Display everything raw for debugging.
  return (
    <div>
      <h1>/zhilai-applestone-announcement (Raw Content)</h1>
      {post ? (
        <pre>{JSON.stringify(post, null, 2)}</pre>
      ) : (
        <div>No post found for slug "{slug}"</div>
      )}
    </div>
  );
};

export default ZhilaiApplestoneAnnouncement;
