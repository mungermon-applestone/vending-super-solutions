
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Check } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { showSuccess, showError } from '@/utils/notification';

interface ContactFormProps {
  formSectionTitle?: string;
}

const ContactForm = ({ formSectionTitle }: ContactFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !message) {
      showError("Please fill in all required fields");
      return;
    }
    
    setSubmitting(true);
    
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
          subject,
          message,
          formType: 'Contact Form'
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Form submission error:', data);
        throw new Error(data.error || 'Failed to send message');
      }
      
      // Show success message
      showSuccess("Thank you for your message. We'll respond as soon as possible.");
      console.log('Contact form submitted successfully:', data);
      
      // Reset form and show success state
      setSubmitted(true);
    } catch (error) {
      console.error('Error sending message:', error);
      showError("There was a problem sending your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setSubmitted(false);
  };

  return (
    <div className="flex-1">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-6">{formSectionTitle || 'Send Us a Message'}</h2>
        
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name*
                </label>
                <Input 
                  id="name" 
                  type="text" 
                  className="w-full" 
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address*
                </label>
                <Input 
                  id="email" 
                  type="email" 
                  className="w-full" 
                  placeholder="john@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message*
              </label>
              <Textarea 
                id="message" 
                rows={5} 
                className="w-full" 
                placeholder="Tell us about your project or inquiry..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required 
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-vending-blue hover:bg-vending-blue-dark text-white font-semibold py-3"
              disabled={submitting}
            >
              {submitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Message Sent!</h3>
            <p className="text-gray-600 mb-6">
              Thank you for reaching out. We'll get back to you at {email} as soon as possible.
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
  );
};

export default ContactForm;
