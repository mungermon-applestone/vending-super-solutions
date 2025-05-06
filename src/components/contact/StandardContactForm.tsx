import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface StandardContactFormProps {
  formTitle?: string;
  formType?: 'contact' | 'demo' | 'inquiry';
  productInfo?: {
    name?: string;
    type?: string;
    id?: string;
  };
  hideFields?: string[];
  submitButtonText?: string;
  successMessage?: string;
  showCompany?: boolean;
  showPhone?: boolean;
  showSubject?: boolean;
  className?: string;
}

const StandardContactForm: React.FC<StandardContactFormProps> = ({
  formTitle = 'Send Us a Message',
  formType = 'contact',
  productInfo,
  hideFields = [],
  submitButtonText = 'Send Message',
  successMessage = 'Thank you for your message. We\'ll be in touch shortly.',
  showCompany = false,
  showPhone = false,
  showSubject = false,
  className = '',
}) => {
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  // Form submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const fullName = `${firstName} ${lastName}`.trim();
  
  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setCompany('');
    setPhone('');
    setSubject('');
    setMessage('');
    setSubmitted(false);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if ((!fullName && !hideFields.includes('name')) || !email || (!message && !hideFields.includes('message'))) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Prepare data with conditional fields
      const formData: Record<string, any> = {
        name: fullName || undefined,
        email,
        message: message || undefined,
        formType,
      };
      
      // Add optional fields if present
      if (company && showCompany) formData.company = company;
      if (phone && showPhone) formData.phone = phone;
      if (subject && showSubject) formData.subject = subject;
      
      // Add product info if available
      if (productInfo) {
        formData.productInfo = JSON.stringify(productInfo);
        formData.subject = formData.subject || `Inquiry about ${productInfo.name || 'product'}`;
      }
      
      console.log("Sending form data:", formData);
      
      // Send data to our API endpoint
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      
      // Show success message
      toast.success(successMessage);
      
      // Show success state
      setSubmitted(true);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("There was a problem sending your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 md:p-8 ${className}`}>
      <h2 className="text-2xl font-bold mb-6">{formTitle}</h2>
      
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {!hideFields.includes('name') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name*
                </label>
                <Input 
                  id="firstName" 
                  type="text" 
                  className="w-full" 
                  placeholder="John" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required 
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name*
                </label>
                <Input 
                  id="lastName" 
                  type="text" 
                  className="w-full" 
                  placeholder="Doe" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required 
                />
              </div>
            </div>
          )}
          
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
          
          {showCompany && (
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <Input 
                id="company" 
                type="text" 
                className="w-full" 
                placeholder="Acme Inc." 
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          )}
          
          {showPhone && (
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <Input 
                id="phone" 
                type="tel" 
                className="w-full" 
                placeholder="(555) 555-5555" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          )}
          
          {showSubject && (
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
          )}
          
          {!hideFields.includes('message') && (
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
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-vending-blue hover:bg-vending-blue-dark text-white font-semibold py-3"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : submitButtonText}
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
            onClick={resetForm}
          >
            Send Another Message
          </Button>
        </div>
      )}
    </div>
  );
};

export default StandardContactForm;
