
import { CaseStudyWithRelations, CaseStudyFormData } from '@/types/caseStudy';
import { logDeprecationWarning } from '@/services/cms/utils/deprecationLogger';

// Sample case studies data for the mock implementation
const mockCaseStudies: CaseStudyWithRelations[] = [
  {
    id: '1',
    title: 'Retail Chain Automation',
    slug: 'retail-chain-automation',
    summary: 'How a major retail chain implemented our vending solutions',
    content: 'Detailed case study content...',
    industry: 'Retail',
    solution: 'Smart Vending Network',
    visible: true,
    image_url: '/images/case-studies/retail.jpg',
    image_alt: 'Retail automation',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    results: [
      {
        id: '1-1',
        case_study_id: '1',
        text: '35% increase in sales',
        display_order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '1-2',
        case_study_id: '1',
        text: '24/7 availability increased customer satisfaction',
        display_order: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    testimonial: {
      id: '1-t',
      case_study_id: '1',
      quote: 'The implementation was seamless and results exceeded our expectations.',
      author: 'Jane Smith',
      company: 'MegaMart Retail',
      position: 'CTO',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  },
  {
    id: '2',
    title: 'Hospital Supply Management',
    slug: 'hospital-supply-management',
    summary: 'Streamlining medical supply access with smart dispensing',
    content: 'Detailed case study content...',
    industry: 'Healthcare',
    solution: 'Medical Supply Dispensers',
    visible: true,
    image_url: '/images/case-studies/healthcare.jpg',
    image_alt: 'Healthcare supply management',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    results: [
      {
        id: '2-1',
        case_study_id: '2',
        text: '45% reduction in supply waste',
        display_order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2-2',
        case_study_id: '2',
        text: 'Improved inventory tracking accuracy to 99.8%',
        display_order: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  }
];

// Fetch all case studies
export const fetchCaseStudies = async (): Promise<CaseStudyWithRelations[]> => {
  logDeprecationWarning(
    "fetchCaseStudies",
    "Direct case studies API is deprecated.",
    "Please use Contentful API instead."
  );
  
  return mockCaseStudies;
};

// Fetch a case study by slug
export const fetchCaseStudyBySlug = async (slug: string): Promise<CaseStudyWithRelations | null> => {
  logDeprecationWarning(
    "fetchCaseStudyBySlug",
    "Direct case study API is deprecated.",
    "Please use Contentful API instead."
  );
  
  const caseStudy = mockCaseStudies.find(cs => cs.slug === slug) || null;
  return caseStudy;
};

// Create a new case study
export const createCaseStudy = async (data: CaseStudyFormData): Promise<CaseStudyWithRelations> => {
  logDeprecationWarning(
    "createCaseStudy",
    "Direct case study creation is deprecated.",
    "Please use Contentful to manage case studies."
  );
  
  const newId = Date.now().toString();
  
  const newCaseStudy: CaseStudyWithRelations = {
    id: newId,
    title: data.title,
    slug: data.slug,
    summary: data.summary,
    content: data.content,
    industry: data.industry,
    solution: data.solution,
    visible: data.visible,
    image_url: data.image_url,
    image_alt: data.image_alt || data.title,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    results: data.results.map((result, index) => ({
      id: `${newId}-${index}`,
      case_study_id: newId,
      text: result.text,
      display_order: index + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })),
    testimonial: data.testimonial ? {
      id: `${newId}-t`,
      case_study_id: newId,
      quote: data.testimonial.quote,
      author: data.testimonial.author,
      company: data.testimonial.company || '',
      position: data.testimonial.position || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } : undefined
  };
  
  // In a real implementation, we would save to a database
  mockCaseStudies.push(newCaseStudy);
  
  return newCaseStudy;
};

// Update an existing case study
export const updateCaseStudy = async (id: string, data: CaseStudyFormData): Promise<CaseStudyWithRelations> => {
  logDeprecationWarning(
    "updateCaseStudy",
    "Direct case study updating is deprecated.",
    "Please use Contentful to manage case studies."
  );
  
  const index = mockCaseStudies.findIndex(cs => cs.id === id);
  if (index === -1) {
    throw new Error(`Case study with ID ${id} not found`);
  }
  
  const updatedCaseStudy: CaseStudyWithRelations = {
    ...mockCaseStudies[index],
    title: data.title,
    slug: data.slug,
    summary: data.summary,
    content: data.content,
    industry: data.industry,
    solution: data.solution,
    visible: data.visible,
    image_url: data.image_url,
    image_alt: data.image_alt || data.title,
    updated_at: new Date().toISOString(),
    results: data.results.map((result, idx) => ({
      id: `${id}-${idx}`,
      case_study_id: id,
      text: result.text,
      display_order: idx + 1,
      created_at: mockCaseStudies[index].results[idx]?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))
  };
  
  if (data.testimonial) {
    updatedCaseStudy.testimonial = {
      id: mockCaseStudies[index].testimonial?.id || `${id}-t`,
      case_study_id: id,
      quote: data.testimonial.quote,
      author: data.testimonial.author,
      company: data.testimonial.company || '',
      position: data.testimonial.position || '',
      created_at: mockCaseStudies[index].testimonial?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
  
  // Update the mock data
  mockCaseStudies[index] = updatedCaseStudy;
  
  return updatedCaseStudy;
};

// Delete a case study
export const deleteCaseStudy = async (id: string): Promise<void> => {
  logDeprecationWarning(
    "deleteCaseStudy",
    "Direct case study deletion is deprecated.",
    "Please use Contentful to manage case studies."
  );
  
  const index = mockCaseStudies.findIndex(cs => cs.id === id);
  if (index === -1) {
    throw new Error(`Case study with ID ${id} not found`);
  }
  
  mockCaseStudies.splice(index, 1);
};

// Export the operations object for compatibility
export const caseStudyOperations = {
  getAll: fetchCaseStudies,
  getBySlug: fetchCaseStudyBySlug,
  create: createCaseStudy,
  update: updateCaseStudy,
  delete: deleteCaseStudy
};
