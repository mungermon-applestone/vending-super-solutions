
import React from 'react';

interface ContactFormProps {
  formSectionTitle?: string;
}

const ContactForm = ({ formSectionTitle }: ContactFormProps) => {
  return (
    <div className="flex-1">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-6">{formSectionTitle || 'Send Us a Message'}</h2>
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
  );
};

export default ContactForm;
