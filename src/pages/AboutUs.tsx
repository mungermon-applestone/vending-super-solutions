
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Users, Award, Mail } from 'lucide-react';

const AboutUs = () => {
  return (
    <Layout>
      <div className="container-wide py-12">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-10 mb-16">
          <div className="lg:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-vending-blue mb-6">
              About VendingSoft
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              We're revolutionizing the vending industry with cutting-edge software that integrates with multiple machines and provides versatile features for operators, enterprises, and brands.
            </p>
            <Button asChild size="lg" className="mb-6">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
          <div className="lg:w-1/2">
            <img
              src="/placeholder.svg"
              alt="About VendingSoft"
              className="w-full h-auto rounded-lg shadow-lg"
              width={600}
              height={400}
            />
          </div>
        </div>

        {/* Company Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-vending-blue mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-vending-blue-light p-4 rounded-full mb-4">
                  <Building className="h-8 w-8 text-vending-blue" />
                </div>
                <h3 className="text-xl font-bold mb-2">Innovation</h3>
                <p className="text-gray-700">
                  We constantly push the boundaries of what's possible in vending technology, delivering solutions that are always ahead of the curve.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-vending-blue-light p-4 rounded-full mb-4">
                  <Users className="h-8 w-8 text-vending-blue" />
                </div>
                <h3 className="text-xl font-bold mb-2">Partnership</h3>
                <p className="text-gray-700">
                  We believe in creating true partnerships with our clients, working together to achieve their unique business goals through our technology.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-vending-blue-light p-4 rounded-full mb-4">
                  <Award className="h-8 w-8 text-vending-blue" />
                </div>
                <h3 className="text-xl font-bold mb-2">Excellence</h3>
                <p className="text-gray-700">
                  We're committed to delivering excellence in everything we do, from product development to customer support.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Company Story */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-vending-blue mb-8">Our Story</h2>
          <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
            <p className="text-lg text-gray-700 mb-4">
              Founded in 2015, VendingSoft began with a simple mission: to modernize the vending machine industry through innovative software solutions. 
            </p>
            <p className="text-lg text-gray-700 mb-4">
              Our team of technology experts and industry veterans recognized that traditional vending machines were falling behind in a rapidly evolving retail landscape. We saw an opportunity to transform these machines into modern retail touchpoints with advanced features like contactless payments, inventory management, and data analytics.
            </p>
            <p className="text-lg text-gray-700">
              Today, our software powers thousands of vending machines and lockers across the country, helping businesses optimize operations, increase sales, and deliver exceptional customer experiences. As we continue to grow, our commitment to innovation and customer success remains stronger than ever.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-vending-blue text-white p-8 rounded-lg">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
              <p className="text-lg mb-6">
                Contact us today to learn how our vending software solutions can help you achieve your business goals.
              </p>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-5 w-5" />
                <span>info@vendingsoft.com</span>
              </div>
              <p>1-800-555-1234</p>
            </div>
            <div className="lg:w-1/2 mt-6 lg:mt-0">
              <Button asChild size="lg" variant="outline" className="w-full">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUs;
