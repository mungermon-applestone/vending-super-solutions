
import { CaseStudy } from '@/components/case-studies/CaseStudyCarousel';

// Interface for the case study data structure
export interface CaseStudyData {
  id: string;
  title: string;
  slug: string;
  description: string;
  industry: string;
  imageUrl: string;
  results: string[];
}

// Sample case studies data
export const caseStudies: CaseStudy[] = [
  {
    id: '1',
    title: 'Increasing Revenue for Regional Hospital',
    slug: 'regional-hospital-revenue',
    description: 'How a regional hospital increased vending revenue by 35% while improving patient satisfaction',
    industry: 'Healthcare',
    imageUrl: 'https://images.unsplash.com/photo-1504439904031-93ded9f93e4e',
    results: [
      '35% increase in vending revenue',
      '48% decrease in maintenance calls',
      '42% improvement in satisfaction ratings'
    ]
  },
  {
    id: '2',
    title: 'Corporate Campus Refreshment Solution',
    slug: 'corporate-campus-refreshment',
    description: 'Streamlining refreshment services across a multi-building tech campus with 3,000+ employees',
    industry: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
    results: [
      '22% reduction in food service operational costs',
      '300% expansion in available food options',
      'Employee satisfaction improved from 65% to 91%'
    ]
  },
  {
    id: '3',
    title: 'Manufacturing Plant Productivity',
    slug: 'manufacturing-plant-productivity',
    description: 'How smart vending solutions improved worker productivity and reduced downtime at a major manufacturing facility',
    industry: 'Manufacturing',
    imageUrl: 'https://images.unsplash.com/photo-1581091226033-c6e0b0cf8715',
    results: [
      '15% reduction in break time',
      '30% decrease in time spent away from workstations',
      'Employee satisfaction increased by 22%'
    ]
  }
];

// Function to get a case study by its slug
export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find(study => study.slug === slug);
}
