
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import InquiryForm from '@/components/machines/contact/InquiryForm';
import { Button } from '@/components/ui/button';
import { 
  LayoutGrid,
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
import { cn } from '@/lib/utils';

interface TechFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface TechnologySection {
  id: string;
  title: string;
  description: string;
  features: TechFeature[];
  image: string;
}

const SimpleTechnologyPage = () => {
  const technologies: TechnologySection[] = [
    {
      id: 'architecture',
      title: 'Architecture',
      description: 'Our platform is built on a modern, scalable architecture that ensures reliability and performance for all your vending operations.',
      features: [
        {
          icon: <Network className="h-5 w-5 text-blue-500" />,
          title: 'Cloud-native design',
          description: 'Built for scalability and resilience'
        },
        {
          icon: <BarChart3 className="h-5 w-5 text-blue-500" />,
          title: 'Real-time monitoring',
          description: 'Live tracking of machine status and performance'
        },
        {
          icon: <Layers className="h-5 w-5 text-blue-500" />,
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
          icon: <Shuffle className="h-5 w-5 text-blue-500" />,
          title: 'Industry-standard protocols',
          description: 'Compatible with MDB, DEX, and other vending standards'
        },
        {
          icon: <Plug className="h-5 w-5 text-blue-500" />,
          title: 'Open APIs',
          description: 'Well-documented interfaces for custom integrations'
        },
        {
          icon: <LayoutGrid className="h-5 w-5 text-blue-500" />,
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
          icon: <Layers className="h-5 w-5 text-blue-500" />,
          title: 'Universal compatibility',
          description: 'Works with machines from all major manufacturers'
        },
        {
          icon: <Shuffle className="h-5 w-5 text-blue-500" />,
          title: 'Mixed fleet management',
          description: 'Manage different machine types from a single dashboard'
        },
        {
          icon: <Network className="h-5 w-5 text-blue-500" />,
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
          icon: <Shield className="h-5 w-5 text-blue-500" />,
          title: 'SOC 2 Type II certified',
          description: 'Enterprise-grade security compliance'
        },
        {
          icon: <Lock className="h-5 w-5 text-blue-500" />,
          title: 'End-to-end encryption',
          description: 'Secure data transmission and storage'
        },
        {
          icon: <Shield className="h-5 w-5 text-blue-500" />,
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
          icon: <Lock className="h-5 w-5 text-blue-500" />,
          title: 'GDPR compliant',
          description: 'Meeting European data protection standards'
        },
        {
          icon: <Shield className="h-5 w-5 text-blue-500" />,
          title: 'Data minimization',
          description: 'Only collecting what\'s necessary for operation'
        },
        {
          icon: <Shield className="h-5 w-5 text-blue-500" />,
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
          icon: <Layers className="h-5 w-5 text-blue-500" />,
          title: 'ERP integrations',
          description: 'Connect with SAP, Oracle, Microsoft Dynamics and more'
        },
        {
          icon: <Shuffle className="h-5 w-5 text-blue-500" />,
          title: 'CRM connections',
          description: 'Salesforce, HubSpot and other CRM platforms'
        },
        {
          icon: <BarChart3 className="h-5 w-5 text-blue-500" />,
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
          icon: <CreditCard className="h-5 w-5 text-blue-500" />,
          title: 'Multiple payment options',
          description: 'Credit cards, debit cards, and digital wallets'
        },
        {
          icon: <CreditCard className="h-5 w-5 text-blue-500" />,
          title: 'PCI DSS compliance',
          description: 'Highest standards for payment security'
        },
        {
          icon: <BarChart3 className="h-5 w-5 text-blue-500" />,
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
          icon: <Wallet className="h-5 w-5 text-blue-500" />,
          title: 'Mobile payments',
          description: 'Apple Pay, Google Pay, and other mobile wallets'
        },
        {
          icon: <Layers className="h-5 w-5 text-blue-500" />,
          title: 'Contactless cards',
          description: 'Support for NFC and tap-to-pay technologies'
        },
        {
          icon: <CreditCard className="h-5 w-5 text-blue-500" />,
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
          icon: <BarChart3 className="h-5 w-5 text-blue-500" />,
          title: 'Real-time monitoring',
          description: 'Live tracking of product levels across all machines'
        },
        {
          icon: <Network className="h-5 w-5 text-blue-500" />,
          title: 'Automated alerts',
          description: 'Instant notifications for low stock and anomalies'
        },
        {
          icon: <BarChart3 className="h-5 w-5 text-blue-500" />,
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
          icon: <Brain className="h-5 w-5 text-blue-500" />,
          title: 'Predictive analytics',
          description: 'Forecast sales, maintenance needs, and inventory requirements'
        },
        {
          icon: <Brain className="h-5 w-5 text-blue-500" />,
          title: 'Personalization engine',
          description: 'Tailor customer experiences based on preferences and history'
        },
        {
          icon: <BarChart3 className="h-5 w-5 text-blue-500" />,
          title: 'Anomaly detection',
          description: 'Identify unusual patterns that may indicate issues'
        }
      ],
      image: 'https://images.unsplash.com/photo-1677442135136-760c813dce1b'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-50 to-slate-100 py-16">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-vending-blue-dark mb-6">
              Our Technology Platform
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Powerful, reliable, and secure technology solutions designed specifically for the vending industry
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="bg-vending-blue hover:bg-vending-blue-dark">
                <Link to="/contact">Request a Demo</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="flex items-center gap-2">
                <Link to="/technology">
                  <LayoutGrid size={16} /> View Detailed Layout
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Sections */}
      {technologies.map((tech, index) => (
        <section 
          key={tech.id} 
          id={tech.id}
          className={cn(
            "py-16 md:py-24",
            index % 2 === 1 ? "bg-slate-50" : "bg-white"
          )}
        >
          <div className="container max-w-7xl mx-auto px-4">
            <div className={cn(
              "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center",
              index % 2 === 1 ? "lg:flex-row-reverse" : ""
            )}>
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <h2 className="text-3xl md:text-4xl font-bold text-vending-blue-dark mb-6">
                  {tech.title}
                </h2>
                <p className="text-lg text-gray-700 mb-8">
                  {tech.description}
                </p>

                <div className="space-y-6 mb-8">
                  {tech.features.map((feature, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 mt-1 rounded-full bg-blue-50 p-2">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={cn(
                "relative rounded-lg overflow-hidden shadow-lg h-80 lg:h-96",
                index % 2 === 1 ? "lg:order-1" : ""
              )}>
                <img
                  src={tech.image}
                  alt={tech.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Contact Form */}
      <InquiryForm title="Technology Solutions" />
    </Layout>
  );
};

export default SimpleTechnologyPage;
