
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useBlogPosts } from '@/hooks/useBlogData';
import { BlogPost } from '@/types/cms';
import { format } from 'date-fns';
import { Pagination } from '@/components/ui/pagination';

const POSTS_PER_PAGE = 10;

const BlogList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const offset = (currentPage - 1) * POSTS_PER_PAGE;
  
  const { data, isLoading, error } = useBlogPosts({
    status: 'published',
    limit: POSTS_PER_PAGE,
    offset
  });
  
  const totalPages = data ? Math.ceil(data.total / POSTS_PER_PAGE) : 0;
  const blogPosts = data?.posts || [];
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        
        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-700 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-medium">Error loading blog posts</h3>
            <p>Please try again later.</p>
          </div>
        )}
        
        {!isLoading && !error && blogPosts.length > 0 ? (
          <div className="grid gap-12">
            {blogPosts.map((post: BlogPost) => (
              <div key={post.id} className="border-b pb-10">
                <div className="mb-4">
                  <span className="text-sm text-gray-600">
                    {post.publishedDate ? format(new Date(post.publishedDate), 'MMMM d, yyyy') : 'Draft'}
                  </span>
                  {post.category && (
                    <span className="ml-3 bg-blue-50 text-blue-700 py-1 px-2 rounded text-xs font-medium">
                      {post.category}
                    </span>
                  )}
                </div>
                
                <h2 className="text-2xl font-bold mb-3">
                  <Link to={`/blog/${post.slug}`} className="text-blue-600 hover:text-blue-800">
                    {post.title}
                  </Link>
                </h2>
                
                {post.summary && <p className="text-gray-700 mb-4">{post.summary}</p>}
                
                <Link 
                  to={`/blog/${post.slug}`} 
                  className="text-blue-600 hover:underline font-medium"
                >
                  Read more →
                </Link>
              </div>
            ))}
          </div>
        ) : !isLoading && !error ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-600 mb-2">No posts yet</h3>
            <p className="text-gray-500">Check back soon for new content!</p>
          </div>
        ) : null}
        
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
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
