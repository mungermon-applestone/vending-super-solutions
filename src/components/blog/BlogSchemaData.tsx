
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface BlogSchemaDataProps {
  breadcrumbItems: Array<{name: string; url: string; position: number}>;
  blogPosts?: Array<{
    title: string;
    description: string;
    datePublished: string;
    author: string;
    url: string;
  }>;
}

const BlogSchemaData: React.FC<BlogSchemaDataProps> = ({
  breadcrumbItems,
  blogPosts = []
}) => {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems
  };

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Vending Solutions Blog",
    "description": "Latest updates and insights about vending machine solutions",
    "url": "https://yourdomain.com/blog",
    "blogPost": blogPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.description,
      "datePublished": post.datePublished,
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "url": post.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(blogSchema)}
      </script>
    </Helmet>
  );
};

export default BlogSchemaData;
