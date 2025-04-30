import { CMSImage, CMSMachine } from '@/types/cms';

/**
 * Transform machine data from Supabase to our app's format
 */
export function transformMachineData(machinesData: any[]): CMSMachine[] {
  if (!machinesData || !Array.isArray(machinesData)) {
    console.warn('[transformMachineData] Invalid machines data:', machinesData);
    return [];
  }
  
  return machinesData.map(machine => {
    const images = (machine.machine_images || []).map((image: any) => ({
      id: image.id,
      url: image.url,
      alt: image.alt || machine.title,
      width: image.width,
      height: image.height
    })).sort((a: any, b: any) => (a.display_order || 999) - (b.display_order || 999));

    const specs: Record<string, string> = {};
    (machine.machine_specs || []).forEach((spec: any) => {
      if (spec.key) {
        specs[spec.key] = spec.value || '';
      }
    });

    const features = (machine.machine_features || [])
      .map((feature: any) => feature.feature)
      .filter(Boolean)
      .sort((a: any, b: any) => (a.display_order || 999) - (b.display_order || 999));

    const deploymentExamples = (machine.deployment_examples || []).map((example: any) => ({
      id: example.id,
      title: example.title,
      description: example.description,
      display_order: example.display_order,
      image: {
        id: `img-${example.id}`,
        url: example.image_url,
        alt: example.image_alt || example.title
      }
    })).sort((a: any, b: any) => (a.display_order || 999) - (b.display_order || 999));

    return {
      id: machine.id,
      slug: machine.slug,
      title: machine.title,
      type: machine.type,
      temperature: machine.temperature,
      description: machine.description,
      images,
      specs,
      features,
      deploymentExamples,
      visible: machine.visible,
      displayOrder: machine.display_order || null,
      showOnHomepage: machine.show_on_homepage || false,
      homepageOrder: machine.homepage_order || null
    };
  });
}
