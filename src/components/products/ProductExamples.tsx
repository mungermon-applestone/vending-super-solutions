
import { ArrowRight } from 'lucide-react';
import { CMSExample } from '@/types/cms';

interface ProductExamplesProps {
  examples: CMSExample[];
}

const ProductExamples = ({ examples }: ProductExamplesProps) => {
  return (
    <section className="py-16 bg-vending-gray">
      <div className="container-wide">
        <h2 className="text-3xl font-bold text-center mb-6 text-vending-blue-dark">
          Real-World Examples
        </h2>
        <p className="text-center subtitle mx-auto mb-16">
          See how our vending solutions are being successfully deployed by businesses like yours.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {examples.map((example, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
              <img 
                src={example.image.url} 
                alt={example.image.alt || example.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">{example.title}</h3>
                <p className="text-gray-600 mb-4">{example.description}</p>
                <a 
                  href="#" 
                  className="text-vending-blue hover:text-vending-blue-dark font-medium flex items-center"
                >
                  Read case study <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductExamples;
