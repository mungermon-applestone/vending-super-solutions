
import React from 'react';
import { EmailLink } from '@/components/common';

const BusinessGoalsContactSection = () => {
  return (
    <section className="py-16 bg-vending-blue-light bg-opacity-10">
      <div className="container mx-auto">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-vending-blue-dark">Need Help With Your Business Goals?</h2>
              <p className="text-gray-700 mb-6">
                Our team is ready to assist you with achieving your specific business goals using our vending solutions.
              </p>
              <EmailLink 
                subject="Business Goals Inquiry" 
                buttonText="Email Us About Your Business Goals" 
                className="w-full md:w-auto"
              />
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <h3 className="text-xl font-bold mb-4">How We Can Help</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-vending-blue-dark mr-2">•</span>
                  <span>Custom vending solutions tailored to your business</span>
                </li>
                <li className="flex items-start">
                  <span className="text-vending-blue-dark mr-2">•</span>
                  <span>Expert consultation on implementation strategies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-vending-blue-dark mr-2">•</span>
                  <span>Ongoing support and optimization</span>
                </li>
                <li className="flex items-start">
                  <span className="text-vending-blue-dark mr-2">•</span>
                  <span>Data-driven insights to improve performance</span>
                </li>
              </ul>
              <div className="mt-6">
                <p className="text-gray-600 italic">
                  "Working with Applestone Solutions transformed how we manage our vending operations."
                </p>
                <p className="text-sm mt-2">— Jane D., Operations Manager</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessGoalsContactSection;
