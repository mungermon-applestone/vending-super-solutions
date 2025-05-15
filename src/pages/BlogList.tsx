
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import BlogCard from '@/components/blog/BlogCard';
import Pagination from '@/components/ui/pagination';
import { useContentfulBlogPosts } from '@/hooks/cms';
import { useSearchParams } from 'react-router-dom';

const BlogList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  
  const { data: blogPosts, isLoading, isError } = useContentfulBlogPosts();
  
  // Pagination logic
  const postsPerPage = 9;
  const totalPosts = blogPosts?.length || 0;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = blogPosts?.slice(startIndex, endIndex) || [];
  
  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <header className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Blog</h1>
          <p className="text-gray-600">
            Latest news, insights, and updates from our team
          </p>
        </header>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <p>Loading blog posts...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-10">
            <h3 className="text-xl font-medium text-red-600 mb-2">Error loading blog posts</h3>
            <p className="text-gray-600">Please try again later.</p>
          </div>
        ) : currentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <h3 className="text-xl font-medium mb-2">No blog posts found</h3>
            <p className="text-gray-600 mb-6">
              Check back later for new content.
            </p>
            <Link to="/" className="text-blue-600 hover:underline">
              Return to homepage
            </Link>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BlogList;
