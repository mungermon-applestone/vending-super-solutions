
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
  singlePost?: {
    title: string;
    description: string;
    datePublished: string;
    author: string;
    url: string;
    image?: string;
    wordCount?: number;
  };
}

const BlogSchemaData: React.FC<BlogSchemaDataProps> = ({
  breadcrumbItems,
  blogPosts = [],
  singlePost
}) => {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      "position": item.position,
      "item": {
        "@id": item.url,
        "name": item.name
      }
    }))
  };

  const blogSchema = singlePost ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": singlePost.title,
    "description": singlePost.description,
    "datePublished": singlePost.datePublished,
    "author": {
      "@type": "Person",
      "name": singlePost.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Vending Solutions",
      "logo": {
        "@type": "ImageObject",
        "url": "https://yourdomain.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": singlePost.url
    },
    ...(singlePost.image && {
      "image": {
        "@type": "ImageObject",
        "url": singlePost.image
      }
    }),
    ...(singlePost.wordCount && {
      "wordCount": singlePost.wordCount
    })
  } : {
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
