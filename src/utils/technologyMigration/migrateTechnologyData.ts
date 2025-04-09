
import { supabase } from '@/integrations/supabase/client';
import { useTechnologyData } from './technologyData';

export async function migrateTechnologyData() {
  console.log('Starting technology data migration...');
  
  try {
    const technologyData = useTechnologyData();
    
    // Create the main technology entry
    const { data: technology, error: techError } = await supabase
      .from('technologies')
      .insert({
        slug: 'enterprise-platform',
        title: 'Enterprise-Grade Technology',
        description: 'Our platform is built with security, scalability, and flexibility in mind. Connect any machine to our cloud infrastructure and unlock powerful retail automation capabilities.',
        image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
        image_alt: 'Technology platform'
      })
      .select('id')
      .single();
    
    if (techError) {
      throw new Error(`Failed to create technology: ${techError.message}`);
    }
    
    console.log('Created technology entry:', technology);
    
    // Create the architecture section
    const { data: architectureSection, error: archError } = await supabase
      .from('technology_sections')
      .insert({
        technology_id: technology.id,
        section_type: 'architecture',
        title: 'Cloud-Native Architecture',
        description: 'Our platform connects your machines to the cloud, enabling real-time monitoring, data analysis, and seamless integration with your business systems.',
        display_order: 1
      })
      .select('id')
      .single();
    
    if (archError) {
      throw new Error(`Failed to create architecture section: ${archError.message}`);
    }
    
    // Create the security section
    const { data: securitySection, error: secError } = await supabase
      .from('technology_sections')
      .insert({
        technology_id: technology.id,
        section_type: 'security',
        title: 'Enterprise Security',
        description: 'Our platform meets the highest industry standards for data protection, network security, and compliance requirements.',
        display_order: 2
      })
      .select('id')
      .single();
    
    if (secError) {
      throw new Error(`Failed to create security section: ${secError.message}`);
    }
    
    // Create the integration section
    const { data: integrationSection, error: intError } = await supabase
      .from('technology_sections')
      .insert({
        technology_id: technology.id,
        section_type: 'integration',
        title: 'Third-Party Integrations',
        description: 'Connect your vending operations with your existing business systems and third-party services for seamless data flow and process automation.',
        display_order: 3
      })
      .select('id')
      .single();
    
    if (intError) {
      throw new Error(`Failed to create integration section: ${intError.message}`);
    }
    
    // Add architecture features
    const architectureFeatures = [
      {
        section_id: architectureSection.id,
        title: 'Edge Computing',
        description: 'Local processing at the machine level ensures continued operation even during connectivity interruptions.',
        icon: 'Network',
        display_order: 1
      },
      {
        section_id: architectureSection.id,
        title: 'Cloud Backend',
        description: 'Serverless architecture ensures automatic scaling and high availability for your retail automation platform.',
        icon: 'UploadCloud',
        display_order: 2
      },
      {
        section_id: architectureSection.id,
        title: 'APIs & Webhooks',
        description: 'Comprehensive API suite allows seamless integration with your existing systems and third-party services.',
        icon: 'ArrowDownToLine',
        display_order: 3
      }
    ];
    
    const { error: featError } = await supabase
      .from('technology_features')
      .insert(architectureFeatures);
    
    if (featError) {
      throw new Error(`Failed to create architecture features: ${featError.message}`);
    }
    
    // Add security features
    const securityFeatures = [
      {
        section_id: securitySection.id,
        title: 'Data Protection',
        description: 'End-to-end encryption for all data in transit and at rest, with regular security audits and penetration testing.',
        icon: 'ShieldCheck',
        display_order: 1
      },
      {
        section_id: securitySection.id,
        title: 'Compliance',
        description: 'Our platform meets industry standards and regulatory requirements for secure payment processing and data handling.',
        icon: 'CreditCard',
        display_order: 2
      }
    ];
    
    const { error: secFeatError } = await supabase
      .from('technology_features')
      .insert(securityFeatures);
    
    if (secFeatError) {
      throw new Error(`Failed to create security features: ${secFeatError.message}`);
    }
    
    // Add integration features
    const integrationFeatures = [
      {
        section_id: integrationSection.id,
        title: 'ERP Systems',
        description: 'Bidirectional integration with major ERP systems including SAP, Oracle, and Microsoft Dynamics.',
        icon: 'Database',
        display_order: 1
      },
      {
        section_id: integrationSection.id,
        title: 'CRM Platforms',
        description: 'Connect customer data with Salesforce, HubSpot, and other major CRM platforms.',
        icon: 'Users',
        display_order: 2
      },
      {
        section_id: integrationSection.id,
        title: 'Marketing Tools',
        description: 'Connect with email marketing, SMS, and digital advertising platforms.',
        icon: 'Mail',
        display_order: 3
      }
    ];
    
    const { error: intFeatError } = await supabase
      .from('technology_features')
      .insert(integrationFeatures);
    
    if (intFeatError) {
      throw new Error(`Failed to create integration features: ${intFeatError.message}`);
    }
    
    console.log('Technology data migration completed successfully');
    return true;
  } catch (error) {
    console.error('Error during technology migration:', error);
    return false;
  }
}

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
