
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from 'lucide-react';

// Sample case study data
const caseStudies = [
  {
    id: 1,
    title: "How National Grocery Chain Increased Vending Revenue by 35%",
    description: "A national grocery chain implemented our smart vending solutions across 500 stores, resulting in a 35% increase in vending revenue and improved customer satisfaction.",
    industry: "Retail",
    challenge: "Outdated vending technology, limited payment options, inventory tracking issues",
    solution: "Smart vending machines with cashless payments, inventory management system, and customer analytics",
    results: "35% revenue increase, 42% decrease in out-of-stock incidents, 28% reduction in maintenance costs",
    image: "/placeholder.svg",
    slug: "national-grocery-chain-revenue-increase"
  },
  {
    id: 2,
    title: "University Campus Improves Student Experience with Smart Vending",
    description: "A major university deployed our vending solutions across campus to provide students with 24/7 access to fresh food and essentials, dramatically improving student satisfaction.",
    industry: "Education",
    challenge: "Limited late-night food options, food service labor shortages, outdated payment methods",
    solution: "Smart vending network with fresh food options, mobile ordering integration, and student ID payment capabilities",
    results: "89% student satisfaction rate, 50% increase in after-hours food availability, 15% revenue growth",
    image: "/placeholder.svg",
    slug: "university-student-experience"
  },
  {
    id: 3,
    title: "Healthcare Provider Streamlines Staff Access to Medical Supplies",
    description: "A large healthcare network implemented our locker systems to optimize distribution of supplies to medical staff across multiple facilities.",
    industry: "Healthcare",
    challenge: "Inefficient supply distribution, inventory shrinkage, regulatory compliance concerns",
    solution: "Smart locker system with tracking capabilities, role-based access control, and detailed reporting",
    results: "45% reduction in supply waste, 30% decrease in distribution costs, 100% compliance with regulations",
    image: "/placeholder.svg",
    slug: "healthcare-medical-supplies"
  },
  {
    id: 4,
    title: "Tech Company Enhances Employee Perks with Automated Retail",
    description: "A leading technology company implemented our smart vending solutions to provide employees with free snacks, drinks, and office supplies.",
    industry: "Technology",
    challenge: "Manual inventory management, high restocking costs, limited data on usage patterns",
    solution: "Connected vending system with employee badge access, automated inventory tracking, and usage analytics",
    results: "22% cost savings in managing employee perks, 97% employee satisfaction rating, simplified accounting",
    image: "/placeholder.svg",
    slug: "tech-employee-perks"
  },
  {
    id: 5,
    title: "Hotel Chain Expands Amenities with 24/7 Vending Solutions",
    description: "A luxury hotel chain implemented our vending technology to offer premium products and toiletries to guests around the clock.",
    industry: "Hospitality",
    challenge: "Limited off-hours service, staff constraints, inability to offer premium items securely",
    solution: "Premium smart vending machines with room charge integration, touchless interface, and luxury product offerings",
    results: "15% increase in ancillary revenue, 28% improvement in guest satisfaction scores, reduced staffing needs",
    image: "/placeholder.svg",
    slug: "hotel-chain-amenities"
  },
  {
    id: 6,
    title: "Manufacturing Plant Improves Safety Equipment Accessibility",
    description: "A large manufacturing company deployed our locker systems to manage and track safety equipment distribution across their facility.",
    industry: "Manufacturing",
    challenge: "Safety compliance issues, equipment loss, inefficient distribution processes",
    solution: "Smart locker system with employee ID integration, automatic tracking, and usage reporting",
    results: "98% safety compliance rate, 40% reduction in lost equipment costs, improved OSHA audit outcomes",
    image: "/placeholder.svg",
    slug: "manufacturing-safety-equipment"
  }
];

// All unique industries from the case studies
const industries = ["All", ...new Set(caseStudies.map(study => study.industry))];

const CaseStudies = () => {
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  // Filter case studies based on selected industry
  const filteredStudies = selectedIndustry === 'All' 
    ? caseStudies 
    : caseStudies.filter(study => study.industry === selectedIndustry);

  return (
    <Layout>
      <div className="container-wide py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-vending-blue mb-6">
          Case Studies
        </h1>
        <p className="text-xl text-gray-700 mb-10 max-w-3xl">
          Discover how our vending software solutions have helped businesses across various industries achieve their goals and overcome challenges.
        </p>

        {/* Industry Filter */}
        <div className="mb-10">
          <h2 className="text-lg font-medium mb-3">Filter by Industry:</h2>
          <div className="flex flex-wrap gap-2">
            {industries.map(industry => (
              <Button
                key={industry}
                variant={selectedIndustry === industry ? "default" : "outline"}
                className={selectedIndustry === industry ? "" : "hover:bg-gray-100"}
                onClick={() => setSelectedIndustry(industry)}
              >
                {industry}
              </Button>
            ))}
          </div>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredStudies.map(study => (
            <Card key={study.id} className="overflow-hidden flex flex-col h-full">
              <div className="aspect-video">
                <img
                  src={study.image}
                  alt={study.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6 flex-grow flex flex-col">
                <Badge className="self-start mb-3">{study.industry}</Badge>
                <h3 className="text-xl font-bold mb-3">{study.title}</h3>
                <p className="text-gray-700 mb-6 flex-grow">{study.description}</p>
                <div className="mt-auto">
                  <Button asChild variant="outline" className="w-full flex justify-between items-center">
                    <Link to={`/case-studies/${study.slug}`}>
                      Read Case Study 
                      <ArrowRight size={16} />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-vending-blue text-white p-10 rounded-lg">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-2/3">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
              <p className="text-lg opacity-90">
                Contact us today to learn how our vending software solutions can help you achieve similar results for your business.
              </p>
            </div>
            <div>
              <Button asChild size="lg" variant="secondary">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CaseStudies;
