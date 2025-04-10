
import { CaseStudy } from '@/components/case-studies/CaseStudyCarousel';

// Mock case studies data for different categories
export const caseStudies: CaseStudy[] = [
  // Product-related case studies
  {
    id: '1',
    slug: 'national-grocery-chain',
    title: 'National Grocery Chain Expands Micro-Market Footprint',
    description: 'How a leading grocery chain deployed smart vending solutions to create 24/7 access points in urban food deserts.',
    industry: 'Grocery',
    imageUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a',
    results: [
      'Increased access to fresh food in underserved areas by 45%',
      'Revenue growth of 32% in first year of operation',
      'Customer satisfaction score of 4.8/5 across all locations'
    ]
  },
  {
    id: '2',
    slug: 'campus-vending-revolution',
    title: 'University Campus Vending Revolution',
    description: 'How a major university modernized their campus vending experience with cashless payments and real-time inventory tracking.',
    industry: 'Education',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1',
    results: [
      'Reduced machine downtime by 87%',
      '65% increase in student usage after implementation',
      'Decreased maintenance costs by 42% annually'
    ]
  },
  
  // Technology-related case studies
  {
    id: '3',
    slug: 'cloud-vending-management',
    title: 'Enterprise Cloud Vending Management',
    description: 'How a multinational corporation streamlined vending operations across 500+ locations with cloud-based management.',
    industry: 'Enterprise Technology',
    imageUrl: 'https://images.unsplash.com/photo-1573164574511-73c773193279',
    results: [
      'Centralized management of 1,200+ machines',
      'Real-time analytics reduced stock outages by 78%',
      'Operational cost savings of $1.2M in first year'
    ]
  },
  {
    id: '4',
    slug: 'iot-enabled-vending',
    title: 'IoT-Enabled Vending for Retail Chain',
    description: 'How IoT sensors and predictive analytics transformed inventory management for a national retail chain.',
    industry: 'Retail Technology',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
    results: [
      'Predictive restocking reduced out-of-stock events by 94%',
      'Energy consumption decreased by 27% with smart power management',
      'Customer engagement increased with personalized mobile app interactions'
    ]
  },
  
  // Business goals case studies
  {
    id: '5',
    slug: 'healthcare-facility-automation',
    title: 'Healthcare Facility Expands Access with Automation',
    description: 'How a hospital network improved staff and visitor experiences with 24/7 automated retail solutions.',
    industry: 'Healthcare',
    imageUrl: 'https://images.unsplash.com/photo-1584362767986-fd7d22d42a01',
    results: [
      'Staff satisfaction improved by 43% with 24/7 access to essentials',
      'Generated $850K in additional annual revenue',
      'Reduced administrative overhead by 65% compared to traditional retail'
    ]
  },
  {
    id: '6',
    slug: 'airport-retail-transformation',
    title: 'Airport Retail Transformation',
    description: 'How a major international airport expanded retail footprint without increasing staffing needs.',
    industry: 'Travel',
    imageUrl: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d',
    results: [
      'Retail coverage expanded to 5 previously unserved terminal areas',
      'Average traveler spend increased by 27%',
      '24/7 availability of essential items improved traveler satisfaction scores'
    ]
  }
];

// Filter functions for different categories
export const getProductCaseStudies = () => caseStudies.slice(0, 2);
export const getTechnologyCaseStudies = () => caseStudies.slice(2, 4);
export const getBusinessGoalCaseStudies = () => caseStudies.slice(4, 6);
export const getCaseStudyBySlug = (slug: string) => 
  caseStudies.find(study => study.slug === slug);
