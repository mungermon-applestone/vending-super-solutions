
import React from 'react';
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check, HandshakeIcon, Factory, Store, Box, TrendingUp } from 'lucide-react';

// Create a custom HandshakeIcon since it might not be in lucide-react
const HandshakeIconCustom = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    <rect x="12" y="12" width="4" height="4" />
  </svg>
);

const Partner = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log('Form submitted');
  };

  // Partnership types with descriptions
  const partnershipTypes = [
    {
      title: "Machine Manufacturers",
      description: "Partner with us to integrate your vending machines with our software, offering your customers a complete solution with advanced features.",
      icon: Factory,
    },
    {
      title: "Retailers & Brands",
      description: "Expand your distribution through automated retail. Our software helps you manage inventory, track sales, and engage with customers.",
      icon: Store,
    },
    {
      title: "Distributors",
      description: "Become a distributor of our vending software solutions and expand your portfolio with industry-leading technology.",
      icon: Box,
    },
    {
      title: "Technology Partners",
      description: "Integrate your technology with our platform to create enhanced solutions for the vending industry.",
      icon: TrendingUp,
    },
  ];

  // Benefits of partnering
  const benefits = [
    "Access to cutting-edge vending software technology",
    "Joint marketing opportunities and lead sharing",
    "Dedicated partner support and resources",
    "Competitive commission structures",
    "Product training and certification programs",
    "Collaborative product development",
  ];

  return (
    <Layout>
      <div className="container-wide py-12">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-10 mb-16">
          <div className="lg:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-vending-blue mb-6">
              Partner With VendingSoft
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Join our partner ecosystem and grow your business by offering cutting-edge vending software solutions to your customers.
            </p>
            <Button asChild size="lg" className="mb-6">
              <a href="#partner-form">Become a Partner</a>
            </Button>
          </div>
          <div className="lg:w-1/2">
            <img
              src="/placeholder.svg"
              alt="Partnership"
              className="w-full h-auto rounded-lg shadow-lg"
              width={600}
              height={400}
            />
          </div>
        </div>

        {/* Partnership Types Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-vending-blue mb-8 text-center">Partnership Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partnershipTypes.map((type, index) => (
              <Card key={index}>
                <CardContent className="p-6 flex flex-col md:flex-row gap-4 items-start">
                  <div className="bg-vending-blue-light p-4 rounded-full flex-shrink-0">
                    <type.icon className="h-8 w-8 text-vending-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{type.title}</h3>
                    <p className="text-gray-700">{type.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16 bg-gray-50 p-10 rounded-lg">
          <h2 className="text-3xl font-bold text-vending-blue mb-8 text-center">Benefits of Partnering With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="text-green-500 mt-1 flex-shrink-0" size={20} />
                <p className="font-medium">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Partner Process */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-vending-blue mb-8 text-center">Our Partnership Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-vending-blue text-white w-12 h-12 rounded-full flex items-center justify-center mb-4 font-bold text-xl">1</div>
              <h3 className="text-xl font-bold mb-2">Apply</h3>
              <p className="text-gray-700">
                Fill out our partner application form with details about your business and partnership goals.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-vending-blue text-white w-12 h-12 rounded-full flex items-center justify-center mb-4 font-bold text-xl">2</div>
              <h3 className="text-xl font-bold mb-2">Connect</h3>
              <p className="text-gray-700">
                Meet with our partnership team to discuss opportunities and establish a collaboration framework.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-vending-blue text-white w-12 h-12 rounded-full flex items-center justify-center mb-4 font-bold text-xl">3</div>
              <h3 className="text-xl font-bold mb-2">Launch</h3>
              <p className="text-gray-700">
                Finalize partnership details, complete training, and start growing together.
              </p>
            </div>
          </div>
        </div>

        {/* Partner Form */}
        <div id="partner-form" className="scroll-mt-24">
          <h2 className="text-3xl font-bold text-vending-blue mb-8 text-center">Become a Partner</h2>
          <Card>
            <CardContent className="p-8">
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
                      Business Email*
                    </label>
                    <Input id="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone Number*
                    </label>
                    <Input id="phone" type="tel" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium">
                    Company Name*
                  </label>
                  <Input id="company" type="text" required />
                </div>

                <div className="space-y-2">
                  <label htmlFor="website" className="text-sm font-medium">
                    Company Website
                  </label>
                  <Input id="website" type="url" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="partnerType" className="text-sm font-medium">
                    Partnership Type*
                  </label>
                  <select 
                    id="partnerType" 
                    required
                    className="w-full rounded-md border border-gray-300 py-2 px-3"
                  >
                    <option value="">Select a partnership type</option>
                    <option value="manufacturer">Machine Manufacturer</option>
                    <option value="retailer">Retailer/Brand</option>
                    <option value="distributor">Distributor</option>
                    <option value="technology">Technology Partner</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Tell us about your business and partnership goals*
                  </label>
                  <Textarea id="message" rows={6} required />
                </div>

                <Button type="submit" size="lg" className="w-full md:w-auto">
                  Submit Partnership Application
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials - Optional for Future */}
        {/* <div className="mt-16">
          <h2 className="text-3xl font-bold text-vending-blue mb-8 text-center">Partner Testimonials</h2>
          // Testimonial cards would go here
        </div> */}
      </div>
    </Layout>
  );
};

export default Partner;
