
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { caseStudies } from '@/data/caseStudiesData';

const CaseStudies = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 py-16">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-vending-blue-dark mb-6">
                Success Stories
              </h1>
              <p className="text-lg text-gray-700 mb-8 max-w-2xl">
                Discover how our vending solutions are helping businesses across industries 
                achieve their goals and transform their operations.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild className="bg-vending-blue text-white hover:bg-vending-blue-dark">
                  <Link to="/contact">Request a Demo</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/products">Explore Solutions</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978" 
                  alt="Success Stories" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-vending-teal text-white p-4 rounded-lg shadow-lg hidden md:block">
                <p className="font-bold">Real results from real clients</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-16">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex items-center text-sm">
            <Link to="/" className="text-gray-500 hover:text-vending-blue">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="text-vending-blue font-medium">Success Stories</span>
          </nav>
        </div>
        
        <h2 className="text-3xl font-bold mb-12 text-center">All Case Studies</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((study) => (
            <div key={study.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-56">
                <img 
                  src={study.imageUrl} 
                  alt={study.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-vending-teal text-white px-3 py-1 rounded text-sm font-medium">
                  {study.industry}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">{study.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{study.description}</p>
                
                <div className="flex justify-end">
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/case-studies/${study.slug}`}>
                      Read Case Study
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CaseStudies;
