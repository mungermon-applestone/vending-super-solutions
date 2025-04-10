
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  
  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Blog Post: {slug}</h1>
        <p>The blog post content will appear here.</p>
      </div>
    </Layout>
  );
};

export default BlogPost;
