
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import BlogPostCard from '@/components/blog/BlogPostCard';
import { useBlogPosts } from '@/hooks/useBlogData';

const POSTS_PER_PAGE = 9;

const BlogList = () => {
  const [page, setPage] = useState(0);
  
  const { data: blogPosts = [], isLoading, error } = useBlogPosts({ 
    status: 'published',
    limit: POSTS_PER_PAGE,
    offset: page * POSTS_PER_PAGE
  });

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Latest Updates</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Keep up with the latest news, insights, and updates from our team.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500">Something went wrong. Please try again later.</p>
          </div>
        ) : blogPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">No posts found. Check back soon for new updates!</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BlogList;
