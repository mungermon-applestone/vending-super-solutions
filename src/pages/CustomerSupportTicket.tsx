import React from 'react';
import SEO from '@/components/seo/SEO';
import CustomerLayout from '@/components/layout/CustomerLayout';
import SupportRequestForm from '@/components/support/SupportRequestForm';

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
                Fill out this form to submit a support request.
              </p>
            </div>

            {/* Support Request Form */}
            <SupportRequestForm
              formTitle="Support Request"
              context={{
                customerPortal: true,
                pageUrl: window.location.href
              }}
              onSuccess={() => {
                console.log('Support request submitted successfully');
              }}
            />

          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerSupportTicket;