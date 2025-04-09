import { CMSMachine, CMSProductType, CMSBusinessGoal, CMSTestimonial, CMSTechnology } from '@/types/cms';

// Error handling utility
export function handleError(functionName: string, error: unknown): never {
  console.error(`[${functionName}] Error:`, error);
  throw error;
}

// Transform database machine data to CMS format
export async function transformMachineData(data: any): Promise<any> {
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

// Transform database product type data to CMS format
export async function transformProductTypeData(data: any): Promise<any> {
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

// Transform database business goal data to CMS format
export async function transformBusinessGoalData(data: any): Promise<any> {
  if (!data || !Array.isArray(data)) {
    console.warn('[transformBusinessGoalData] Invalid data provided:', data);
    return [];
  }

  console.log(`[transformBusinessGoalData] Transforming ${data.length} business goals`);
  
  return data.map(item => {
    try {
      // Process images
      const images = Array.isArray(item.business_goal_images) 
        ? item.business_goal_images.map((img: any) => ({
            url: img.url,
            alt: img.alt || '',
            width: img.width || undefined,
            height: img.height || undefined,
          }))
        : [];

      // Use the first image as the primary image or provide a default
      const primaryImage = images.length > 0 ? images[0] : { url: '', alt: '' };
      
      // Build the final business goal object
      const businessGoal = {
        id: item.id,
        slug: item.slug,
        title: item.title,
        description: item.description,
        image: primaryImage,
      };

      console.log(`[transformBusinessGoalData] Transformed business goal: ${item.title}`);
      return businessGoal as unknown as T;
    } catch (error) {
      console.error(`[transformBusinessGoalData] Error processing business goal ${item.id}:`, error);
      return null;
    }
  }).filter(Boolean) as T[];
}

// Transform database testimonial data to CMS format
export async function transformTestimonialData(data: any): Promise<any> {
  if (!data || !Array.isArray(data)) {
    console.warn('[transformTestimonialData] Invalid data provided:', data);
    return [];
  }

  console.log(`[transformTestimonialData] Transforming ${data.length} testimonials`);
  
  return data.map(item => {
    try {
      // Process images
      const images = Array.isArray(item.testimonial_images) 
        ? item.testimonial_images.map((img: any) => ({
            url: img.url,
            alt: img.alt || '',
            width: img.width || undefined,
            height: img.height || undefined,
          }))
        : [];

      // Use the first image as the primary image or provide a default
      const primaryImage = images.length > 0 ? images[0] : { url: '', alt: '' };
      
      // Build the final testimonial object
      const testimonial = {
        id: item.id,
        slug: item.slug,
        title: item.title,
        description: item.description,
        image: primaryImage,
      };

      console.log(`[transformTestimonialData] Transformed testimonial: ${item.title}`);
      return testimonial as unknown as T;
    } catch (error) {
      console.error(`[transformTestimonialData] Error processing testimonial ${item.id}:`, error);
      return null;
    }
  }).filter(Boolean) as T[];
}

// Transform database technology data to CMS format
export async function transformTechnologyData(data: any): Promise<CMSTechnology> {
  try {
    // Extract sections and organize their features
    const sections = data.technology_sections ? 
      data.technology_sections.map((section: any) => {
        // Extract features for this section
        const features = section.technology_features ? 
          section.technology_features.map((feature: any) => {
            // Extract feature items if available
            const items = feature.technology_feature_items ? 
              feature.technology_feature_items
                .sort((a: any, b: any) => a.display_order - b.display_order)
                .map((item: any) => item.text) : 
              [];
            
            return {
              id: feature.id,
              title: feature.title,
              description: feature.description,
              icon: feature.icon,
              items
            };
          }) :
          [];

        // Extract images specific to this section
        const sectionImages = section.technology_images ? 
          section.technology_images
            .sort((a: any, b: any) => a.display_order - b.display_order)
            .map((img: any) => ({
              url: img.url,
              alt: img.alt,
              width: img.width,
              height: img.height
            })) : 
          [];

        return {
          id: section.id,
          type: section.section_type,
          title: section.title,
          description: section.description,
          features: features.sort((a: any, b: any) => a.display_order - b.display_order),
          images: sectionImages
        };
      }) :
      [];

    // Extract technology-level images
    const images = data.technology_images ?
      data.technology_images
        .filter((img: any) => !img.section_id)
        .sort((a: any, b: any) => a.display_order - b.display_order)
        .map((img: any) => ({
          url: img.url,
          alt: img.alt,
          width: img.width,
          height: img.height
        })) :
      [];
        
    // Prepare main image if available
    const mainImage = images.length ? images[0] : undefined;

    // Return transformed data in CMS format
    return {
      id: data.id,
      slug: data.slug,
      title: data.title,
      description: data.description,
      image: mainImage,
      sections: sections.sort((a: any, b: any) => a.display_order - b.display_order),
      images,
      visible: data.visible || false
    };
  } catch (error) {
    console.error('[transformTechnologyData] Error:', error);
    console.error('[transformTechnologyData] Input data:', data);
    throw new Error(`Failed to transform technology data: ${error}`);
  }
}
