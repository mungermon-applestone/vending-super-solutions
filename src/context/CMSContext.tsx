
import { createContext, useContext, ReactNode, useState } from 'react';
import { 
  CMSMachine, 
  CMSProductType,
  CMSBusinessGoal,
  CMSTestimonial,
  CMSTechnology
} from '@/types/cms';

interface CMSContextType {
  isLoading: boolean;
  error: Error | null;
  machines: CMSMachine[];
  productTypes: CMSProductType[];
  businessGoals: CMSBusinessGoal[];
  testimonials: CMSTestimonial[];
  technologies: CMSTechnology[];
  refreshData: () => Promise<void>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export function useCMS() {
  const context = useContext(CMSContext);
  if (context === undefined) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
}

interface CMSProviderProps {
  children: ReactNode;
  initialData?: {
    machines?: CMSMachine[];
    productTypes?: CMSProductType[];
    businessGoals?: CMSBusinessGoal[];
    testimonials?: CMSTestimonial[];
    technologies?: CMSTechnology[];
  };
}

export function CMSProvider({ children, initialData = {} }: CMSProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [machines, setMachines] = useState<CMSMachine[]>(initialData.machines || []);
  const [productTypes, setProductTypes] = useState<CMSProductType[]>(initialData.productTypes || []);
  const [businessGoals, setBusinessGoals] = useState<CMSBusinessGoal[]>(initialData.businessGoals || []);
  const [testimonials, setTestimonials] = useState<CMSTestimonial[]>(initialData.testimonials || []);
  const [technologies, setTechnologies] = useState<CMSTechnology[]>(initialData.technologies || []);

  async function refreshData() {
    setIsLoading(true);
    setError(null);
    try {
      // In a real implementation, we would fetch data from the CMS here
      // For now this is a placeholder for future implementation
      // const [machinesData, productTypesData, businessGoalsData, testimonialsData, technologiesData] = await Promise.all([
      //   cmsService.getMachines(),
      //   cmsService.getProductTypes(),
      //   cmsService.getBusinessGoals(),
      //   cmsService.getTestimonials(),
      //   cmsService.getTechnologies()
      // ]);
      
      // setMachines(machinesData);
      // setProductTypes(productTypesData);
      // setBusinessGoals(businessGoalsData);
      // setTestimonials(testimonialsData);
      // setTechnologies(technologiesData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      console.error('Error fetching CMS data:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const value = {
    isLoading,
    error,
    machines,
    productTypes,
    businessGoals,
    testimonials,
    technologies,
    refreshData
  };

  return <CMSContext.Provider value={value}>{children}</CMSContext.Provider>;
}
