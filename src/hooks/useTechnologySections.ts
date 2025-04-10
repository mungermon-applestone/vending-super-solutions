
import { useQuery } from '@tanstack/react-query';
import { TechnologySection } from '@/types/technology';
import { fetchTechnologies } from '@/services/cms/contentTypes/technologies';
import { CMSTechnology } from '@/types/cms';

// Transform CMS data to the format our components expect
const transformCMSDataToSections = (cmsData: CMSTechnology[] = []): TechnologySection[] => {
  return cmsData.map(technology => {
    // Extract features from technology sections
    const features = technology.sections?.flatMap(section => 
      section.features?.map(feature => ({
        icon: feature.icon || 'HelpCircle', // Fallback icon
        title: feature.title || '',
        description: feature.description || ''
      })) || []
    ) || [];
    
    // Return in the format expected by our components
    return {
      id: technology.slug,
      title: technology.title,
      description: technology.description,
      features: features.slice(0, 3), // Limit to 3 features per section for consistency
      image: technology.image_url || ''
    };
  });
};

// Fallback data in case database fetch fails or returns no results
const getFallbackTechnologyData = (): TechnologySection[] => [
  {
    id: 'architecture',
    title: 'Architecture',
    description: 'Our platform is built on a modern, scalable architecture that ensures reliability and performance for all your vending operations.',
    features: [
      {
        icon: 'Network',
        title: 'Cloud-native design',
        description: 'Built for scalability and resilience'
      },
      {
        icon: 'BarChart3',
        title: 'Real-time monitoring',
        description: 'Live tracking of machine status and performance'
      },
      {
        icon: 'Layers',
        title: 'Microservices approach',
        description: 'Modular components for maximum flexibility'
      }
    ],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31'
  },
  {
    id: 'security',
    title: 'Security',
    description: 'We take security seriously with multiple layers of protection for your data and operations.',
    features: [
      {
        icon: 'Shield',
        title: 'SOC 2 Type II certified',
        description: 'Enterprise-grade security compliance'
      },
      {
        icon: 'Lock',
        title: 'End-to-end encryption',
        description: 'Secure data transmission and storage'
      },
      {
        icon: 'Shield',
        title: 'Regular security audits',
        description: 'Ongoing penetration testing and vulnerability assessment'
      }
    ],
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3'
  },
  {
    id: 'third-party-integrations',
    title: 'Third-Party Integrations',
    description: 'Connect your vending operations with your existing business systems and third-party services for seamless data flow.',
    features: [
      {
        icon: 'Layers',
        title: 'ERP integrations',
        description: 'Connect with SAP, Oracle, Microsoft Dynamics and more'
      },
      {
        icon: 'Shuffle',
        title: 'CRM connections',
        description: 'Salesforce, HubSpot and other CRM platforms'
      },
      {
        icon: 'BarChart3',
        title: 'Analytics platforms',
        description: 'Export data to PowerBI, Tableau and other BI tools'
      }
    ],
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4'
  }
];

export const useTechnologySections = (): TechnologySection[] => {
  // Fetch data from database
  const { data: cmsData, isError } = useQuery({
    queryKey: ['technologies'],
    queryFn: fetchTechnologies,
  });
  
  // Transform CMS data if available, otherwise use fallback data
  if (cmsData && cmsData.length > 0 && !isError) {
    return transformCMSDataToSections(cmsData);
  }
  
  // Return fallback data if database fetch fails or returns no results
  return getFallbackTechnologyData();
};
