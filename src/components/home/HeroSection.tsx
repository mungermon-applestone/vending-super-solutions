
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light">
      <div className="container-wide py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-vending-blue-dark">
              Smart Vending Software for Modern Business
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl">
              Seamlessly integrate multiple vending machines with our advanced software solution. Sell any product, track inventory in real-time, and boost your revenue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button asChild className="btn-primary" size="lg">
                <Link to="/contact">
                  Request a Demo <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/products">
                  Explore Solutions
                </Link>
              </Button>
            </div>
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-vending-teal h-5 w-5" />
                <span className="text-gray-700">Hardware Agnostic</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-vending-teal h-5 w-5" />
                <span className="text-gray-700">Real-time Inventory</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-vending-teal h-5 w-5" />
                <span className="text-gray-700">Multiple Payment Options</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-vending-teal h-5 w-5" />
                <span className="text-gray-700">Advanced Analytics</span>
              </div>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81" 
                alt="Vending Machine Software Interface" 
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-vending-teal text-white p-4 rounded-lg shadow-lg hidden md:block">
              <p className="font-bold">Works with 150+ machine models</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
