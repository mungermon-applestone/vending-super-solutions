
import React from 'react';
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log('Form submitted');
  };

  return (
    <Layout>
      <div className="container-wide py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-vending-blue mb-6">
          Contact Us
        </h1>
        <p className="text-xl text-gray-700 mb-12 max-w-3xl">
          Have questions about our vending software solutions? We're here to help. 
          Fill out the form below or reach out to us directly.
        </p>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Contact Form */}
          <div className="lg:w-2/3">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium">
                        First Name*
                      </label>
                      <Input id="firstName" type="text" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium">
                        Last Name*
                      </label>
                      <Input id="lastName" type="text" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address*
                      </label>
                      <Input id="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </label>
                      <Input id="phone" type="tel" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="company" className="text-sm font-medium">
                      Company Name
                    </label>
                    <Input id="company" type="text" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject*
                    </label>
                    <Input id="subject" type="text" required />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Your Message*
                    </label>
                    <Textarea id="message" rows={6} required />
                  </div>

                  <Button type="submit" size="lg" className="w-full md:w-auto">
                    Submit
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="lg:w-1/3">
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="text-vending-blue mt-1" size={20} />
                    <div>
                      <p className="font-medium">Email Us</p>
                      <p className="text-gray-600">info@vendingsoft.com</p>
                      <p className="text-gray-600">support@vendingsoft.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="text-vending-blue mt-1" size={20} />
                    <div>
                      <p className="font-medium">Call Us</p>
                      <p className="text-gray-600">Main: 1-800-555-1234</p>
                      <p className="text-gray-600">Support: 1-800-555-5678</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="text-vending-blue mt-1" size={20} />
                    <div>
                      <p className="font-medium">Our Location</p>
                      <p className="text-gray-600">
                        123 Vending Way, Suite 400<br />
                        San Francisco, CA 94103
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="text-vending-blue mt-1" size={20} />
                    <div>
                      <p className="font-medium">Business Hours</p>
                      <p className="text-gray-600">Monday - Friday: 9AM - 6PM PST</p>
                      <p className="text-gray-600">Saturday - Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Request a Demo</h3>
                <p className="mb-4">
                  See our vending software in action with a personalized demo tailored to your business needs.
                </p>
                <Button className="w-full" variant="outline">
                  Schedule a Demo
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Find Us</h2>
          <div className="bg-gray-200 rounded-lg h-[400px] flex items-center justify-center">
            <p className="text-gray-600">Map integration would go here</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
