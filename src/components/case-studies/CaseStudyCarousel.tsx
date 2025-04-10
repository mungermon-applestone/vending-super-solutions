
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  description: string;
  industry: string;
  imageUrl: string;
  results: string[];
}

interface CaseStudyCarouselProps {
  title?: string;
  subtitle?: string;
  caseStudies: CaseStudy[];
}

const CaseStudyCarousel = ({ 
  title = "Success Stories", 
  subtitle = "See how our solutions deliver real business results",
  caseStudies 
}: CaseStudyCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <section className="py-16 bg-slate-50">
      <div className="container-wide">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-vending-blue-dark mb-4">{title}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="relative"
            onSelect={(api) => {
              if (api) {
                const selectedIndex = api.selectedScrollSnap();
                setCurrentIndex(selectedIndex);
              }
            }}
          >
            <CarouselContent>
              {caseStudies.map((study, index) => (
                <CarouselItem key={study.id} className="md:basis-2/3 lg:basis-1/2 pl-4">
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
                    <div className="relative h-64">
                      <img 
                        src={study.imageUrl || "https://images.unsplash.com/photo-1557804506-669a67965ba0"} 
                        alt={study.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-vending-teal text-white px-3 py-1 rounded text-sm font-medium">
                        {study.industry}
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold mb-3">{study.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{study.description}</p>
                      
                      {study.results && study.results.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-sm text-gray-500 mb-2">Key Results:</h4>
                          <ul className="space-y-1">
                            {study.results.slice(0, 2).map((result, idx) => (
                              <li key={idx} className="text-sm flex items-start">
                                <span className="text-vending-teal mr-2">•</span>
                                <span>{result}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="mt-auto">
                        <Button 
                          variant="outline" 
                          asChild 
                          className="w-full flex justify-center items-center"
                        >
                          <Link to={`/case-studies/${study.slug}`}>
                            Read Full Case Study <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <CarouselPrevious className="-left-4 md:-left-6" />
            <CarouselNext className="-right-4 md:-right-6" />
          </Carousel>
          
          {/* Pagination indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {caseStudies.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-vending-blue w-6' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          {/* View all link */}
          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link to="/case-studies">
                View All Case Studies <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudyCarousel;
