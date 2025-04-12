
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Message sent",
      description: "We've received your message and will get back to you soon.",
    });
    e.currentTarget.reset();
  };

  return (
    <Layout>
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 py-16">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-vending-blue-dark mb-6">
                Get in Touch
              </h1>
              <p className="text-lg text-gray-700 mb-8 max-w-lg">
                Have questions about our vending solutions? Ready to transform your retail operations?
                Contact our team today.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-vending-blue-light bg-opacity-20 p-3 rounded-full h-12 w-12 mr-4 flex items-center justify-center text-vending-blue">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Email Us</h3>
                    <p className="text-gray-600">support@applestonesolutions.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-vending-blue-light bg-opacity-20 p-3 rounded-full h-12 w-12 mr-4 flex items-center justify-center text-vending-blue">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Call Us</h3>
                    <p className="text-gray-600">(555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-vending-blue-light bg-opacity-20 p-3 rounded-full h-12 w-12 mr-4 flex items-center justify-center text-vending-blue">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">Visit Us</h3>
                    <p className="text-gray-600">123 Business Avenue<br />Suite 200<br />San Francisco, CA 94107</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <Input id="name" placeholder="John Doe" required />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <Input id="email" type="email" placeholder="john@example.com" required />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <Input id="subject" placeholder="How can we help?" required />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <Textarea id="message" rows={5} placeholder="Tell us about your project or inquiry..." required />
                  </div>
                  
                  <Button type="submit" className="w-full bg-vending-blue hover:bg-vending-blue-dark">
                    Send Message <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="py-16 container max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-xl mb-2">What types of businesses use your vending solutions?</h3>
            <p className="text-gray-600">Our vending solutions are used by a wide range of businesses, including retail stores, grocers, hospitals, universities, corporate offices, and more.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-xl mb-2">How quickly can your solutions be deployed?</h3>
            <p className="text-gray-600">Depending on your specific needs, our solutions can typically be deployed within 2-6 weeks after the initial consultation and agreement.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-xl mb-2">Do you offer installation and maintenance services?</h3>
            <p className="text-gray-600">Yes, we provide complete installation services and offer various maintenance packages to ensure your vending machines operate optimally.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-xl mb-2">Can your vending machines be customized?</h3>
            <p className="text-gray-600">Absolutely! We offer customization options for branding, product selection, payment methods, and technology integration based on your business needs.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
