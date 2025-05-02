
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InquiryFormProps {
  title: string;
}

const InquiryForm: React.FC<InquiryFormProps> = ({ title }) => {
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!fullName || !email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // In a production environment, this would connect to a backend service
      console.log('Sending demo request to hello@applestonesolutions.com');
      console.log({ fullName, email, company, phone, message });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast({
        title: "Success!",
        description: "Thank you for your interest. We'll be in touch soon.",
      });
      
      // Reset form and show success state
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "There was a problem sending your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-12 bg-vending-blue-light">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-vending-blue-dark mb-6">
              Ready to transform your vending operations?
            </h2>
            <p className="text-lg mb-8 text-gray-700">
              Let us show you how our software can streamline your operations, increase sales, and improve customer satisfaction.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Check className="text-vending-teal h-5 w-5" />
                <span className="text-gray-700">Compatible with multiple machine types</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-vending-teal h-5 w-5" />
                <span className="text-gray-700">Easy to implement and use</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-vending-teal h-5 w-5" />
                <span className="text-gray-700">Dedicated support team</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-vending-teal h-5 w-5" />
                <span className="text-gray-700">Customizable to your specific needs</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            {!submitted ? (
              <>
                <h3 className="text-2xl font-bold mb-6">Request a Demo</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input 
                      id="fullName" 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                      className="mt-1" 
                      placeholder="John Doe" 
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Business Email *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="mt-1" 
                      placeholder="john@company.com" 
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company Name</Label>
                    <Input 
                      id="company" 
                      value={company} 
                      onChange={(e) => setCompany(e.target.value)} 
                      className="mt-1" 
                      placeholder="Acme Inc." 
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      className="mt-1" 
                      placeholder="(555) 555-5555" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <textarea
                      id="message"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Tell us about your needs and any questions you have."
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-vending-blue hover:bg-vending-blue-dark text-white"
                    disabled={submitting}
                  >
                    {submitting ? 'Sending...' : 'Request Demo'}
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-green-100">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                <p className="text-gray-600 mb-6">
                  We've received your demo request and will be in touch shortly.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSubmitted(false);
                    setFullName('');
                    setEmail('');
                    setCompany('');
                    setPhone('');
                    setMessage('');
                  }}
                >
                  Submit Another Request
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InquiryForm;
