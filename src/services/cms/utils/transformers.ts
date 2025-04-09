
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

      // Process specs as a key-value object
      const specs: Record<string, string> = {};
      if (Array.isArray(item.machine_specs)) {
        item.machine_specs.forEach((spec: any) => {
          if (spec.key && spec.value !== undefined) {
            specs[spec.key] = spec.value;
          }
        });
      }
      
      // Log the specs format for debugging
      console.log(`[transformMachineData] Transformed specs for ${item.title}:`, specs);

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
