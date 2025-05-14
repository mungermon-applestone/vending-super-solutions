
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useMachine } from '@/hooks/useMachines';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const ZhilaiApplestoneAnnouncement = () => {
  // This is just an example machine slug, you should replace it with the actual slug
  const { machine, isLoading } = useMachine("cf-835");
  
  return (
    <Layout>
      <Helmet>
        <title>Zhilai and Applestone Partnership Announcement</title>
        <meta name="description" content="Learn about the strategic partnership between Zhilai and Applestone to revolutionize retail meat vending solutions." />
      </Helmet>
      
      <section className="bg-gradient-to-b from-vending-blue-light to-white py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center mb-8">
              <img
                src="/lovable-uploads/zhilai-logo.png" 
                alt="Zhilai Logo"
                className="h-12 mx-4"
              />
              <div className="text-3xl font-light text-gray-600 mx-2">×</div>
              <img
                src="/lovable-uploads/applestone-logo.png"
                alt="Applestone Logo"
                className="h-12 mx-4"
              />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-vending-blue-dark mb-6">
              Strategic Partnership Announcement
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Zhilai and Applestone Meat Co. join forces to revolutionize refrigerated vending solutions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <a href="#details">Learn More</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <section id="details" className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-vending-blue-dark mb-6">
              Transforming Food Retail Together
            </h2>
            
            <div className="prose prose-lg max-w-none">
              <p>
                We are excited to announce a groundbreaking partnership between Zhilai Vending Solutions and Applestone Meat Co. This collaboration brings together Zhilai's expertise in advanced refrigerated vending technology with Applestone's innovative approach to fresh meat retailing.
              </p>
              
              <p>
                Together, we're creating a new standard for 24/7 accessible, fresh food vending solutions that maintain perfect temperature control and inventory management for perishable goods.
              </p>
              
              <h3>Key Partnership Benefits</h3>
              <ul>
                <li>Advanced temperature maintenance systems for fresh meat products</li>
                <li>Custom software solutions for inventory tracking and freshness monitoring</li>
                <li>Seamless customer experience with multiple payment options</li>
                <li>Remote monitoring capabilities for operational efficiency</li>
                <li>Scalable solution for various location types and sizes</li>
              </ul>
              
              <blockquote>
                "This partnership represents the future of specialty food retail - combining cutting-edge technology with premium products to create convenient access for consumers while maintaining the highest quality standards."
              </blockquote>
              
              <h3>Technology Showcase</h3>
              <p>
                The partnership will feature customized versions of our CR-800 refrigerated vending machines, specially modified to meet the unique requirements of premium meat products.
              </p>
            </div>
            
            {machine && !isLoading && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-vending-blue-dark mb-4">
                  Featured Technology: {machine.title}
                </h3>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="aspect-w-16 aspect-h-9 mb-4">
                    {machine.mainImage?.url && (
                      <img 
                        src={machine.mainImage.url} 
                        alt={machine.title} 
                        className="rounded-md object-cover"
                      />
                    )}
                  </div>
                  <p className="text-gray-700 mb-4">
                    {machine.description}
                  </p>
                  <Button asChild>
                    <Link to={`/machines/${machine.slug}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            )}
            
            <div className="mt-12 text-center">
              <h3 className="text-2xl font-bold text-vending-blue-dark mb-4">
                Ready to learn more?
              </h3>
              <p className="text-gray-700 mb-6">
                Contact our sales team to discuss how this partnership can benefit your business.
              </p>
              <Button asChild size="lg">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ZhilaiApplestoneAnnouncement;
