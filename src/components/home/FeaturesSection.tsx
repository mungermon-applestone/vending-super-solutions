
import React from 'react';
import { ShoppingCart, Award, Globe } from 'lucide-react';

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Versatile Software for Every Vending Need
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our solution adapts to your business requirements, whether you're an
            operator, enterprise, or brand looking to expand your vending presence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-8 w-8 text-vending-blue" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Sell Any Product</h3>
            <p className="text-gray-600">
              From beverages to electronics, our software adapts to any product type you want to vend.
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="h-8 w-8 text-vending-blue" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Experience</h3>
            <p className="text-gray-600">
              Deliver an exceptional buying experience with our intuitive interface and reliable service.
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="h-8 w-8 text-vending-blue" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Global Compatibility</h3>
            <p className="text-gray-600">
              Our software works with machines worldwide, supporting multiple languages and payment methods.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
