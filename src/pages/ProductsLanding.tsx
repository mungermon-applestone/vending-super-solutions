
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';

const ProductsLanding: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-16">
        <h1 className="text-3xl font-bold text-center mb-6">Our Products</h1>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Discover our range of products designed to meet your business needs
        </p>
        
        <div className="flex justify-center">
          <div className="space-y-6 max-w-md">
            <div className="p-6 border rounded-lg bg-card">
              <h2 className="text-xl font-semibold mb-2">Products Coming Soon</h2>
              <p className="text-muted-foreground mb-4">
                We're currently working on our products section. Please check back later or explore our technology offerings.
              </p>
              <Link 
                to="/technology"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                View Technology Solutions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsLanding;
