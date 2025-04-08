
/**
 * Utility functions for transforming raw CMS data into our application format
 */

/**
 * Transform raw product type data from Supabase into our CMS format
 */
export function transformProductTypeData<T>(data: any[]): T[] {
  if (!data || data.length === 0) {
    return [] as T[];
  }
  
  return data.map(productType => {
    const sortedBenefits = productType.product_type_benefits ? 
      [...productType.product_type_benefits].sort((a, b) => a.display_order - b.display_order) : 
      [];

    // Get unique benefits by creating a Set of them
    const uniqueBenefits = [...new Set(sortedBenefits.map((b: any) => b.benefit))];

    const image = productType.product_type_images && productType.product_type_images.length > 0 
      ? productType.product_type_images[0] 
      : null;
    
    const features = productType.product_type_features ? 
      [...productType.product_type_features]
        .sort((a: any, b: any) => a.display_order - b.display_order)
        .map((feature: any) => {
          const screenshot = feature.product_type_feature_images && 
            feature.product_type_feature_images.length > 0 ? 
            feature.product_type_feature_images[0] : 
            null;
          
          return {
            title: feature.title,
            description: feature.description,
            icon: feature.icon || undefined,
            screenshot: screenshot ? {
              url: screenshot.url,
              alt: screenshot.alt,
              width: screenshot.width,
              height: screenshot.height
            } : undefined
          };
        }) : 
      [];
    
    return {
      id: productType.id,
      slug: productType.slug,
      title: productType.title,
      description: productType.description,
      image: image ? {
        url: image.url,
        alt: image.alt,
        width: image.width,
        height: image.height
      } : { url: "https://via.placeholder.com/800x600", alt: "Placeholder image" },
      benefits: uniqueBenefits,
      features: features,
      examples: []
    } as unknown as T;
  });
}

/**
 * Transform machine data from Supabase into our application format
 */
export function transformMachineData<T>(machineData: any[]): T[] {
  return machineData.map(machine => {
    const sortedImages = machine.machine_images ? 
      [...machine.machine_images].sort((a, b) => a.display_order - b.display_order) : [];
    const sortedFeatures = machine.machine_features ? 
      [...machine.machine_features].sort((a, b) => a.display_order - b.display_order) : [];
    const sortedExamples = machine.deployment_examples ? 
      [...machine.deployment_examples].sort((a, b) => a.display_order - b.display_order) : [];
    
    return {
      id: machine.id,
      slug: machine.slug,
      title: machine.title,
      type: machine.type as "vending" | "locker",
      temperature: machine.temperature,
      description: machine.description,
      images: sortedImages.map(img => ({
        url: img.url,
        alt: img.alt,
        width: img.width,
        height: img.height
      })),
      specs: machine.machine_specs?.reduce((acc: Record<string, string>, spec) => {
        acc[spec.key] = spec.value;
        return acc;
      }, {} as Record<string, string>) || {},
      features: sortedFeatures.map(f => f.feature),
      deploymentExamples: sortedExamples.map(ex => ({
        title: ex.title,
        description: ex.description,
        image: {
          url: ex.image_url,
          alt: ex.image_alt
        }
      }))
    } as unknown as T;
  });
}
