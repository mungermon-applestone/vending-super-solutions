
import { supabase } from '@/integrations/supabase/client';
import { useTechnologyData } from './technologyData';

/**
 * Migrates technology data to the Supabase database
 * 
 * MOCK IMPLEMENTATION: This function now creates only the main technology entry
 * and logs the rest of the operations without attempting to create related records
 * in non-existent tables
 */
export async function migrateTechnologyData() {
  console.log('Starting technology data migration...');
  
  try {
    const technologyData = useTechnologyData();
    
    // Create the main technology entry - only use the existing technologies table
    const { data: technology, error: techError } = await supabase
      .from('technologies')
      .insert({
        slug: 'enterprise-platform',
        title: 'Enterprise-Grade Technology',
        description: 'Our platform is built with security, scalability, and flexibility in mind. Connect any machine to our cloud infrastructure and unlock powerful retail automation capabilities.',
        image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
        image_alt: 'Technology platform',
        visible: true
      })
      .select('id')
      .single();
    
    if (techError) {
      throw new Error(`Failed to create technology: ${techError.message}`);
    }
    
    console.log('Created technology entry:', technology);
    
    // Mock architecture section (instead of actually creating it)
    console.log('MOCK: Would create architecture section with the following data:', {
      technology_id: technology.id,
      section_type: 'architecture',
      title: 'Cloud-Native Architecture',
      description: 'Our platform connects your machines to the cloud, enabling real-time monitoring, data analysis, and seamless integration with your business systems.',
      display_order: 1
    });
    
    // Mock security section (instead of actually creating it)
    console.log('MOCK: Would create security section with the following data:', {
      technology_id: technology.id,
      section_type: 'security',
      title: 'Enterprise Security',
      description: 'Our platform meets the highest industry standards for data protection, network security, and compliance requirements.',
      display_order: 2
    });
    
    // Mock integration section (instead of actually creating it)
    console.log('MOCK: Would create integration section with the following data:', {
      technology_id: technology.id,
      section_type: 'integration',
      title: 'Third-Party Integrations',
      description: 'Connect your vending operations with your existing business systems and third-party services for seamless data flow and process automation.',
      display_order: 3
    });
    
    // Mock architecture features
    const architectureFeatures = [
      {
        title: 'Edge Computing',
        description: 'Local processing at the machine level ensures continued operation even during connectivity interruptions.',
        icon: 'Network',
        display_order: 1
      },
      {
        title: 'Cloud Backend',
        description: 'Serverless architecture ensures automatic scaling and high availability for your retail automation platform.',
        icon: 'UploadCloud',
        display_order: 2
      },
      {
        title: 'APIs & Webhooks',
        description: 'Comprehensive API suite allows seamless integration with your existing systems and third-party services.',
        icon: 'ArrowDownToLine',
        display_order: 3
      }
    ];
    
    console.log('MOCK: Would create architecture features:', architectureFeatures);
    
    // Mock security features
    const securityFeatures = [
      {
        title: 'Data Protection',
        description: 'End-to-end encryption for all data in transit and at rest, with regular security audits and penetration testing.',
        icon: 'ShieldCheck',
        display_order: 1
      },
      {
        title: 'Compliance',
        description: 'Our platform meets industry standards and regulatory requirements for secure payment processing and data handling.',
        icon: 'CreditCard',
        display_order: 2
      }
    ];
    
    console.log('MOCK: Would create security features:', securityFeatures);
    
    // Mock integration features
    const integrationFeatures = [
      {
        title: 'ERP Systems',
        description: 'Bidirectional integration with major ERP systems including SAP, Oracle, and Microsoft Dynamics.',
        icon: 'Database',
        display_order: 1
      },
      {
        title: 'CRM Platforms',
        description: 'Connect customer data with Salesforce, HubSpot, and other major CRM platforms.',
        icon: 'Users',
        display_order: 2
      },
      {
        title: 'Marketing Tools',
        description: 'Connect with email marketing, SMS, and digital advertising platforms.',
        icon: 'Mail',
        display_order: 3
      }
    ];
    
    console.log('MOCK: Would create integration features:', integrationFeatures);
    
    console.log('Technology data migration completed successfully (MOCK)');
    return true;
  } catch (error) {
    console.error('Error during technology migration:', error);
    return false;
  }
}

/**
 * Checks if technology data exists in the database
 * Uses the technologies table only, which exists in the database
 */
export async function checkIfTechnologyDataExists() {
  const { count, error } = await supabase
    .from('technologies')
    .select('*', { count: 'exact', head: true });
    
  if (error) {
    console.error('Error checking technology data:', error);
    return false;
  }
  
  return count && count > 0;
}
