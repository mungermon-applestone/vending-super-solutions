
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, CheckCircle2 } from 'lucide-react';

// Sample case study data (in a real application, this would come from an API or CMS)
const caseStudies = [
  {
    id: 1,
    title: "How National Grocery Chain Increased Vending Revenue by 35%",
    client: "National Grocery Chain",
    description: "A national grocery chain implemented our smart vending solutions across 500 stores, resulting in a 35% increase in vending revenue and improved customer satisfaction.",
    industry: "Retail",
    challenge: "The grocery chain was facing challenges with their existing vending machines, including outdated technology, limited payment options, and difficulties tracking inventory. This led to frequent stockouts, missed sales opportunities, and customer frustration. Additionally, they lacked data on purchasing patterns and machine performance, making it difficult to optimize their vending operations.",
    solution: "We implemented a comprehensive vending software solution across their 500 store locations. The solution included:<ul class='list-disc pl-6 my-4'><li>Smart vending machines with touchscreen displays and intuitive user interfaces</li><li>Integrated cashless payment systems supporting credit cards, mobile payments, and loyalty programs</li><li>Real-time inventory monitoring and automated alerts for low stock items</li><li>Cloud-based management platform for centralized control and reporting</li><li>Customer analytics to track purchase patterns and preferences</li><li>Remote maintenance monitoring and predictive maintenance capabilities</li></ul>",
    implementation: "The implementation was completed in phases over six months, minimizing disruption to store operations. Our team provided comprehensive training to the client's staff and offered 24/7 support during the transition period. The modular design of our software allowed for customization to meet the specific needs of different store locations and customer demographics.",
    results: "<ul class='list-disc pl-6 my-4'><li>35% increase in overall vending revenue across all locations</li><li>42% decrease in out-of-stock incidents through improved inventory management</li><li>28% reduction in maintenance costs through predictive maintenance</li><li>68% of transactions shifted to cashless payments</li><li>22% increase in average transaction value</li></ul>",
    testimonial: {
      quote: "The implementation of VendingSoft's solutions has transformed our vending operations from a necessary amenity to a significant revenue stream. The data insights alone have been invaluable in optimizing our product mix and operational efficiency.",
      author: "Jane Smith",
      title: "VP of In-Store Services, National Grocery Chain"
    },
    heroImage: "/placeholder.svg",
    galleryImages: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    featuredProducts: ["Smart Vending Machines", "Inventory Management System", "Analytics Dashboard"],
    slug: "national-grocery-chain-revenue-increase"
  },
  {
    id: 2,
    title: "University Campus Improves Student Experience with Smart Vending",
    client: "State University",
    description: "A major university deployed our vending solutions across campus to provide students with 24/7 access to fresh food and essentials, dramatically improving student satisfaction.",
    industry: "Education",
    challenge: "Sample challenge content...",
    solution: "Sample solution content...",
    implementation: "Sample implementation content...",
    results: "Sample results content...",
    testimonial: {
      quote: "VendingSoft has revolutionized how we provide food services to our students, especially during late hours when our dining halls are closed.",
      author: "Robert Johnson",
      title: "Director of Campus Services, State University"
    },
    heroImage: "/placeholder.svg",
    galleryImages: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    featuredProducts: ["Fresh Food Vending", "Mobile Ordering Integration", "Student ID Payment System"],
    slug: "university-student-experience"
  },
  {
    id: 3,
    title: "Healthcare Provider Streamlines Staff Access to Medical Supplies",
    client: "Metro Healthcare System",
    description: "A large healthcare network implemented our locker systems to optimize distribution of supplies to medical staff across multiple facilities.",
    industry: "Healthcare",
    challenge: "Sample challenge content...",
    solution: "Sample solution content...",
    implementation: "Sample implementation content...",
    results: "Sample results content...",
    testimonial: {
      quote: "The smart locker system has significantly improved our supply chain efficiency and helped us meet regulatory requirements with comprehensive tracking.",
      author: "Dr. Sarah Chen",
      title: "Chief Operations Officer, Metro Healthcare System"
    },
    heroImage: "/placeholder.svg",
    galleryImages: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    featuredProducts: ["Smart Locker System", "Inventory Tracking", "Compliance Reporting"],
    slug: "healthcare-medical-supplies"
  }
];

const CaseStudyDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Find the current case study by slug
  const caseStudy = caseStudies.find(study => study.slug === slug);
  
  // Handle case where case study is not found
  if (!caseStudy) {
    return (
      <Layout>
        <div className="container-wide py-12">
          <h1 className="text-3xl font-bold mb-4">Case Study not found</h1>
          <p className="mb-6">The case study you're looking for does not exist.</p>
          <Button asChild>
            <Link to="/case-studies">Back to Case Studies</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-wide py-12">
        {/* Back link */}
        <Link to="/case-studies" className="flex items-center gap-1 text-vending-blue hover:underline mb-6">
          <ChevronLeft size={18} />
          <span>Back to all case studies</span>
        </Link>
        
        {/* Hero Section */}
        <div className="mb-12">
          <Badge className="mb-4">{caseStudy.industry}</Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-vending-blue mb-6">
            {caseStudy.title}
          </h1>
          <p className="text-xl text-gray-700">
            {caseStudy.description}
          </p>
        </div>
        
        {/* Hero Image */}
        <div className="mb-12">
          <img
            src={caseStudy.heroImage}
            alt={caseStudy.title}
            className="w-full h-auto rounded-lg shadow-md"
            style={{ maxHeight: '500px', objectFit: 'cover' }}
          />
        </div>
        
        {/* Key Metrics */}
        <div className="bg-gray-50 p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Key Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudy.featuredProducts.map((product, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle2 className="text-green-500 flex-shrink-0" size={24} />
                <span className="font-medium">{product}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          <div className="lg:col-span-2">
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">The Challenge</h2>
              <div className="text-gray-700 prose" dangerouslySetInnerHTML={{ __html: caseStudy.challenge }} />
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Our Solution</h2>
              <div className="text-gray-700 prose" dangerouslySetInnerHTML={{ __html: caseStudy.solution }} />
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Implementation</h2>
              <div className="text-gray-700 prose" dangerouslySetInnerHTML={{ __html: caseStudy.implementation }} />
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">Results</h2>
              <div className="text-gray-700 prose" dangerouslySetInnerHTML={{ __html: caseStudy.results }} />
            </section>
            
            {/* Gallery */}
            <section className="mt-10">
              <h2 className="text-2xl font-bold mb-4">Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {caseStudy.galleryImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${caseStudy.title} Gallery Image ${index + 1}`}
                    className="w-full h-auto rounded-md shadow-sm"
                  />
                ))}
              </div>
            </section>
          </div>
          
          {/* Sidebar */}
          <div>
            {/* Client Info */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="font-bold mb-4">Client Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Client</p>
                  <p className="font-medium">{caseStudy.client}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Industry</p>
                  <p className="font-medium">{caseStudy.industry}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Featured Products</p>
                  <ul className="list-disc pl-5">
                    {caseStudy.featuredProducts.map((product, index) => (
                      <li key={index}>{product}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Testimonial */}
            <div className="bg-vending-blue text-white p-6 rounded-lg mb-6">
              <div className="flex flex-col items-center text-center">
                <div className="text-4xl font-serif mb-4">"</div>
                <p className="italic mb-6">{caseStudy.testimonial.quote}</p>
                <div className="font-semibold">{caseStudy.testimonial.author}</div>
                <div className="text-sm opacity-80">{caseStudy.testimonial.title}</div>
              </div>
            </div>
            
            {/* CTA */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold mb-2">Get Similar Results</h3>
              <p className="text-gray-700 mb-4">
                Discover how our vending software solutions can deliver similar outcomes for your business.
              </p>
              <Button asChild className="w-full">
                <Link to="/contact">Request a Demo</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Related Case Studies (Placeholder for future implementation) */}
        <div className="border-t pt-10">
          <h2 className="text-2xl font-bold mb-6">More Case Studies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {caseStudies.filter(study => study.id !== caseStudy.id).slice(0, 3).map(study => (
              <Link to={`/case-studies/${study.slug}`} key={study.id} className="group">
                <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={study.heroImage}
                      alt={study.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <Badge className="mb-2">{study.industry}</Badge>
                    <h3 className="font-bold group-hover:text-vending-blue transition-colors">
                      {study.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CaseStudyDetail;
