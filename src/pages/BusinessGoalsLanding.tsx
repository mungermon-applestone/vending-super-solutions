
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import CTASection from '@/components/common/CTASection';
import { businessGoalsData } from '@/data/businessGoalsData';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const BusinessGoalsLanding = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light py-16">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-vending-blue-dark mb-6">
                Achieve Your Business Goals
              </h1>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl">
                Our vending solutions are designed to help you meet your specific business objectives, whether you're looking to expand your footprint, increase customer satisfaction, or optimize operations.
              </p>
              <Button asChild className="btn-primary">
                <Link to="/contact">Request a Demo</Link>
              </Button>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1533750516457-a7f992034fec" 
                alt="Business goals" 
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-vending-teal text-white p-4 rounded-lg shadow-lg hidden md:block">
                <p className="font-bold">Solutions for every objective</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Goals Grid */}
      <section className="py-16 bg-white">
        <div className="container-wide">
          <h2 className="text-3xl font-bold text-center mb-16">How We Help You Succeed</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businessGoalsData.map((goal, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 bg-white hover:border-vending-blue transition-colors duration-300 card-hover">
                <div className="mb-4 bg-vending-teal rounded-full p-3 inline-flex">
                  {goal.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{goal.title}</h3>
                <p className="text-gray-600 mb-4">{goal.description}</p>
                <Link 
                  to={`/goals/${goal.slug}`} 
                  className="text-vending-blue hover:text-vending-blue-dark font-medium inline-flex items-center"
                >
                  Learn more
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Preview */}
      <section className="py-16 bg-vending-gray">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
              <p className="subtitle">
                See how businesses like yours have achieved their goals with our vending solutions.
              </p>
            </div>
            <Button asChild className="mt-4 md:mt-0">
              <Link to="/case-studies">View All Case Studies</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d" 
                alt="Customer Satisfaction" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Hotel Chain Transformation</h3>
                <p className="text-gray-600 mb-4">How a hotel group increased guest satisfaction scores with 24/7 smart vending.</p>
                <Button asChild variant="outline">
                  <Link to="/case-studies/hotel-chain-transformation">Read Case Study</Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1527960471264-932f39eb5846" 
                alt="Marketing & Promotions" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Beverage Brand Campaign</h3>
                <p className="text-gray-600 mb-4">How a major beverage company increased summer sales by 47% with interactive promotions.</p>
                <Button asChild variant="outline">
                  <Link to="/case-studies/beverage-brand-seasonal-campaign">Read Case Study</Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71" 
                alt="Data & Analytics" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">National Vending Operator</h3>
                <p className="text-gray-600 mb-4">How a vending operator with 2,500 machines reduced operational costs by 34%.</p>
                <Button asChild variant="outline">
                  <Link to="/case-studies/national-vending-operator">Read Case Study</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </Layout>
  );
};

export default BusinessGoalsLanding;
