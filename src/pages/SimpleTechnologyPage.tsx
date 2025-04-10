
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import InquiryForm from '@/components/machines/contact/InquiryForm';
import { Button } from '@/components/ui/button';
import { 
  Cloud, 
  Wifi, 
  Settings, 
  Shield, 
  BarChart, 
  CreditCard,
  Smartphone,
  Lock,
  Database,
  Bell,
  Battery,
  ClipboardCheck,
  UserCheck,
  RefreshCcw,
  TrendingUp,
  PieChart,
  Map,
  LayoutGrid
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
  cta?: {
    label: string;
    link: string;
  };
}

const SimpleTechnologyPage = () => {
  const technologies: TechnologySection[] = [
    {
      id: 'cloud-management',
      title: 'Cloud-Based Management',
      description: 'Our cloud-based management system allows you to monitor and manage your vending machines from anywhere in the world.',
      features: [
        {
          icon: <BarChart className="h-5 w-5 text-blue-500" />,
          title: 'Real-time Monitoring',
          description: 'Track sales, inventory, and machine status in real-time'
        },
        {
          icon: <Settings className="h-5 w-5 text-blue-500" />,
          title: 'Remote Management',
          description: 'Update prices, products, and settings remotely'
        },
        {
          icon: <Bell className="h-5 w-5 text-blue-500" />,
          title: 'Automated Alerts',
          description: 'Receive notifications for low inventory, maintenance needs, or unusual activity'
        }
      ],
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
      cta: {
        label: 'Learn more about cloud management',
        link: '/contact'
      }
    },
    {
      id: 'iot-connectivity',
      title: 'IoT Connectivity',
      description: 'Our machines use advanced IoT technology to stay connected and provide real-time data and control.',
      features: [
        {
          icon: <Wifi className="h-5 w-5 text-blue-500" />,
          title: 'Multiple connectivity options',
          description: 'Cellular, Wi-Fi, and Ethernet'
        },
        {
          icon: <Battery className="h-5 w-5 text-blue-500" />,
          title: 'Low-power operation',
          description: 'Extended battery life'
        },
        {
          icon: <Lock className="h-5 w-5 text-blue-500" />,
          title: 'Secure communication',
          description: 'End-to-end encryption'
        }
      ],
      image: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b',
      cta: {
        label: 'Explore IoT capabilities',
        link: '/contact'
      }
    },
    {
      id: 'security',
      title: 'Enterprise-Grade Security',
      description: 'We take security seriously with multiple layers of protection for your data and operations.',
      features: [
        {
          icon: <Shield className="h-5 w-5 text-blue-500" />,
          title: 'SOC 2 Type II certified',
          description: 'Enterprise-grade security'
        },
        {
          icon: <UserCheck className="h-5 w-5 text-blue-500" />,
          title: 'Role-based access control',
          description: 'With multi-factor authentication'
        },
        {
          icon: <ClipboardCheck className="h-5 w-5 text-blue-500" />,
          title: 'Regular security audits',
          description: 'Penetration testing and compliance checks'
        }
      ],
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3',
      cta: {
        label: 'Learn about our security',
        link: '/contact'
      }
    },
    {
      id: 'payment-processing',
      title: 'Flexible Payment Processing',
      description: 'Accept all popular payment methods to maximize sales and customer satisfaction.',
      features: [
        {
          icon: <CreditCard className="h-5 w-5 text-blue-500" />,
          title: 'Multiple payment options',
          description: 'Credit cards, mobile payments, and contactless'
        },
        {
          icon: <Smartphone className="h-5 w-5 text-blue-500" />,
          title: 'Mobile app integration',
          description: 'Custom branded payment applications'
        },
        {
          icon: <RefreshCcw className="h-5 w-5 text-blue-500" />,
          title: 'Automatic reconciliation',
          description: 'Seamless transaction reporting and accounting'
        }
      ],
      image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df',
      cta: {
        label: 'Explore payment options',
        link: '/contact'
      }
    },
    {
      id: 'analytics',
      title: 'Advanced Analytics',
      description: 'Powerful insights to optimize your vending operations and increase revenue.',
      features: [
        {
          icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
          title: 'Sales performance tracking',
          description: 'Monitor trends across locations and product types'
        },
        {
          icon: <PieChart className="h-5 w-5 text-blue-500" />,
          title: 'Inventory optimization',
          description: 'Data-driven restocking recommendations'
        },
        {
          icon: <Map className="h-5 w-5 text-blue-500" />,
          title: 'Location analysis',
          description: 'Identify optimal placement for maximum returns'
        }
      ],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
      cta: {
        label: 'Discover our analytics',
        link: '/contact'
      }
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

                {tech.cta && (
                  <Button asChild variant="outline" className="mt-2">
                    <Link to={tech.cta.link}>
                      {tech.cta.label}
                    </Link>
                  </Button>
                )}
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
