
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, ChevronRight, Building2, Calendar, BarChart, ArrowUpRight } from 'lucide-react';
import { getCaseStudyBySlug, caseStudies } from '@/data/caseStudiesData';
import InquiryForm from '@/components/machines/contact/InquiryForm';

const CaseStudyDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const caseStudy = getCaseStudyBySlug(slug || '');
  
  // If case study not found, provide a fallback
  if (!caseStudy) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-red-700 mb-4">Case Study Not Found</h2>
            <p className="text-red-600 mb-6">The case study you're looking for doesn't exist or has been moved.</p>
            <Button asChild>
              <Link to="/case-studies">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Case Studies
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Function to get related case studies (excluding current one)
  const getRelatedCaseStudies = () => {
    return caseStudies
      .filter(study => study.id !== caseStudy.id)
      .slice(0, 3);
  };

  // Get related case studies
  const relatedCaseStudies = getRelatedCaseStudies();

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto py-3">
          <nav className="flex items-center text-sm">
            <Link to="/" className="text-gray-500 hover:text-vending-blue">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <Link to="/case-studies" className="text-gray-500 hover:text-vending-blue">Success Stories</Link>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <span className="text-vending-blue font-medium">{caseStudy.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 py-12">
        <div className="container">
          <div className="flex items-center text-vending-teal mb-4">
            <Building2 className="h-5 w-5 mr-2" />
            <span className="font-medium">{caseStudy.industry}</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-vending-blue-dark mb-6">
            {caseStudy.title}
          </h1>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Main image */}
            <div className="rounded-lg overflow-hidden mb-8">
              <img 
                src={caseStudy.imageUrl}
                alt={caseStudy.title}
                className="w-full h-auto"
              />
            </div>
            
            {/* Challenge */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-vending-blue-dark mb-4">The Challenge</h2>
              <p className="text-gray-700 mb-4">
                {caseStudy.description}
              </p>
              <p className="text-gray-700">
                The client needed a solution that could scale with their business while maintaining 
                consistent quality and customer experience across all locations. Traditional approaches 
                were proving too costly and inefficient to manage at scale.
              </p>
            </div>
            
            {/* Solution */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-vending-blue-dark mb-4">Our Solution</h2>
              <p className="text-gray-700 mb-4">
                We implemented a customized vending solution that addressed the specific needs of the {caseStudy.industry} sector. 
                The solution included:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-vending-teal mt-0.5 mr-2 flex-shrink-0" />
                  <span>Customized hardware configuration optimized for their product mix</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-vending-teal mt-0.5 mr-2 flex-shrink-0" />
                  <span>Cloud-based management system with real-time inventory tracking</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-vending-teal mt-0.5 mr-2 flex-shrink-0" />
                  <span>Integrated payment processing with multiple options for customers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-vending-teal mt-0.5 mr-2 flex-shrink-0" />
                  <span>Automated restocking notifications and predictive analytics</span>
                </li>
              </ul>
            </div>
            
            {/* Results */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-vending-blue-dark mb-4">The Results</h2>
              <p className="text-gray-700 mb-6">
                The implementation delivered significant measurable results:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {caseStudy.results.map((result, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                    <div className="text-vending-teal mb-2">
                      <BarChart className="h-8 w-8 mx-auto" />
                    </div>
                    <p className="font-medium">{result}</p>
                  </div>
                ))}
              </div>
              
              <p className="text-gray-700">
                Beyond the metrics, the client reported improved customer satisfaction and operational efficiency.
                Staff were able to focus on higher-value tasks rather than manual inventory management and 
                maintenance issues that were common with their previous solution.
              </p>
            </div>
            
            {/* Testimonial */}
            <div className="bg-vending-blue-light bg-opacity-10 rounded-lg p-8 mb-8">
              <blockquote className="text-xl font-medium text-vending-blue-dark italic mb-4">
                "The solution transformed how we approach our retail strategy. We're now able to expand
                into locations that weren't previously viable, while providing a consistent experience
                for our customers."
              </blockquote>
              <div className="font-medium">— Director of Operations, {caseStudy.industry} Company</div>
            </div>
            
            {/* CTA */}
            <div className="bg-vending-gray rounded-lg p-8 text-center">
              <h3 className="text-xl font-bold mb-4">Ready to achieve similar results?</h3>
              <p className="mb-6 text-gray-700">
                Let us show you how our vending solutions can help your business reach its goals.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild className="bg-vending-blue text-white hover:bg-vending-blue-dark">
                  <Link to="/contact">Request a Demo</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/products">Explore Products</Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">Project Details</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="text-vending-blue mr-3">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Industry</p>
                    <p className="font-medium">{caseStudy.industry}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-vending-blue mr-3">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Timeframe</p>
                    <p className="font-medium">3 months</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="text-vending-blue mr-3">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Solution Type</p>
                    <p className="font-medium">Enterprise Vending</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Related Case Studies */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold mb-4">Related Case Studies</h3>
              <div className="space-y-4">
                {relatedCaseStudies.map(related => (
                  <div key={related.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <Link to={`/case-studies/${related.slug}`} className="group">
                      <h4 className="font-medium text-vending-blue-dark group-hover:text-vending-blue mb-1">
                        {related.title}
                      </h4>
                      <p className="text-sm text-gray-500">{related.industry}</p>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Form */}
      <InquiryForm title={`${caseStudy.industry} Solutions`} />
    </Layout>
  );
};

export default CaseStudyDetail;
