
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Award, TrendingUp, Clock, Globe, Heart } from 'lucide-react';

const AboutUs = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 py-16 md:py-24">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-vending-blue-dark mb-6">
                Transforming Retail Through Automation
              </h1>
              <p className="text-lg text-gray-700 mb-8 max-w-lg">
                Since 2015, Applestone Solutions has been at the forefront of automated retail innovation,
                helping businesses of all sizes streamline operations and reach new customers.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild className="bg-vending-blue hover:bg-vending-blue-dark">
                  <Link to="/contact">Contact Us <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/case-studies">Our Success Stories</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?ixlib=rb-1.2.1" 
                    alt="Team working on vending solution" 
                    className="w-full h-auto"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-vending-teal text-white p-4 rounded-lg shadow-lg hidden md:block">
                  <p className="font-bold">Industry leaders since 2015</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="py-16 bg-white">
        <div className="container max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-6 text-vending-blue-dark">Our Mission</h2>
            <p className="text-xl text-gray-700">
              We're on a mission to revolutionize retail by providing cutting-edge automated vending solutions
              that empower businesses to operate more efficiently, scale effectively, and create exceptional
              customer experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50 rounded-lg shadow-sm">
              <div className="bg-vending-blue-light bg-opacity-20 p-3 rounded-full w-14 h-14 flex items-center justify-center text-vending-blue mb-4">
                <TrendingUp className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Innovation</h3>
              <p className="text-gray-700">
                We continuously push the boundaries of vending technology to create solutions that address 
                tomorrow's retail challenges today.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-lg shadow-sm">
              <div className="bg-vending-blue-light bg-opacity-20 p-3 rounded-full w-14 h-14 flex items-center justify-center text-vending-blue mb-4">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Partnership</h3>
              <p className="text-gray-700">
                We work closely with our clients to understand their needs and provide customized solutions 
                that help them achieve their business goals.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-lg shadow-sm">
              <div className="bg-vending-blue-light bg-opacity-20 p-3 rounded-full w-14 h-14 flex items-center justify-center text-vending-blue mb-4">
                <Award className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Excellence</h3>
              <p className="text-gray-700">
                We're committed to delivering exceptional quality in every aspect of our business, from 
                hardware reliability to customer support.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16 bg-vending-gray">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <img 
                src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-1.2.1" 
                alt="Company founding" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-6 text-vending-blue-dark">Our Story</h2>
              <div className="space-y-6">
                <div className="flex">
                  <div className="mr-4 text-vending-blue">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">2015: The Beginning</h3>
                    <p className="text-gray-700">
                      Founded by John Applestone with a vision to modernize vending operations through 
                      innovative technology solutions.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 text-vending-blue">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">2018: Expansion</h3>
                    <p className="text-gray-700">
                      Grew our team to 50+ employees and expanded our offerings to include temperature-controlled 
                      vending solutions for fresh food.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 text-vending-blue">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">2020: Global Reach</h3>
                    <p className="text-gray-700">
                      Established partnerships with international retailers and expanded operations to Europe and Asia.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 text-vending-blue">
                    <Heart className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Today</h3>
                    <p className="text-gray-700">
                      Serving thousands of clients worldwide with state-of-the-art vending technology and a 
                      commitment to excellence.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Leadership Team */}
      <div className="py-16 bg-white">
        <div className="container max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-6 text-vending-blue-dark">Our Leadership Team</h2>
            <p className="text-lg text-gray-700">
              Meet the experts behind our innovative vending solutions who are dedicated to transforming 
              the future of retail.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "John Applestone",
                title: "Founder & CEO",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1",
                bio: "20+ years of retail innovation experience"
              },
              {
                name: "Sarah Chen",
                title: "CTO",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1",
                bio: "Former head of engineering at Tech Innovations"
              },
              {
                name: "Michael Rodriguez",
                title: "Head of Operations",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1",
                bio: "Supply chain management expert"
              },
              {
                name: "Jessica Williams",
                title: "Chief Marketing Officer",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1",
                bio: "Digital marketing strategist with 15+ years experience"
              }
            ].map((person, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 relative">
                  <img 
                    src={person.image}
                    alt={person.name}
                    className="w-48 h-48 object-cover rounded-full mx-auto"
                  />
                </div>
                <h3 className="text-xl font-bold mb-1">{person.name}</h3>
                <p className="text-vending-blue font-medium mb-2">{person.title}</p>
                <p className="text-gray-600">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-16 bg-vending-blue text-white">
        <div className="container max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Revolutionize Your Business?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Partner with us to implement cutting-edge vending solutions that will transform your retail operations.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button className="bg-white text-vending-blue hover:bg-gray-100" asChild size="lg">
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-vending-blue-dark" asChild size="lg">
              <Link to="/technology">Explore Our Technology</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUs;
