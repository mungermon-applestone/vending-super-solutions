
import { CMSImage, CMSMachine } from '@/types/cms';

/**
 * Transforms raw machine data from the database into the application's CMSMachine format.
 * @param data Raw machine data from the database
 * @returns Array of transformed CMSMachine objects
 */
export function transformMachineData(data: any[]): CMSMachine[] {
  if (!data || !Array.isArray(data)) return [];
  
  return data.map(machine => {
    // Extract and transform machine images
    const images: CMSImage[] = machine.machine_images && Array.isArray(machine.machine_images)
      ? machine.machine_images
          .sort((a: any, b: any) => (a.display_order || 999) - (b.display_order || 999))
          .map((img: any) => ({
            id: img.id,
            url: img.url,
            alt: img.alt || machine.title
          }))
      : [];
    
    // Extract machine features as simple array of strings
    const features: string[] = machine.machine_features && Array.isArray(machine.machine_features)
      ? machine.machine_features
          .sort((a: any, b: any) => (a.display_order || 999) - (b.display_order || 999))
          .map((feat: any) => feat.feature)
      : [];
    
    // Extract machine specs into a key-value object
    const specs: Record<string, string> = {};
    if (machine.machine_specs && Array.isArray(machine.machine_specs)) {
      machine.machine_specs.forEach((spec: any) => {
        if (spec.key) specs[spec.key] = spec.value || '';
      });
    }
    
    // Transform to CMSMachine format
    return {
      id: machine.id,
      slug: machine.slug,
      title: machine.title,
      type: machine.type || 'vending',
      temperature: machine.temperature || 'ambient',
      description: machine.description || '',
      visible: true,  // We already filter for visible=true in the query
      images,
      features,
      specs,
      displayOrder: machine.display_order || undefined,
      showOnHomepage: !!machine.show_on_homepage,
      homepageOrder: machine.homepage_order || undefined,
      product_types: [],  // These would be filled in another place
      business_goals: []  // These would be filled in another place
    };
  });
}
