
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  title: string;
  company: string;
  image?: string;
  stars: number;
}

/**
 * TestimonialsSection Component
 * 
 * IMPORTANT REGRESSION PREVENTION NOTES:
 * - This component displays client testimonials in a carousel format
 * - Maintains specific styling for testimonial cards with quotes, ratings, and author info
 * - Includes pagination dots and navigation arrows that must maintain accessibility
 * 
 * Layout specifications:
 * - Card uses consistent white background with shadow and rounded corners
 * - Star rating system must maintain yellow-500 color for filled stars
 * - Navigation arrows positioned at sides with consistent styling
 * - Pagination dots at bottom with active indicator in brand blue color
 * - Quote styling includes large quotation mark decoration in top left
 * - Author info consistently centered with optional circular image
 * 
 * @returns React component
 */
const TestimonialsSection = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      quote: "The flexibility of this vending software has allowed us to expand our product offerings beyond traditional snacks. The real-time inventory tracking has reduced our stockouts by 47%.",
      name: "Sarah Johnson",
      title: "Operations Director",
      company: "Metro Vending Solutions",
      stars: 5
    },
    {
      id: 2,
      quote: "Implementing this platform across our network of campus vending machines has streamlined our operations significantly. The students love the mobile payment options and we love the analytics.",
      name: "Michael Chen",
      title: "Facilities Manager",
      company: "University Services",
      stars: 5
    },
    {
      id: 3,
      quote: "As a cosmetics brand looking to expand our retail footprint, the vending solution offered exactly what we needed - beautiful product display, detailed information for customers, and robust security.",
      name: "Lauren Taylor",
      title: "Retail Innovation Lead",
      company: "GlowCosmetics",
      stars: 4
    }
  ];
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Auto-cycle through testimonials
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length, isPaused]);
  
  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };
  
  return (
    <section className="py-16 md:py-24">
      <div className="container-wide">
        {/* Section header with consistent styling */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-vending-blue-dark mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="subtitle mx-auto">
            Hear what our clients have to say about our vending software solutions.
          </p>
        </div>
        
        {/* Testimonial card with consistent styling */}
        <div className="max-w-4xl mx-auto">
          <div 
            className="relative bg-white rounded-xl p-8 md:p-12 shadow-lg"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Quote mark decoration - position must be maintained */}
            <div className="absolute top-6 left-6 text-6xl text-vending-blue-light leading-none font-serif opacity-40">
              "
            </div>
            
            {/* Testimonial content area */}
            <div className="relative">
              {/* Star rating - maintain consistent styling */}
              <div className="flex mb-6 justify-center">
                {Array.from({ length: testimonials[activeIndex].stars }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                ))}
                {Array.from({ length: 5 - testimonials[activeIndex].stars }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-gray-300" />
                ))}
              </div>
              
              {/* Quote text with consistent styling */}
              <blockquote className="text-xl md:text-2xl text-center font-medium text-gray-700 mb-8">
                "{testimonials[activeIndex].quote}"
              </blockquote>
              
              {/* Author information with consistent styling */}
              <div className="text-center">
                {testimonials[activeIndex].image && (
                  <img 
                    src={testimonials[activeIndex].image} 
                    alt={testimonials[activeIndex].name} 
                    className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                  />
                )}
                <div className="font-semibold text-lg">{testimonials[activeIndex].name}</div>
                <div className="text-vending-gray-dark">
                  {testimonials[activeIndex].title}, {testimonials[activeIndex].company}
                </div>
              </div>
            </div>
            
            {/* Navigation arrows - position and styling must be maintained */}
            <button 
              onClick={prevTestimonial} 
              className="absolute top-1/2 left-4 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={nextTestimonial} 
              className="absolute top-1/2 right-4 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          
          {/* Pagination dots with active indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === activeIndex ? 'bg-vending-blue scale-110' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
