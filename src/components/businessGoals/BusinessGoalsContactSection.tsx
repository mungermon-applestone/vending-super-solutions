
import React from 'react';
import ContactForm from '@/components/contact/ContactForm';

const BusinessGoalsContactSection = () => {
  return (
    <section className="py-16 bg-vending-blue-light bg-opacity-10">
      <div className="container mx-auto">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-vending-blue-dark">Need Help With Your Business Goals?</h2>
              <p className="text-gray-700">
                Our team is ready to assist you with achieving your specific business goals using our vending solutions.
              </p>
            </div>
            <ContactForm formSectionTitle="Send Us a Message" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessGoalsContactSection;
