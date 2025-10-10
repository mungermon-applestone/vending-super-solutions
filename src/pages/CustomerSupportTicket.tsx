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
                Fill out this form to submit a support request. You can also track or manage existing tickets in our Support Portal.
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

            {/* Link to Support Portal for tracking */}
            <div className="mt-8 pt-6 border-t text-center">
              <p className="text-sm text-muted-foreground">
                Need to track existing tickets?{' '}
                <a 
                  href="https://applestonesolutions.atlassian.net/servicedesk/customer/portal/1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Visit our Support Portal
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerSupportTicket;