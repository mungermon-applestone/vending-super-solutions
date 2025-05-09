
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Check } from 'lucide-react';

interface SimpleFormProps {
  formTitle?: string;
  onSuccess?: () => void;
  formType?: string;
  redirectUrl?: string;
  className?: string;
}

const SimpleForm: React.FC<SimpleFormProps> = ({
  formTitle = "Send us a message",
  onSuccess,
  formType = "Contact Form",
  redirectUrl,
  className = ""
}) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started:', { name, email, message, formType });
    
    // Validate form
    if (!name || !email || !message) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Either use Formspree or make a direct submission
      const FORMSPREE_ENDPOINT = "https://formspree.io/f/mbjnlakp"; // Replace with your Formspree endpoint
      
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
          formType,
          location: window.location.pathname
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Form submission failed: ${response.status}`);
      }
      
      console.log('Form submission successful');
      
      // Show success message
      toast({
        title: "Message sent!",
        description: "Thank you for your message. We'll respond as soon as possible.",
      });
      
      // Set form to submitted state
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
      console.error('Error sending form:', error);
      
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
    setMessage('');
    setSubmitted(false);
  };

  return (
    <div className={`${className}`}>
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-6">{formTitle}</h2>
        
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
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

export default SimpleForm;
