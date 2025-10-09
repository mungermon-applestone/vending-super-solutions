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
                Need help? Click the button below to open our support portal where you can submit tickets, track existing requests, and browse our knowledge base.
              </p>
            </div>

            {/* Jira Service Portal */}
            <div className="mt-8">
              {/* 
                TODO: Replace with your actual Jira Issue Collector script URL
                
                To get your collector URL:
                1. Go to Jira Service Management
                2. Navigate to Project settings > Issue collectors
                3. Create or edit a collector
                4. Copy the script src URL from the embed code
                
                It should look like:
                https://[your-domain].atlassian.net/s/[hash]/[collector-id]/[hash]/_.js?collectorId=xxxxx
              */}
              <JiraWidget 
                collectorUrl="https://applestonesolutions.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/azc3hx/b/8/c95134bc67d3a521bb3f4331beb9b804/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-US&collectorId=YOUR_COLLECTOR_ID"
                buttonText="Submit Support Ticket"
              />
              
              {/* Fallback direct link */}
              <div className="mt-8 pt-6 border-t text-center">
                <p className="text-sm text-muted-foreground">
                  Having trouble?{' '}
                  <a 
                    href="https://applestonesolutions.atlassian.net/servicedesk/customer/portal/1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Open support portal directly
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerSupportTicket;