
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { trackEvent, trackFormView } from '@/utils/analytics';
import { sendEmail } from '@/services/email/emailAdapter';

interface InquiryFormProps {
  title?: string;
  description?: string;
  machineType?: string;
  formType?: string;
  initialValues?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    subject?: string;
    message?: string;
  }
}

const InquiryForm = ({ 
  title = "Request a Demo", 
  description = "Fill out the form below, and one of our representatives will contact you to arrange a personalized demo of our vending solutions.",
  machineType,
  formType = "Demo Request",
  initialValues = {}
}: InquiryFormProps) => {
  const { toast } = useToast();
  const [name, setName] = useState(initialValues.name || '');
  const [email, setEmail] = useState(initialValues.email || '');
  const [phone, setPhone] = useState(initialValues.phone || '');
  const [company, setCompany] = useState(initialValues.company || '');
  const [message, setMessage] = useState(initialValues.message || '');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Track form view when component mounts
  React.useEffect(() => {
    trackFormView(formType, window.location.pathname);
  }, [formType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Use our email adapter
      const subject = initialValues.subject || `${formType}${machineType ? ` - ${machineType}` : ''}`;
      
      const result = await sendEmail({
        name,
        email,
        phone,
        company,
        subject,
        message,
        formType,
        location: window.location.pathname
      });
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to send message');
      }
      
      // Show success message
      toast({
        title: "Request submitted!",
        description: "Thank you for your inquiry. We'll be in touch shortly.",
      });
      
      // Track successful submission
      trackEvent('form_submit_success', {
        form_type: formType,
        machine_type: machineType,
        location: window.location.pathname
      });
      
      // Reset form and show success state
      setSubmitted(true);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Track failed submission
      trackEvent('form_submit_error', {
        form_type: formType,
        machine_type: machineType,
        location: window.location.pathname,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setMessage('');
    setSubmitted(false);
  };

  return (
    <section className="bg-vending-blue-light py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {!submitted ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">{title}</h2>
                <p className="text-lg text-gray-600">{description}</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <Textarea 
                      id="message" 
                      rows={4} 
                      className="w-full" 
                      placeholder="Tell us about your specific requirements or questions..." 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-vending-blue hover:bg-vending-blue-dark text-white font-semibold py-3"
                    disabled={submitting}
                  >
                    {submitting ? 'Sending...' : 'Submit Request'}
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="text-center bg-white rounded-lg shadow-lg p-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Request Received!</h3>
              <p className="text-lg text-gray-600 mb-6">
                Thank you for your interest. One of our representatives will contact you shortly at {email}.
              </p>
              <Button 
                variant="outline" 
                onClick={handleReset}
              >
                Submit Another Request
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default InquiryForm;
