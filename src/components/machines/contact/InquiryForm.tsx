
import React from 'react';
import { Button } from '@/components/ui/button';

interface InquiryFormProps {
  title: string;
}

const InquiryForm: React.FC<InquiryFormProps> = ({ title }) => {
  return (
    <section className="py-12 bg-white">
      <div className="container-wide max-w-4xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-2 text-vending-blue-dark">
              Interested in {title}?
            </h2>
            <p className="text-gray-600 mb-6">
              Complete the form below and one of our specialists will contact you with pricing and availability.
            </p>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vending-blue focus:border-vending-blue"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vending-blue focus:border-vending-blue"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vending-blue focus:border-vending-blue"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vending-blue focus:border-vending-blue"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vending-blue focus:border-vending-blue"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vending-blue focus:border-vending-blue"
                  placeholder="Tell us about your needs, deployment location, and any questions you have."
                ></textarea>
              </div>
              <div>
                <Button className="w-full">Submit Inquiry</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InquiryForm;
