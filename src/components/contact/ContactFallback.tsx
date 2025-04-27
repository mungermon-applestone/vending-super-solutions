
import React from 'react';
import Layout from '@/components/layout/Layout';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContactFallback = () => {
  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-12">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Contact Information Temporarily Unavailable</h2>
          <p className="mb-6">
            We're experiencing issues loading our contact information from our content management system.
            You can still reach us through our main channels below:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Email Us</h3>
              <p className="text-gray-600">contact@example.com</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Call Us</h3>
              <p className="text-gray-600">(555) 123-4567</p>
              <p className="text-sm text-gray-500 mt-1">Monday-Friday, 9am-5pm</p>
            </div>
          </div>
          
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ContactFallback;
