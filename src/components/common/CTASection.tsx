
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CTASection = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!email || !name) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Handle form submission (would normally send to server)
    console.log({ name, email, company, phone });
    
    // Show success message
    toast({
      title: "Success!",
      description: "Thank you for your interest. We'll be in touch soon.",
    });
    
    // Reset form and show success state
    setSubmitted(true);
  };
  
  return (
    <section className="bg-vending-blue-light py-16 md:py-20">
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
                    <Label htmlFor="name">Full Name *</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="mt-1" 
                      placeholder="John Doe" 
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
                  <Button type="submit" className="w-full btn-primary mt-6">
                    Request Demo
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
                    setName('');
                    setEmail('');
                    setCompany('');
                    setPhone('');
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

export default CTASection;
