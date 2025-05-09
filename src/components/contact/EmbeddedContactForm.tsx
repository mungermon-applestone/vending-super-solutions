
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { trackEvent, trackFormView } from '@/utils/analytics';
import { sendEmail } from '@/services/email/emailAdapter';

/**
 * EmbeddedContactForm Component
 * 
 * IMPORTANT REGRESSION PREVENTION NOTES:
 * - This component provides a configurable contact form that can be embedded anywhere in the site
 * - The form maintains consistent styling with other form components but can be sized differently
 * - Form submissions are tracked in analytics for conversion monitoring
 * - Success/error states are handled with consistent UI patterns
 * 
 * Variants:
 * - "compact": Smaller form with fewer fields (name, email, message)
 * - "full": Complete form with all fields (name, email, phone, company, subject, message)
 * - "inline": Horizontally oriented form designed for footer/banner placement
 * 
 * @param {EmbeddedContactFormProps} props - Component properties
 * @returns React component
 */
export interface EmbeddedContactFormProps {
  /** The form's visual variant */
  variant?: 'compact' | 'full' | 'inline';
  /** Form section heading */
  title?: string;
  /** Additional context for the form section */
  description?: string;
  /** Type of the form for tracking and email templates */
  formType?: string;
  /** CSS class names for custom styling */
  className?: string;
  /** URL to redirect after successful submission */
  redirectUrl?: string;
  /** Callback function when form is submitted successfully */
  onSuccess?: () => void;
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

const EmbeddedContactForm: React.FC<EmbeddedContactFormProps> = ({
  variant = 'compact',
  title = 'Contact Us',
  description,
  formType = 'Embedded Contact Form',
  className = '',
  redirectUrl,
  onSuccess,
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

  // Track form view when the component mounts
  React.useEffect(() => {
    trackFormView(formType, window.location.pathname);
  }, [formType]);

  const isFullVariant = variant === 'full';
  const isInlineVariant = variant === 'inline';

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
      // Use our email adapter to send the form data
      const result = await sendEmail({
        name,
        email,
        phone: phone || undefined,
        company: company || undefined,
        subject: subject || `New ${formType} Submission`,
        message,
        formType,
        location: window.location.pathname
      });
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to send message');
      }
      
      // Show success message
      toast({
        title: "Message sent!",
        description: "Thank you for your message. We'll respond as soon as possible.",
      });
      
      // Reset form and show success state
      setSubmitted(true);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Redirect if URL provided
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
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
    setSubject('');
    setMessage('');
    setSubmitted(false);
  };
  
  // Keep existing code for form layout classes
  const formLayoutClass = isInlineVariant 
    ? 'flex flex-col md:flex-row gap-4 items-end' 
    : 'space-y-6';
  
  // Keep existing code for field layout classes
  const fieldLayoutClass = isInlineVariant
    ? 'flex-1'
    : '';

  return (
    <div className={`${className}`}>
      {!isInlineVariant && (
        <div className="mb-6">
          {title && <h3 className="text-2xl font-bold mb-2">{title}</h3>}
          {description && <p className="text-gray-600">{description}</p>}
        </div>
      )}
      
      {!submitted ? (
        <form onSubmit={handleSubmit} className={formLayoutClass}>
          {/* Name Field */}
          <div className={fieldLayoutClass}>
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
          
          {/* Email Field */}
          <div className={fieldLayoutClass}>
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
          
          {/* Show these fields only in full variant */}
          {isFullVariant && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone Field */}
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
                
                {/* Company Field */}
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
              
              {/* Subject Field */}
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
            </>
          )}
          
          {/* Message Field - Don't show in inline variant */}
          {!isInlineVariant && (
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message{isFullVariant ? '*' : ''}
              </label>
              <Textarea 
                id="message" 
                rows={3} 
                className="w-full" 
                placeholder="Tell us about your project or inquiry..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required={isFullVariant}
              />
            </div>
          )}
          
          {/* Submit Button */}
          <div className={isInlineVariant ? 'mt-0' : 'mt-4'}>
            <Button 
              type="submit" 
              className="w-full bg-vending-blue hover:bg-vending-blue-dark text-white font-semibold py-3"
              disabled={submitting}
            >
              {submitting ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
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
  );
};

export default EmbeddedContactForm;
