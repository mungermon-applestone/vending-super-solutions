
import { LandingPage } from '@/types/landingPage';
import { v4 as uuidv4 } from 'uuid';

// Default mock landing pages
export function getMockLandingPages(): LandingPage[] {
  const timestamp = new Date().toISOString();
  
  return [
    {
      id: uuidv4(),
      page_key: 'home',
      page_name: 'Home Page',
      hero_content_id: uuidv4(),
      hero_content: {
        id: uuidv4(),
        title: 'Vend Anything You Sell',
        subtitle: 'Seamlessly integrate multiple vending machines with our advanced software solution. Sell any product, track inventory in real-time, and boost your revenue.',
        image_url: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
        image_alt: 'Vending Machine Software Interface',
        cta_primary_text: 'Request a Demo',
        cta_primary_url: '/contact',
        cta_secondary_text: 'Explore Solutions',
        cta_secondary_url: '/products',
        background_class: 'bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light',
        created_at: timestamp,
        updated_at: timestamp
      },
      created_at: timestamp,
      updated_at: timestamp
    },
    {
      id: uuidv4(),
      page_key: 'products',
      page_name: 'Products Page',
      hero_content_id: uuidv4(),
      hero_content: {
        id: uuidv4(),
        title: 'Custom Vending Solutions for Any Product',
        subtitle: 'From food and beverages to electronics and PPE, our flexible vending solutions can accommodate nearly any product type.',
        image_url: 'https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e',
        image_alt: 'Various products in vending machine display',
        cta_primary_text: 'Request Product Demo',
        cta_primary_url: '/contact',
        cta_secondary_text: 'View Machine Types',
        cta_secondary_url: '/machines',
        background_class: 'bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light',
        created_at: timestamp,
        updated_at: timestamp
      },
      created_at: timestamp,
      updated_at: timestamp
    },
    {
      id: uuidv4(),
      page_key: 'machines',
      page_name: 'Machines Page',
      hero_content_id: uuidv4(),
      hero_content: {
        id: uuidv4(),
        title: 'Our Machines',
        subtitle: 'Explore our comprehensive range of vending machines and smart lockers designed to meet diverse business needs.',
        image_url: 'https://images.unsplash.com/photo-1493723843671-1d655e66ac1c',
        image_alt: 'Various vending machines',
        cta_primary_text: 'Vending Machines',
        cta_primary_url: '#vending-machines',
        cta_secondary_text: 'Smart Lockers',
        cta_secondary_url: '#smart-lockers',
        background_class: 'bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light',
        created_at: timestamp,
        updated_at: timestamp
      },
      created_at: timestamp,
      updated_at: timestamp
    },
    {
      id: uuidv4(),
      page_key: 'technology',
      page_name: 'Technology Page',
      hero_content_id: uuidv4(),
      hero_content: {
        id: uuidv4(),
        title: 'Enterprise-Grade Technology',
        subtitle: 'Our platform is built with security, scalability, and flexibility in mind to power your vending operations.',
        image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
        image_alt: 'Technology circuit board and digital interface',
        cta_primary_text: 'Learn More',
        cta_primary_url: '/contact',
        cta_secondary_text: 'View Tech Specs',
        cta_secondary_url: '#tech-details',
        background_class: 'bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light',
        created_at: timestamp,
        updated_at: timestamp
      },
      created_at: timestamp,
      updated_at: timestamp
    },
    {
      id: uuidv4(),
      page_key: 'business-goals',
      page_name: 'Business Goals Page',
      hero_content_id: uuidv4(),
      hero_content: {
        id: uuidv4(),
        title: 'Business Goals',
        subtitle: 'Our comprehensive vending solutions help you achieve your business goals with powerful technology and customizable options.',
        image_url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984',
        image_alt: 'Business Goals',
        cta_primary_text: 'Request a Demo',
        cta_primary_url: '/contact',
        cta_secondary_text: 'Explore Solutions',
        cta_secondary_url: '/products',
        background_class: 'bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light',
        created_at: timestamp,
        updated_at: timestamp
      },
      created_at: timestamp,
      updated_at: timestamp
    }
  ];
}
