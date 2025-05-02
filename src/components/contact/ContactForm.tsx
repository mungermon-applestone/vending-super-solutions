
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';

interface ContactFormProps {
  formSectionTitle?: string;
}

const ContactForm = ({ formSectionTitle }: ContactFormProps) => {
  return (
    <div className="flex-1">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-6">{formSectionTitle || 'Send Us a Message'}</h2>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <Input 
                id="name" 
                type="text" 
                className="w-full" 
                placeholder="John Doe" 
                required 
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <Input 
                id="email" 
                type="email" 
                className="w-full" 
                placeholder="john@example.com" 
                required 
              />
            </div>
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <Input 
              id="subject" 
              type="text" 
              className="w-full" 
              placeholder="How can we help?" 
              required 
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea 
              id="message" 
              rows={5} 
              className="w-full border border-input bg-background px-3 py-2 text-base ring-offset-background rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
              placeholder="Tell us about your project or inquiry..." 
              required 
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-vending-blue hover:bg-vending-blue-dark text-white font-semibold py-3"
          >
            Send Message
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
