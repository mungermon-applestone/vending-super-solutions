
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

const CaseStudyDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  
  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Case Study: {slug}</h1>
        <p>Details about this case study will appear here.</p>
      </div>
    </Layout>
  );
};

export default CaseStudyDetail;
