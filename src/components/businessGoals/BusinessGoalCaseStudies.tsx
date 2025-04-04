
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CaseStudy {
  title: string;
  description: string;
  image: string;
  slug: string;
  results: string[];
}

interface BusinessGoalCaseStudiesProps {
  caseStudies: CaseStudy[];
}

const BusinessGoalCaseStudies = ({ caseStudies }: BusinessGoalCaseStudiesProps) => {
  return (
    <section className="py-16 bg-vending-gray">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-vending-blue-dark mb-4">
              Success Stories
            </h2>
            <p className="subtitle max-w-2xl">
              See how our clients have achieved this business goal with our vending solutions.
            </p>
          </div>
          <Button asChild className="mt-4 md:mt-0" variant="outline">
            <Link to="/case-studies">View All Case Studies</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {caseStudies.map((caseStudy, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-full">
                  <img 
                    src={caseStudy.image} 
                    alt={caseStudy.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{caseStudy.title}</h3>
                  <p className="text-gray-600 mb-4">{caseStudy.description}</p>
                  
                  <h4 className="font-medium text-vending-blue mb-2">Key Results:</h4>
                  <ul className="mb-6">
                    {caseStudy.results.map((result, idx) => (
                      <li key={idx} className="flex items-start mb-2">
                        <svg className="h-6 w-6 text-vending-teal flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button asChild variant="outline" className="mt-2">
                    <Link to={`/case-studies/${caseStudy.slug}`}>
                      Read Full Case Study <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessGoalCaseStudies;
