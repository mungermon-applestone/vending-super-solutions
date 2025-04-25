
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BusinessGoalInquiryProps {
  title?: string;
  description?: string;
  bulletPoints?: string[];
  buttonText?: string;
  buttonUrl?: string;
}

const BusinessGoalInquiry: React.FC<BusinessGoalInquiryProps> = ({
  title = "Need a Custom Solution?",
  description = "Contact our team to discuss how our products can be tailored to your specific business needs.",
  bulletPoints = [],
  buttonText = "Contact Us",
  buttonUrl = "/contact"
}) => {
  return (
    <section className="py-16 bg-vending-blue-light bg-opacity-10">
      <div className="container mx-auto">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-vending-blue-dark mb-4">{title}</h2>
              <p className="text-gray-700 mb-6">{description}</p>
              
              {bulletPoints && bulletPoints.length > 0 && (
                <ul className="space-y-3 mb-6">
                  {bulletPoints.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <Check className="h-4 w-4 text-vending-blue" />
                      </div>
                      <p className="ml-3 text-sm md:text-base text-gray-700">{point}</p>
                    </li>
                  ))}
                </ul>
              )}
              
              <Button asChild>
                <Link to={buttonUrl}>
                  {buttonText} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="bg-gradient-to-br from-vending-blue to-vending-teal hidden md:block">
              <div className="h-full flex items-center justify-center p-8">
                <div className="text-white text-center">
                  <h3 className="text-2xl font-bold mb-3">Expert Support</h3>
                  <p className="text-white text-opacity-90">
                    Our team is ready to help you implement the perfect vending solution for your needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessGoalInquiry;
