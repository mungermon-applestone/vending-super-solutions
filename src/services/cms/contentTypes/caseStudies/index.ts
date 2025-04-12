import { CaseStudyFormData, CaseStudyWithRelations } from "@/types/caseStudy";

// Mock implementation for case studies API
// In a real application, these would connect to your backend

const caseStudies: CaseStudyWithRelations[] = [
  {
    id: "1",
    title: "Increasing Revenue for Regional Hospital",
    slug: "regional-hospital-revenue",
    summary: "How a regional hospital increased vending revenue by 35% while improving patient satisfaction",
    content: "This case study explores how a major regional hospital implemented smart vending solutions to increase revenue and improve patient satisfaction...",
    solution: "We implemented a customized vending solution that addressed the specific needs of the Healthcare sector with hardware optimization, cloud-based management systems, integrated payment processing, and automated restocking notifications.",
    industry: "Healthcare",
    image_url: "https://images.unsplash.com/photo-1504439904031-93ded9f93e4e",
    image_alt: "Hospital hallway with modern vending machines",
    visible: true,
    created_at: "2023-06-10T00:00:00Z",
    updated_at: "2023-06-10T00:00:00Z",
    results: [
      {
        id: "r1",
        case_study_id: "1",
        text: "35% increase in vending revenue",
        display_order: 1,
        created_at: "2023-06-10T00:00:00Z",
        updated_at: "2023-06-10T00:00:00Z",
      },
      {
        id: "r2",
        case_study_id: "1",
        text: "48% decrease in maintenance calls",
        display_order: 2,
        created_at: "2023-06-10T00:00:00Z",
        updated_at: "2023-06-10T00:00:00Z",
      },
      {
        id: "r3",
        case_study_id: "1",
        text: "42% improvement in satisfaction ratings",
        display_order: 3,
        created_at: "2023-06-10T00:00:00Z",
        updated_at: "2023-06-10T00:00:00Z",
      }
    ],
    testimonial: {
      id: "t1",
      case_study_id: "1",
      quote: "The implementation of these smart vending solutions has not only increased our revenue but has significantly improved patient satisfaction scores.",
      author: "Dr. Jane Smith",
      position: "Hospital Administrator",
      company: "Regional Medical Center",
      created_at: "2023-06-10T00:00:00Z",
      updated_at: "2023-06-10T00:00:00Z",
    }
  },
  {
    id: "2",
    title: "Corporate Campus Refreshment Solution",
    slug: "corporate-campus-refreshment",
    summary: "Streamlining refreshment services across a multi-building tech campus with 3,000+ employees",
    content: "This tech company needed a modern solution to provide refreshments across their sprawling campus...",
    solution: "We installed a network of smart vending machines with centralized monitoring capabilities, cashless payment options, and inventory management that automatically triggered restocking when supplies ran low.",
    industry: "Technology",
    image_url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
    image_alt: "Modern office space with refreshment area",
    visible: true,
    created_at: "2023-07-15T00:00:00Z",
    updated_at: "2023-07-15T00:00:00Z",
    results: [
      {
        id: "r4",
        case_study_id: "2",
        text: "22% reduction in food service operational costs",
        display_order: 1,
        created_at: "2023-07-15T00:00:00Z",
        updated_at: "2023-07-15T00:00:00Z",
      },
      {
        id: "r5",
        case_study_id: "2",
        text: "300% expansion in available food options",
        display_order: 2,
        created_at: "2023-07-15T00:00:00Z",
        updated_at: "2023-07-15T00:00:00Z",
      },
      {
        id: "r6",
        case_study_id: "2",
        text: "Employee satisfaction improved from 65% to 91%",
        display_order: 3,
        created_at: "2023-07-15T00:00:00Z",
        updated_at: "2023-07-15T00:00:00Z",
      }
    ],
    testimonial: {
      id: "t2",
      case_study_id: "2",
      quote: "The smart vending solution has transformed how our employees access refreshments throughout the day, drastically improving satisfaction and productivity.",
      author: "Michael Chen",
      position: "Facilities Director",
      company: "TechCorp Inc.",
      created_at: "2023-07-15T00:00:00Z",
      updated_at: "2023-07-15T00:00:00Z",
    }
  },
  {
    id: "3",
    title: "Manufacturing Plant Productivity",
    slug: "manufacturing-plant-productivity",
    summary: "How smart vending solutions improved worker productivity and reduced downtime",
    content: "This manufacturing plant implemented vending solutions to reduce downtime and improve worker efficiency...",
    solution: "We developed a custom vending solution with strategic machine placement throughout the facility, specialized product selection based on department needs, and integration with employee ID badges for streamlined access.",
    industry: "Manufacturing",
    image_url: "https://images.unsplash.com/photo-1581091226033-c6e0b0cf8715",
    image_alt: "Manufacturing floor with vending solutions",
    visible: true,
    created_at: "2023-08-20T00:00:00Z",
    updated_at: "2023-08-20T00:00:00Z",
    results: [
      {
        id: "r7",
        case_study_id: "3",
        text: "15% reduction in break time",
        display_order: 1,
        created_at: "2023-08-20T00:00:00Z",
        updated_at: "2023-08-20T00:00:00Z",
      },
      {
        id: "r8",
        case_study_id: "3",
        text: "30% decrease in time spent away from workstations",
        display_order: 2,
        created_at: "2023-08-20T00:00:00Z",
        updated_at: "2023-08-20T00:00:00Z",
      },
      {
        id: "r9",
        case_study_id: "3",
        text: "Employee satisfaction increased by 22%",
        display_order: 3,
        created_at: "2023-08-20T00:00:00Z",
        updated_at: "2023-08-20T00:00:00Z",
      }
    ],
    testimonial: {
      id: "t3",
      case_study_id: "3",
      quote: "Our productivity metrics have significantly improved since implementing these vending solutions. Workers spend less time away from their stations.",
      author: "Robert Johnson",
      position: "Plant Manager",
      company: "Industrial Manufacturing Co.",
      created_at: "2023-08-20T00:00:00Z",
      updated_at: "2023-08-20T00:00:00Z",
    }
  }
];

// Fetch all case studies
export const fetchCaseStudies = async (): Promise<CaseStudyWithRelations[]> => {
  return caseStudies;
};

// Fetch a single case study by slug
export const fetchCaseStudyBySlug = async (slug: string): Promise<CaseStudyWithRelations | undefined> => {
  return caseStudies.find(study => study.slug === slug);
};

// Create a new case study
export const createCaseStudy = async (data: CaseStudyFormData): Promise<CaseStudyWithRelations> => {
  const newId = `case-${Date.now()}`;
  const timestamp = new Date().toISOString();
  
  const newResults = data.results.map((result, index) => ({
    id: `result-${Date.now()}-${index}`,
    case_study_id: newId,
    text: result.text,
    display_order: index + 1,
    created_at: timestamp,
    updated_at: timestamp,
  }));

  const newCaseStudy: CaseStudyWithRelations = {
    id: newId,
    title: data.title,
    slug: data.slug,
    summary: data.summary,
    content: data.content,
    solution: data.solution,
    industry: data.industry || '',
    image_url: data.image_url,
    image_alt: data.image_alt,
    visible: data.visible,
    created_at: timestamp,
    updated_at: timestamp,
    results: newResults
  };
  
  if (data.testimonial && data.testimonial.quote && data.testimonial.author) {
    newCaseStudy.testimonial = {
      id: `testimonial-${Date.now()}`,
      case_study_id: newId,
      quote: data.testimonial.quote,
      author: data.testimonial.author,
      company: data.testimonial.company,
      position: data.testimonial.position,
      created_at: timestamp,
      updated_at: timestamp,
    };
  }
  
  // Add to mock database
  caseStudies.push(newCaseStudy);
  
  return newCaseStudy;
};

// Update an existing case study
export const updateCaseStudy = async (id: string, data: CaseStudyFormData): Promise<CaseStudyWithRelations> => {
  const index = caseStudies.findIndex(study => study.id === id);
  if (index === -1) {
    throw new Error(`Case study with ID ${id} not found`);
  }
  
  const timestamp = new Date().toISOString();
  const updatedResults = data.results.map((result, i) => ({
    id: caseStudies[index].results[i]?.id || `result-${Date.now()}-${i}`,
    case_study_id: id,
    text: result.text,
    display_order: i + 1,
    created_at: caseStudies[index].results[i]?.created_at || timestamp,
    updated_at: timestamp,
  }));
  
  let updatedTestimonial = undefined;
  if (data.testimonial && data.testimonial.quote && data.testimonial.author) {
    updatedTestimonial = {
      id: caseStudies[index].testimonial?.id || `testimonial-${Date.now()}`,
      case_study_id: id,
      quote: data.testimonial.quote,
      author: data.testimonial.author,
      company: data.testimonial.company,
      position: data.testimonial.position,
      created_at: caseStudies[index].testimonial?.created_at || timestamp,
      updated_at: timestamp,
    };
  }
  
  const updatedCaseStudy: CaseStudyWithRelations = {
    ...caseStudies[index],
    title: data.title,
    slug: data.slug,
    summary: data.summary,
    content: data.content,
    solution: data.solution,
    industry: data.industry || '',
    image_url: data.image_url,
    image_alt: data.image_alt,
    visible: data.visible,
    updated_at: timestamp,
    results: updatedResults,
    testimonial: updatedTestimonial
  };
  
  caseStudies[index] = updatedCaseStudy;
  return updatedCaseStudy;
};

// Delete a case study
export const deleteCaseStudy = async (id: string): Promise<void> => {
  const index = caseStudies.findIndex(study => study.id === id);
  if (index === -1) {
    throw new Error(`Case study with ID ${id} not found`);
  }
  
  caseStudies.splice(index, 1);
};
