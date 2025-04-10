import React from 'react';
import { 
  Network,
  Shuffle,
  Layers,
  Shield,
  Lock,
  Plug,
  CreditCard,
  Wallet,
  BarChart3,
  Brain
} from 'lucide-react';
import { TechnologySection } from '@/types/technology';

export const useTechnologySections = (): TechnologySection[] => {
  const technologies: TechnologySection[] = [
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
      id: 'open-standards',
      title: 'Open Standards',
      description: 'We embrace open standards to ensure interoperability and future-proof your investment in vending technology.',
      features: [
        {
          icon: 'Shuffle',
          title: 'Industry-standard protocols',
          description: 'Compatible with MDB, DEX, and other vending standards'
        },
        {
          icon: 'Plug',
          title: 'Open APIs',
          description: 'Well-documented interfaces for custom integrations'
        },
        {
          icon: 'Layers',
          title: 'Standardized data formats',
          description: 'Consistent data structures for easy integration'
        }
      ],
      image: 'https://images.unsplash.com/photo-1617042375876-a13e36732a04'
    },
    {
      id: 'hardware-agnostic',
      title: 'Hardware Agnostic',
      description: 'Our platform works with virtually any vending hardware, allowing you to leverage existing investments or choose the best equipment for your needs.',
      features: [
        {
          icon: 'Layers',
          title: 'Universal compatibility',
          description: 'Works with machines from all major manufacturers'
        },
        {
          icon: 'Shuffle',
          title: 'Mixed fleet management',
          description: 'Manage different machine types from a single dashboard'
        },
        {
          icon: 'Network',
          title: 'Flexible telemetry options',
          description: 'Multiple connectivity choices to suit any environment'
        }
      ],
      image: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b'
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
      id: 'privacy',
      title: 'Privacy',
      description: 'Our platform is designed with privacy-first principles, ensuring compliance with global regulations and protecting customer data.',
      features: [
        {
          icon: 'Lock',
          title: 'GDPR compliant',
          description: 'Meeting European data protection standards'
        },
        {
          icon: 'Shield',
          title: 'Data minimization',
          description: 'Only collecting what\'s necessary for operation'
        },
        {
          icon: 'Shield',
          title: 'Customer consent management',
          description: 'Tools to manage privacy preferences and consent'
        }
      ],
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'
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
    },
    {
      id: 'payments',
      title: 'Payments',
      description: 'Our payment processing system supports all major payment methods and providers, maximizing convenience for your customers.',
      features: [
        {
          icon: 'CreditCard',
          title: 'Multiple payment options',
          description: 'Credit cards, debit cards, and digital wallets'
        },
        {
          icon: 'CreditCard',
          title: 'PCI DSS compliance',
          description: 'Highest standards for payment security'
        },
        {
          icon: 'BarChart3',
          title: 'Detailed transaction reporting',
          description: 'Comprehensive analytics for all transactions'
        }
      ],
      image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df'
    },
    {
      id: 'cashless',
      title: 'Cashless',
      description: 'Enable frictionless purchases with our comprehensive cashless payment solutions for modern consumers.',
      features: [
        {
          icon: 'Wallet',
          title: 'Mobile payments',
          description: 'Apple Pay, Google Pay, and other mobile wallets'
        },
        {
          icon: 'Layers',
          title: 'Contactless cards',
          description: 'Support for NFC and tap-to-pay technologies'
        },
        {
          icon: 'CreditCard',
          title: 'Customer accounts',
          description: 'Stored value and subscription options'
        }
      ],
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3'
    },
    {
      id: 'live-inventory',
      title: 'Live Inventory',
      description: 'Real-time inventory management ensures optimal stock levels and minimizes out-of-stock situations.',
      features: [
        {
          icon: 'BarChart3',
          title: 'Real-time monitoring',
          description: 'Live tracking of product levels across all machines'
        },
        {
          icon: 'Network',
          title: 'Automated alerts',
          description: 'Instant notifications for low stock and anomalies'
        },
        {
          icon: 'BarChart3',
          title: 'Demand forecasting',
          description: 'AI-powered prediction of inventory needs'
        }
      ],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71'
    },
    {
      id: 'ai',
      title: 'AI',
      description: 'Artificial intelligence and machine learning capabilities drive insights, automation, and optimization across your vending operations.',
      features: [
        {
          icon: 'Brain',
          title: 'Predictive analytics',
          description: 'Forecast sales, maintenance needs, and inventory requirements'
        },
        {
          icon: 'Brain',
          title: 'Personalization engine',
          description: 'Tailor customer experiences based on preferences and history'
        },
        {
          icon: 'BarChart3',
          title: 'Anomaly detection',
          description: 'Identify unusual patterns that may indicate issues'
        }
      ],
      image: 'https://images.unsplash.com/photo-1677442135136-760c813dce1b'
    }
  ];
  
  return technologies;
};
