
import React, { useState } from 'react';
import ContactForm from '@/components/contact/ContactForm';
import { Button } from '@/components/ui/button';
import { showSuccess, showError } from '@/utils/notification';
import { Textarea } from '@/components/ui/textarea';

interface BusinessGoalInquiryProps {
  title?: string;
  description?: string;
  bulletPoints?: string[];
  buttonText?: string;
  buttonUrl?: string;
  goalName?: string;
}

const BusinessGoalInquiry: React.FC<BusinessGoalInquiryProps> = ({
  title = "Need a Custom Solution?",
  description,
  goalName
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email) {
      showError('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Send data to our API endpoint
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          company,
          phone,
          subject: `Business Goal Inquiry: ${goalName || 'Custom Solution'}`,
          message,
          formType: 'Business Goal Inquiry'
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send inquiry');
      }
      
      // Show success message
      showSuccess('Your inquiry has been submitted successfully!');
      setIsSubmitted(true);
      
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      showError('There was a problem sending your inquiry. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleReset = () => {
    setName('');
    setEmail('');
    setCompany('');
    setPhone('');
    setMessage('');
    setIsSubmitted(false);
  };

  return (
    <section className="py-16 bg-vending-blue-light bg-opacity-10">
      <div className="container mx-auto">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-vending-blue-dark">{title}</h2>
              {description && (
                <p className="text-gray-700">{description}</p>
              )}
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              {!isSubmitted ? (
                <>
                  <h3 className="text-xl font-semibold mb-4">Send Us a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Name*
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vending-blue focus:border-vending-blue"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email*
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vending-blue focus:border-vending-blue"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
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
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-vending-blue focus:border-vending-blue"
                      />
                    </div>
                    <div>
                      <label htmlFor="inquiry-message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <Textarea
                        id="inquiry-message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full"
                        rows={4}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Message Sent!</h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for your interest. Our team will contact you shortly.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={handleReset}
                  >
                    Send Another Message
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessGoalInquiry;
