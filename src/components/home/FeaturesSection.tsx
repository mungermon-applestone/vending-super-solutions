
import React from 'react';
import { 
  ShoppingCart, 
  Award, 
  Globe, 
  BarChart3, 
  Shield, 
  Zap 
} from 'lucide-react';

// IMPORTANT: This component shows 6 feature cards in a specific layout.
// DO NOT reduce to 3 cards or change the layout without explicit instructions.
// This design has been explicitly approved and confirmed by the client.
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 - Multiple Product Types */}
          <div className="bg-white rounded-lg p-8 text-center shadow-sm border border-gray-100">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-8 w-8 text-vending-blue" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Multiple Product Types</h3>
            <p className="text-gray-600">
              From grocery and fresh food to vape products and collectibles, you can sell a diverse array of products.
            </p>
          </div>
          
          {/* Card 2 - Business Goal Focused */}
          <div className="bg-white rounded-lg p-8 text-center shadow-sm border border-gray-100">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="h-8 w-8 text-vending-blue" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Business Goal Focused</h3>
            <p className="text-gray-600">
              Meet revenue-producing, creative objectives with custom solutions for BOPIS, loss prevention, marketing, and more.
            </p>
          </div>
          
          {/* Card 3 - Hardware Flexibility */}
          <div className="bg-white rounded-lg p-8 text-center shadow-sm border border-gray-100">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="h-8 w-8 text-vending-blue" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Hardware Flexibility</h3>
            <p className="text-gray-600">
              Compatible with various vending machines and lockers from leading global manufacturers.
            </p>
          </div>

          {/* Card 4 - Advanced Analytics */}
          <div className="bg-white rounded-lg p-8 text-center shadow-sm border border-gray-100">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="h-8 w-8 text-vending-blue" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Advanced Analytics</h3>
            <p className="text-gray-600">
              Tune up your operations with up-to-the-second reporting and analytics.
            </p>
          </div>

          {/* Card 5 - Enterprise Security */}
          <div className="bg-white rounded-lg p-8 text-center shadow-sm border border-gray-100">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-vending-blue" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Enterprise Security</h3>
            <p className="text-gray-600">
              We don't collect any retail customer PII and observe rigorous security protocols.
            </p>
          </div>

          {/* Card 6 - Seamless Integration */}
          <div className="bg-white rounded-lg p-8 text-center shadow-sm border border-gray-100">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="h-8 w-8 text-vending-blue" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Seamless Integration</h3>
            <p className="text-gray-600">
              Open standards allow our solution to connect to your existing systems.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
