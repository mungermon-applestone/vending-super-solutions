
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Check } from 'lucide-react';
import { trackEvent } from '@/utils/analytics';
import { createMailtoLink, formatEmailBody } from '@/services/email/emailService';
import { emailConfig } from '@/services/email/emailConfig';
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from '@/components/ui/spinner';

export interface ContactFormNewProps {
  /** Form title */
  formTitle?: string;
  /** Form description */
  description?: string;
  /** Callback function when form is submitted successfully */
  onSuccess?: () => void;
  /** Type of form for analytics tracking */
  formType?: string;
  /** URL to redirect after successful submission */
  redirectUrl?: string;
  /** Additional CSS classes */
  className?: string;
  /** Form variant (compact, full) */
  variant?: 'compact' | 'full';
  /** Initial values for form fields */
  initialValues?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    subject?: string;
    message?: string;
  };
}

/**
 * ContactFormNew Component
 * 
 * A contact form that uses AWS SES via Supabase Edge Function to send emails,
 * with fallback to mailto links if the API call fails.
 */
const ContactFormNew: React.FC<ContactFormNewProps> = ({
  formTitle = "Send us a message",
  description,
  onSuccess,
  formType = "Contact Form",
  redirectUrl,
  className = "",
  variant = "compact",
  initialValues = {}
}) => {
  const { toast } = useToast();
  const [name, setName] = useState(initialValues.name || '');
  const [email, setEmail] = useState(initialValues.email || '');
  const [phone, setPhone] = useState(initialValues.phone || '');
  const [company, setCompany] = useState(initialValues.company || '');
  const [subject, setSubject] = useState(initialValues.subject || '');
  const [message, setMessage] = useState(initialValues.message || '');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isFullVariant = variant === 'full';

  // Track form view when component mounts
  React.useEffect(() => {
    trackEvent('form_view', { 
      form_type: formType,
      location: window.location.pathname 
    });
  }, [formType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !message) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      // Track submission attempt
      trackEvent('form_submit', {
        form_type: formType,
        location: window.location.pathname
      });
      
      // Prepare form data
      const formData = {
        name,
        email,
        phone,
        company,
        subject,
        message,
        formType,
        location: window.location.href
      };
      
      // Call the new SES Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('send-contact-email-ses', {
        body: formData
      });
      
      if (error || (data && !data.success)) {
        console.error('Error submitting form:', error || data.error);
        
        // Track submission error
        trackEvent('form_submit_error', {
          form_type: formType,
          location: window.location.pathname,
          error: error?.message || (data?.error || 'Unknown error')
        });
        
        // If the error indicates we should fallback to mailto, do that
        if (data?.fallback) {
          handleMailtoFallback();
          return;
        }
        
        // Otherwise show a general error
        toast({
          title: "Error",
          description: "There was a problem sending your message. Please try again or contact us directly.",
          variant: "destructive",
        });
        
        setSubmitError("Failed to send message. Please try again or contact us directly.");
        return;
      }
      
      // If we got here, the submission was successful
      toast({
        title: "Message sent!",
        description: "Thank you for your message. We'll get back to you soon.",
      });
      
      // Track successful submission
      trackEvent('form_submit_success', {
        form_type: formType,
        location: window.location.pathname
      });
      
      // Set form to submitted state
      setSubmitted(true);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Redirect if URL provided
      if (redirectUrl) {
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 2000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Track submission error
      trackEvent('form_submit_error', {
        form_type: formType,
        location: window.location.pathname,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      // Fallback to mailto if API call fails
      handleMailtoFallback();
    } finally {
      setSubmitting(false);
    }
  };

  // Fallback to mailto if API call fails
  const handleMailtoFallback = () => {
    try {
      // Prepare email data
      const emailSubject = `${formType}: ${subject || 'Website Inquiry'}`;
      
      const formData = {
        name,
        email,
        ...(phone ? { phone } : {}),
        ...(company ? { company } : {}),
        message
      };
      
      const metadata = {
        'Sent from': window.location.href,
        'Form type': formType
      };
      
      const emailBody = formatEmailBody(formData, metadata);
      
      // Create and open mailto link
      const recipientEmail = emailConfig.defaultRecipient;
      const mailtoLink = createMailtoLink(emailSubject, emailBody, recipientEmail);
      
      // Open email client
      window.location.href = mailtoLink;
      
      // Show success message
      toast({
        title: "Message prepared",
        description: "Your email client has been opened with the message. Please send the email to complete your inquiry.",
      });
      
      // Track successful opening of email client
      trackEvent('form_submit_success', {
        form_type: formType,
        location: window.location.pathname,
        method: 'mailto'
      });
      
      // Set form to submitted state
      setSubmitted(true);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Redirect if URL provided
      if (redirectUrl) {
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 2000);
      }
    } catch (mailtoError) {
      console.error('Error preparing mailto fallback:', mailtoError);
      
      setSubmitError("We couldn't send your message or open your email client. Please contact us directly at " + emailConfig.defaultRecipient);
      
      toast({
        title: "Error",
        description: "We couldn't send your message or open your email client. Please contact us directly.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setSubject('');
    setMessage('');
    setSubmitted(false);
    setSubmitError(null);
  };

  return (
    <div className={`${className}`}>
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        {formTitle && <h2 className="text-2xl font-bold mb-4">{formTitle}</h2>}
        {description && <p className="text-gray-600 mb-6">{description}</p>}
        
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {isFullVariant ? (
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
                    disabled={submitting}
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
                    disabled={submitting}
                  />
                </div>
              </div>
            ) : (
              <>
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
                    disabled={submitting}
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
                    disabled={submitting}
                  />
                </div>
              </>
            )}
            
            {isFullVariant && (
              <>
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
                      disabled={submitting}
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
                      disabled={submitting}
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
                    disabled={submitting}
                  />
                </div>
              </>
            )}
            
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
                disabled={submitting}
              />
            </div>
            
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 text-sm">
                {submitError}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-vending-blue hover:bg-vending-blue-dark text-white font-semibold py-3"
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <Spinner size="sm" className="mr-2" />
                  Sending Message...
                </span>
              ) : 'Send Message'}
            </Button>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Message Sent!</h3>
            <p className="text-gray-600 mb-6">
              Thank you for your message. We'll get back to you as soon as possible.
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

export default ContactFormNew;
