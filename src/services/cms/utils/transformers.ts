import { MachineData, MachineImage, MachineDeploymentExample } from '@/utils/machineMigration/types';

/**
 * Transform raw machine data from database to structured format
 */
export function transformMachineData<T>(data: any[]): T[] {
  if (!data || !Array.isArray(data)) {
    console.warn('[transformMachineData] Invalid data provided:', data);
    return [];
  }

  console.log(`[transformMachineData] Transforming ${data.length} machines`);
  
  return data.map(item => {
    try {
      // Process images
      const images = Array.isArray(item.machine_images) 
        ? item.machine_images.map((img: any) => ({
            url: img.url,
            alt: img.alt || '',
            width: img.width || undefined,
            height: img.height || undefined,
          }))
        : [];

      // Process specs as a key-value object - IMPROVED to preserve keys exactly as they appear in the database
      const specs: Record<string, string> = {};
      if (Array.isArray(item.machine_specs)) {
        // First log all specs as received from the database for debugging
        console.log(`[transformMachineData] Raw specs for ${item.title}:`, 
          item.machine_specs.map((spec: any) => ({ key: spec.key, value: spec.value }))
        );
        
        item.machine_specs.forEach((spec: any) => {
          // Only process specs that have both key and value defined
          if (spec.key && spec.value !== undefined) {
            let specValue = spec.value;
            
            // Try to extract a cleaner value if the value is stored as JSON
            try {
              const parsedValue = JSON.parse(spec.value);
              if (typeof parsedValue === 'object' && parsedValue !== null && 'value' in parsedValue) {
                specValue = parsedValue.value;
              }
            } catch (e) {
              // If it's not valid JSON, use the original value - no need to do anything
            }
            
            // CRITICAL: Use exactly the key from the database as the property name
            // This ensures we always display whatever key name the user has chosen
            specs[spec.key] = specValue;
            
            // Add extra debugging to confirm the spec was processed correctly
            console.log(`[transformMachineData] Processed spec "${spec.key}" = "${specs[spec.key]}"`);
          } else {
            console.warn(`[transformMachineData] Skipping invalid spec:`, spec);
          }
        });
      }
      
      // Log the specs format for debugging
      console.log(`[transformMachineData] Final transformed specs for ${item.title}:`, specs);

      // Process features
      const features = Array.isArray(item.machine_features)
        ? item.machine_features.sort((a: any, b: any) => a.display_order - b.display_order)
            .map((feature: any) => feature.feature)
        : [];

      // Process deployment examples
      const deploymentExamples = Array.isArray(item.deployment_examples)
        ? item.deployment_examples.sort((a: any, b: any) => a.display_order - b.display_order)
            .map((example: any) => ({
              title: example.title,
              description: example.description,
              image: {
                url: example.image_url,
                alt: example.image_alt || example.title,
              }
            }))
        : [];

      // Build the final machine object
      const machine = {
        id: item.id,
        slug: item.slug,
        title: item.title,
        type: item.type,
        temperature: item.temperature,
        description: item.description,
        images,
        specs,
        features,
        deploymentExamples,
      };

      return machine as unknown as T;
    } catch (error) {
      console.error(`[transformMachineData] Error processing machine ${item.id}:`, error);
      return null;
    }
  }).filter(Boolean) as T[];
}

/**
 * Transform raw product type data from database to structured format
 */
export function transformProductTypeData<T>(data: any[]): T[] {
  if (!data || !Array.isArray(data)) {
    console.warn('[transformProductTypeData] Invalid data provided:', data);
    return [];
  }

  console.log(`[transformProductTypeData] Transforming ${data.length} product types`);
  
  return data.map(item => {
    try {
      // Process images
      const images = Array.isArray(item.product_type_images) 
        ? item.product_type_images.map((img: any) => ({
            url: img.url,
            alt: img.alt || '',
            width: img.width || undefined,
            height: img.height || undefined,
          }))
        : [];

      // Use the first image as the primary image or provide a default
      const primaryImage = images.length > 0 ? images[0] : { url: '', alt: '' };
      
      // Process benefits with sort by display_order
      const benefits = Array.isArray(item.product_type_benefits)
        ? item.product_type_benefits
            .sort((a: any, b: any) => a.display_order - b.display_order)
            .map((benefit: any) => benefit.benefit)
        : [];

      // Process features with sort by display_order
      const features = Array.isArray(item.product_type_features)
        ? item.product_type_features
            .sort((a: any, b: any) => a.display_order - b.display_order)
            .map((feature: any) => {
              // Process feature images
              const featureImages = Array.isArray(feature.product_type_feature_images)
                ? feature.product_type_feature_images.map((img: any) => ({
                    url: img.url,
                    alt: img.alt || '',
                    width: img.width || undefined,
                    height: img.height || undefined,
                  }))
                : [];

              // Use the first feature image as the screenshot or provide a default
              const screenshot = featureImages.length > 0
                ? featureImages[0]
                : { url: '', alt: '' };

              return {
                title: feature.title,
                description: feature.description,
                icon: feature.icon || 'check',
                screenshot
              };
            })
        : [];

      // Build the final product type object
      const productType = {
        id: item.id,
        slug: item.slug,
        title: item.title,
        description: item.description,
        image: primaryImage,
        benefits,
        features,
      };

      console.log(`[transformProductTypeData] Transformed product type: ${item.title}`);
      return productType as unknown as T;
    } catch (error) {
      console.error(`[transformProductTypeData] Error processing product type ${item.id}:`, error);
      return null;
    }
  }).filter(Boolean) as T[];
}

// Add transformTechnologyData function
export async function transformTechnologyData(technology: any): Promise<any> {
  if (!technology) return null;
  
  // Transform section data if available
  let sections = [];
  if (technology.technology_sections) {
    sections = technology.technology_sections.map((section: any) => {
      // Transform features
      const features = section.technology_features ? section.technology_features.map((feature: any) => {
        // Transform feature items (bullet points)
        const items = feature.technology_feature_items ? 
          feature.technology_feature_items.map((item: any) => item.text) : 
          [];
          
        return {
          title: feature.title,
          description: feature.description,
          icon: feature.icon,
          items
        };
      }) : [];
      
      // Transform section images
      const sectionImages = section.technology_images ? 
        section.technology_images.map((image: any) => ({
          url: image.url,
          alt: image.alt,
          width: image.width,
          height: image.height
        })) : 
        [];
        
      return {
        type: section.section_type,
        title: section.title,
        description: section.description,
        features,
        images: sectionImages
      };
    });
  }
  
  // Transform technology images
  const images = technology.technology_images ? 
    technology.technology_images.filter((image: any) => image.section_id === null).map((image: any) => ({
      url: image.url,
      alt: image.alt,
      width: image.width,
      height: image.height
    })) : 
    [];
  
  // Build the technology object in our CMS format
  return {
    id: technology.id,
    slug: technology.slug,
    title: technology.title,
    description: technology.description,
    image: technology.image_url ? {
      url: technology.image_url,
      alt: technology.image_alt || technology.title
    } : null,
    sections,
    images
  };
}
