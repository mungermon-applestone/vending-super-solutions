
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Loader2, ChevronLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useContentfulBlogPostBySlug, useContentfulAdjacentBlogPosts } from '@/hooks/cms';
import { SimpleContactCTA } from '@/components/common';
import { Button } from '@/components/ui/button';

const BlogPostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const { data: post, isLoading: isLoadingPost, error } = useContentfulBlogPostBySlug(slug);
  const { data: adjacentPosts, isLoading: isLoadingAdjacent } = useContentfulAdjacentBlogPosts(slug);
  
  const isLoading = isLoadingPost || isLoadingAdjacent;
  
  // Handle 404 for non-existent posts
  React.useEffect(() => {
    if (!isLoading && !post) {
      navigate('/not-found', { replace: true });
    }
  }, [post, isLoading, navigate]);

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        <div className="container mx-auto py-12 flex-grow px-4">
          <Button variant="outline" asChild className="mb-8">
            <Link to="/blog" className="flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to blog
            </Link>
          </Button>
          
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-500">Something went wrong. Please try again later.</p>
            </div>
          ) : post ? (
            <article className="max-w-3xl mx-auto">
              <header className="mb-8">
                {post.featured_image && (
                  <img 
                    src={post.featured_image} 
                    alt={post.title} 
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                )}
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
                {post.published_date && (
                  <div className="text-gray-600 mb-4">
                    Published on {new Date(post.published_date).toLocaleDateString()}
                  </div>
                )}
                {post.summary && (
                  <p className="text-xl text-gray-700 italic">{post.summary}</p>
                )}
              </header>
              
              <div className="prose max-w-none mb-12">
                {post.content}
              </div>
              
              <div className="border-t pt-8 mt-8">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  {adjacentPosts?.previous && (
                    <Button variant="outline" asChild className="flex-1">
                      <Link to={`/blog/${adjacentPosts.previous.slug}`}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        {adjacentPosts.previous.title}
                      </Link>
                    </Button>
                  )}
                  {adjacentPosts?.next && (
                    <Button variant="outline" asChild className="flex-1 text-right">
                      <Link to={`/blog/${adjacentPosts.next.slug}`}>
                        {adjacentPosts.next.title}
                        <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </article>
          ) : null}
        </div>
        
        <SimpleContactCTA 
          className="w-full mt-auto"
          title="Have Questions About This Article?"
          description="Our team is ready to help you implement these insights in your business."
          formType={`Blog Post: ${post?.title || slug}`}
          initialValues={{
            subject: `Question about: ${post?.title || slug}`
          }}
        />
      </div>
    </Layout>
  );
};

export default BlogPostDetail;
