
import React from 'react';
import Layout from '@/components/layout/Layout';
import { getContentfulClient } from '@/services/cms/utils/contentfulClient';
import useContentful from '@/hooks/useContentful';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ContactPageContent {
  introTitle?: string;
  introDescription?: string;
  phoneCardTitle?: string;
  phoneNumber?: string;
  phoneAvailability?: string;
  emailCardTitle?: string;
  emailAddress?: string;
  emailResponseTime?: string;
  addressCardTitle?: string;
  address?: string;
  addressType?: string;
  formSectionTitle?: string;
  faqSectionTitle?: string;
  immediateAssistanceTitle?: string;
  immediateAssistanceDescription?: string;
  immediateAssistanceButtonText?: string;
}

const CONTACT_ID = '1iQrxg7rN4Dk17ZdxPxfhj';

const ContactContentful = () => {
  const { data, isLoading, error, isContentReady } = useContentful<any>({
    queryKey: ['contact-page-content', CONTACT_ID],
    queryFn: async () => {
      const client = await getContentfulClient();
      const entry = await client.getEntry(CONTACT_ID, { include: 2 });
      return entry.fields;
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-4xl mx-auto py-12">
          <Skeleton className="h-10 w-1/2 mb-4" />
          <Skeleton className="h-6 w-1/5 mb-2" />
          <Skeleton className="h-24 w-full mb-4" />
          <Skeleton className="h-6 w-1/2 mb-2" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container max-w-4xl mx-auto py-12 text-red-500">
          Error loading contact page: {error instanceof Error ? error.message : String(error)}
        </div>
      </Layout>
    );
  }

  const f = (data || {}) as ContactPageContent;

  return (
    <Layout>
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 py-16">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-vending-blue-dark mb-6">
                {f.introTitle || 'Get in Touch'}
              </h1>
              <p className="text-lg text-gray-700 mb-8 max-w-lg">
                {f.introDescription ||
                  'Have questions about our vending solutions? Ready to transform your retail operations? Contact our team today.'}
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-vending-blue-light bg-opacity-20 p-3 rounded-full h-12 w-12 mr-4 flex items-center justify-center text-vending-blue">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">{f.emailCardTitle || 'Email Us'}</h3>
                    <p className="text-gray-600">{f.emailAddress || 'support@applestonesolutions.com'}</p>
                    {f.emailResponseTime && (
                      <p className="text-gray-400 text-sm">{f.emailResponseTime}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-vending-blue-light bg-opacity-20 p-3 rounded-full h-12 w-12 mr-4 flex items-center justify-center text-vending-blue">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">{f.phoneCardTitle || 'Call Us'}</h3>
                    <p className="text-gray-600">{f.phoneNumber || '(555) 123-4567'}</p>
                    {f.phoneAvailability && (
                      <p className="text-gray-400 text-sm">{f.phoneAvailability}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-vending-blue-light bg-opacity-20 p-3 rounded-full h-12 w-12 mr-4 flex items-center justify-center text-vending-blue">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">{f.addressCardTitle || 'Visit Us'}</h3>
                    <p className="text-gray-600 whitespace-pre-line">{f.address || '123 Business Avenue\nSuite 200\nSan Francisco, CA 94107'}</p>
                    {f.addressType && (
                      <p className="text-gray-400 text-sm">{f.addressType}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Form */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6">{f.formSectionTitle || 'Send Us a Message'}</h2>
                {/* Simple form, non-functional */}
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input id="name" type="text" className="w-full border border-gray-300 rounded p-2" placeholder="John Doe" required />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input id="email" type="email" className="w-full border border-gray-300 rounded p-2" placeholder="john@example.com" required />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input id="subject" type="text" className="w-full border border-gray-300 rounded p-2" placeholder="How can we help?" required />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea id="message" rows={5} className="w-full border border-gray-300 rounded p-2" placeholder="Tell us about your project or inquiry..." required />
                  </div>
                  <button type="submit" className="w-full bg-vending-blue hover:bg-vending-blue-dark text-white font-semibold rounded py-3">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* FAQ Section */}
      <div className="py-16 container max-w-7xl mx-auto">
        {f.faqSectionTitle && (
          <h2 className="text-3xl font-bold text-center mb-12">{f.faqSectionTitle}</h2>
        )}
        {/* Fallback static FAQ if none from CMS */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-xl mb-2">What types of businesses use your vending solutions?</h3>
            <p className="text-gray-600">Our vending solutions are used by a wide range of businesses, including retail stores, grocers, hospitals, universities, corporate offices, and more.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-xl mb-2">How quickly can your solutions be deployed?</h3>
            <p className="text-gray-600">Depending on your specific needs, our solutions can typically be deployed within 2-6 weeks after the initial consultation and agreement.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-xl mb-2">Do you offer installation and maintenance services?</h3>
            <p className="text-gray-600">Yes, we provide complete installation services and offer various maintenance packages to ensure your vending machines operate optimally.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-xl mb-2">Can your vending machines be customized?</h3>
            <p className="text-gray-600">Absolutely! We offer customization options for branding, product selection, payment methods, and technology integration based on your business needs.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactContentful;
