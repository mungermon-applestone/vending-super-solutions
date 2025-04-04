
import { ShoppingCart, Award, Globe, BarChart4, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

const FeatureCard = ({ icon, title, description, link }: FeatureCardProps) => {
  return (
    <Link to={link} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow card-hover">
      <div className="bg-vending-blue-light p-3 rounded-full w-14 h-14 flex items-center justify-center text-vending-blue mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
};

const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-vending-gray">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-vending-blue-dark mb-4">
            Versatile Software for Every Vending Need
          </h2>
          <p className="subtitle mx-auto">
            Our platform adapts to your business requirements, whether you're an operator, enterprise, or brand looking to expand your vending presence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<ShoppingCart className="h-8 w-8" />}
            title="Multiple Product Types"
            description="From grocery and fresh food to vape products and collectibles, our software supports diverse product categories."
            link="/products"
          />
          <FeatureCard 
            icon={<Award className="h-8 w-8" />}
            title="Business Goal Focused"
            description="Meet your specific objectives with custom solutions for BOPIS, loss prevention, marketing, and more."
            link="/goals"
          />
          <FeatureCard 
            icon={<Globe className="h-8 w-8" />}
            title="Hardware Flexibility"
            description="Compatible with various vending machines and lockers from leading manufacturers worldwide."
            link="/machines"
          />
          <FeatureCard 
            icon={<BarChart4 className="h-8 w-8" />}
            title="Advanced Analytics"
            description="Gain valuable insights with real-time reporting and analytics to optimize your operations."
            link="/technology/data"
          />
          <FeatureCard 
            icon={<ShieldCheck className="h-8 w-8" />}
            title="Enterprise Security"
            description="Protect your business and customer data with our robust security infrastructure."
            link="/technology/security"
          />
          <FeatureCard 
            icon={<Zap className="h-8 w-8" />}
            title="Seamless Integration"
            description="Connect with existing systems through our open standards and third-party integration capabilities."
            link="/technology/integrations"
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
