
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useBreadcrumbs } from '@/context/BreadcrumbContext';
import BlogSchemaData from '@/components/blog/BlogSchemaData';
import SEO from '@/components/seo/SEO';
import { SimpleContactCTA } from '@/components/common';
import TranslatableText from '@/components/translation/TranslatableText';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { setBreadcrumbs } = useBreadcrumbs();
  
  useEffect(() => {
    setBreadcrumbs([
      { name: "Home", url: "/", position: 1 },
      { name: "Blog", url: "/blog", position: 2 },
      { name: slug || "Post", url: `/blog/${slug}`, position: 3 }
    ]);
  }, [setBreadcrumbs, slug]);

  const breadcrumbItems = [
    { name: "Home", url: "https://yourdomain.com", position: 1 },
    { name: "Blog", url: "https://yourdomain.com/blog", position: 2 },
    { name: slug || "Post", url: `https://yourdomain.com/blog/${slug}`, position: 3 }
  ];
  
  return (
    <Layout>
      <SEO 
        title={`${slug} - Blog Post`}
        description={`Read more about ${slug} in our blog.`}
        canonicalUrl={`https://yourdomain.com/blog/${slug}`}
      />
      <BlogSchemaData breadcrumbItems={breadcrumbItems} />
      
      <div className="container mx-auto py-10">
        <nav aria-label="Breadcrumb" className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">
                    <TranslatableText context="navigation">Home</TranslatableText>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/blog">
                    <TranslatableText context="navigation">Blog</TranslatableText>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink aria-current="page">{slug}</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </nav>

        <h1 className="text-3xl font-bold mb-6">
          <TranslatableText context="blog-post">Blog Post:</TranslatableText> {slug}
        </h1>
        <p>
          <TranslatableText context="blog-post">The blog post content will appear here.</TranslatableText>
        </p>

        <div className="mt-16">
          <SimpleContactCTA />
        </div>
      </div>
    </Layout>
  );
};

export default BlogPost;
