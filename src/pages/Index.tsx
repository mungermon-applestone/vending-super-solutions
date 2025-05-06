
import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import ProductTypesSection from '@/components/home/ProductTypesSection';
import BusinessGoalsSection from '@/components/home/BusinessGoalsSection';
import AvailableMachinesSection from '@/components/home/AvailableMachinesSection';
import { EmailLink } from '@/components/common';
import { useHomePageContent } from '@/hooks/useHomePageContent';

const Index = () => {
  const { data: homeContent } = useHomePageContent();

  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <ProductTypesSection />
      <BusinessGoalsSection />
      <AvailableMachinesSection />
      <section className="py-16 md:py-24 bg-vending-blue-light">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-vending-blue-dark mb-6">
                {homeContent?.ctaSectionTitle || "Ready to Transform Your Vending Operations?"}
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                {homeContent?.ctaSectionDescription || "Get started with our platform today and see the difference in your operations."}
              </p>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Contact us today to:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-vending-blue-dark mr-2">•</span>
                      <span>Schedule a personalized demo</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-vending-blue-dark mr-2">•</span>
                      <span>Get pricing information</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-vending-blue-dark mr-2">•</span>
                      <span>Learn about custom solutions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-vending-blue-dark mr-2">•</span>
                      <span>Discuss your specific business needs</span>
                    </li>
                  </ul>
                </div>
                
                <div className="pt-4">
                  <EmailLink 
                    subject="Vending Operations Inquiry"
                    buttonText="Contact Our Team" 
                    className="w-full md:w-auto bg-vending-blue hover:bg-vending-blue-dark text-white font-semibold py-3"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Why Choose Applestone Solutions</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-vending-blue-light rounded-full p-2 mr-4">
                    <svg className="h-6 w-6 text-vending-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Industry-Leading Technology</h4>
                    <p className="text-gray-600">Our platform combines cutting-edge hardware with sophisticated software.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-vending-blue-light rounded-full p-2 mr-4">
                    <svg className="h-6 w-6 text-vending-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Dedicated Support</h4>
                    <p className="text-gray-600">Our team is available to help you every step of the way.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-vending-blue-light rounded-full p-2 mr-4">
                    <svg className="h-6 w-6 text-vending-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Customizable Solutions</h4>
                    <p className="text-gray-600">We tailor our services to meet your specific business needs.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-vending-blue-light rounded-full p-2 mr-4">
                    <svg className="h-6 w-6 text-vending-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Proven Results</h4>
                    <p className="text-gray-600">Our clients see increased revenue and operational efficiency.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
