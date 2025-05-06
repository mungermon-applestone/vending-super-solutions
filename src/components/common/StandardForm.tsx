
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Check, Mail, User, MessageSquare } from 'lucide-react';
import { showSuccess, showError } from '@/utils/notification';

interface StandardFormProps {
  title?: string;
  description?: string;
  onSuccess?: () => void;
  formType?: string;
  buttonText?: string;
}

const StandardForm: React.FC<StandardFormProps> = ({
  title = 'Contact Us',
  description,
  onSuccess,
  formType = 'Contact Form',
  buttonText = 'Send Message'
}) => {
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
      // Replace the URL below with your actual Formspree endpoint
      const response = await fetch('YOUR_FORMSPREE_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          formType
        }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      // Show success message
      showSuccess("Thank you for your message. We'll respond as soon as possible.");
      
      // Reset form and show success state
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      
      if (onSuccess) {
        onSuccess();
      }
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
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      {description && <p className="text-gray-600 mb-6">{description}</p>}
      
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Your Name*
              </Label>
              <Input 
                id="name" 
                type="text" 
                className="w-full mt-1" 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>
            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address*
              </Label>
              <Input 
                id="email" 
                type="email" 
                className="w-full mt-1" 
                placeholder="john@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div>
              <Label htmlFor="subject" className="flex items-center gap-2">
                Subject
              </Label>
              <Input 
                id="subject" 
                type="text" 
                className="w-full mt-1" 
                placeholder="How can we help?" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="message" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Message*
              </Label>
              <Textarea 
                id="message" 
                rows={5} 
                className="w-full mt-1" 
                placeholder="Tell us about your inquiry..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required 
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-vending-blue hover:bg-vending-blue-dark text-white font-semibold py-3"
            disabled={submitting}
          >
            {submitting ? 'Sending...' : buttonText}
          </Button>
        </form>
      ) : (
        <div className="text-center py-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Message Sent!</h3>
          <p className="text-gray-600 mb-6">
            Thank you for reaching out. We'll get back to you as soon as possible.
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

export default StandardForm;
