
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import BlogPostCard from '@/components/blog/BlogPostCard';
import { useBlogPosts } from '@/hooks/useBlogData';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Link } from 'react-router-dom';
import BlogSchemaData from '@/components/blog/BlogSchemaData';
import SEO from '@/components/seo/SEO';
import { useBreadcrumbs } from '@/context/BreadcrumbContext';
import { convertContentfulBlogPostToBlogPost } from '@/utils/contentfulTypeGuards';

const POSTS_PER_PAGE = 9;

const BlogList = () => {
  const [page, setPage] = useState(0);
  const { setBreadcrumbs } = useBreadcrumbs();
  
  // Get posts ordered by published_at in descending order (newest first)
  const { data: contentfulPosts = [], isLoading, error } = useBlogPosts();
  
  // Convert Contentful posts to blog post format
  const blogPosts = contentfulPosts.map(post => convertContentfulBlogPostToBlogPost(post));

  useEffect(() => {
    setBreadcrumbs([
      { name: "Home", url: "/", position: 1 },
      { name: "Blog", url: "/blog", position: 2 }
    ]);
  }, [setBreadcrumbs]);

  const breadcrumbItems = [
    { name: "Home", url: "https://yourdomain.com", position: 1 },
    { name: "Blog", url: "https://yourdomain.com/blog", position: 2 }
  ];

  return (
    <Layout>
      <SEO 
        title="Blog - Latest Updates and Insights"
        description="Explore our latest articles, insights, and updates about vending solutions and industry trends."
        canonicalUrl="https://yourdomain.com/blog"
      />
      <BlogSchemaData 
        breadcrumbItems={breadcrumbItems}
        blogPosts={blogPosts.map(post => ({
          title: post.title,
          description: post.excerpt || '',
          datePublished: post.published_at || '',
          author: 'Vending Solutions Team',
          url: `https://yourdomain.com/blog/${post.slug}`
        }))}
      />
      
      <div className="container mx-auto py-10">
        <nav aria-label="Breadcrumb" className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink aria-current="page">Blog</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </nav>

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
