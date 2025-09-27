
import React from 'react';
import { useContentfulBlogPostBySlug } from '@/hooks/useContentfulBlogPostBySlug';
import TranslatableText from '@/components/translation/TranslatableText';

const BlogContentTest: React.FC = () => {
  // Using a hardcoded slug for testing purposes
  const { data: post, isLoading, error } = useContentfulBlogPostBySlug({ slug: 'test-blog-post' });

  if (isLoading) return <div><TranslatableText context="loading">Loading...</TranslatableText></div>;
  if (error) return <div><TranslatableText context="error">{error instanceof Error ? error.message : 'Unknown error'}</TranslatableText></div>;

  // Debugging: Log the entire post object to console
  console.log('Full post object:', post);

  // Basic rendering to show raw data
  return (
    <div>
      <h1>Blog Content Test</h1>
      {post ? (
        <div>
          <pre>{JSON.stringify(post, null, 2)}</pre>
          <h2>Raw Fields:</h2>
          <pre>{JSON.stringify(post.fields, null, 2)}</pre>
        </div>
      ) : (
        <div>No post found</div>
      )}
    </div>
  );
};

export default BlogContentTest;
