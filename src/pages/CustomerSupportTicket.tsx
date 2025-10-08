import React from 'react';
import SEO from '@/components/seo/SEO';
import JiraWidget from '@/components/support/JiraWidget';
import CustomerLayout from '@/components/layout/CustomerLayout';

const CustomerSupportTicket = () => {
  return (
    <CustomerLayout>
      <SEO 
        title="Submit Support Ticket - Customer Portal"
        description="Submit a support request for assistance with your Applestone Solutions products"
      />
      
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-vending-blue-dark mb-4">
                Submit Support Ticket
              </h1>
              <p className="text-lg text-gray-600">
                Need help? Submit a support request and our team will get back to you quickly.
              </p>
            </div>

            {/* Jira Service Desk Widget */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <JiraWidget />
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerSupportTicket;