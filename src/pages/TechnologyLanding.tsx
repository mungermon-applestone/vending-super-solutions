
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import CTASection from '@/components/common/CTASection';
import { Server, ShieldCheck, Globe, Wifi, Plug, HardDrive } from 'lucide-react';

const TechnologyLanding = () => {
  const [activeTab, setActiveTab] = useState("architecture");

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-vending-blue-dark mb-6">
                Our Technology Platform
              </h1>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl">
                Our vending management system is built on a robust, scalable architecture with security, flexibility, and reliability at its core.
              </p>
              <Button asChild className="btn-primary">
                <a href="#tech-details">Explore Our Technology</a>
              </Button>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1518770660439-4636190af475" 
                alt="Technology platform" 
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-vending-teal text-white p-4 rounded-lg shadow-lg hidden md:block">
                <p className="font-bold">Enterprise-grade architecture</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Overview - Architecture */}
      <section id="tech-details" className="py-16 bg-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-vending-blue-dark">Technology Overview</h2>
            <p className="subtitle mx-auto">
              Our platform is designed for technical excellence, security, and flexibility to support diverse vending operations.
            </p>
          </div>
          
          {/* Architecture Section */}
          <div className="bg-vending-gray p-8 rounded-lg shadow-md mb-16">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <div className="flex items-center mb-6">
                  <div className="bg-vending-blue p-2 rounded-full mr-3">
                    <Server className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-vending-blue-dark">Architecture</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Cloud-Native Platform</h4>
                    <p className="text-gray-700">
                      Built on a modern microservices architecture hosted in secure cloud environments, our platform provides enterprise-grade reliability and scalability.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Open Standards</h4>
                    <p className="text-gray-700">
                      We use industry-standard protocols and APIs to ensure compatibility with your existing systems and avoid vendor lock-in.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Hardware Agnostic</h4>
                    <p className="text-gray-700">
                      Our platform integrates with virtually any vending hardware through standard protocols like MDB, DEX, and custom interfaces as needed.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Edge Computing</h4>
                    <p className="text-gray-700">
                      Local processing ensures your machines continue to operate even during network outages, with automatic synchronization when connectivity is restored.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6" 
                  alt="System architecture" 
                  className="w-full h-auto rounded-lg shadow-md"
                />
                
                <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-lg mb-4">Technical Specifications</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>99.99% uptime SLA with geographic redundancy</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Kubernetes-orchestrated microservices for reliability</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>REST and GraphQL APIs for system integration</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Local caching with offline operation capabilities</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Event-driven architecture for real-time updates</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Security Section */}
          <div className="bg-vending-gray p-8 rounded-lg shadow-md mb-16">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <div className="flex items-center mb-6">
                  <div className="bg-vending-blue p-2 rounded-full mr-3">
                    <ShieldCheck className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-vending-blue-dark">Security</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Enterprise-Grade Security</h4>
                    <p className="text-gray-700">
                      Our platform is built with security as a foundational principle, with encryption at rest and in transit, role-based access controls, and regular security audits.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Compliance</h4>
                    <p className="text-gray-700">
                      We maintain compliance with PCI DSS, GDPR, CCPA, and other regulatory requirements to ensure your data is handled securely and responsibly.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Privacy</h4>
                    <p className="text-gray-700">
                      Your customer data is protected with industry-leading security practices, with clear privacy policies and data minimization principles.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Physical Security</h4>
                    <p className="text-gray-700">
                      Machine access is controlled through secure authentication methods, with tamper detection and automated alerts for suspicious activities.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1563986768609-322da13575f3" 
                  alt="Security infrastructure" 
                  className="w-full h-auto rounded-lg shadow-md"
                />
                
                <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-lg mb-4">Security Features</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>End-to-end encryption for all data</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Multi-factor authentication for admin access</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Regular penetration testing and security audits</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Automatic security patches and updates</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>SOC 2 Type II certified infrastructure</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Integrations Section */}
          <div className="bg-vending-gray p-8 rounded-lg shadow-md mb-16">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <div className="flex items-center mb-6">
                  <div className="bg-vending-blue p-2 rounded-full mr-3">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-vending-blue-dark">Third-Party Integrations</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Open API Platform</h4>
                    <p className="text-gray-700">
                      Our comprehensive API allows seamless integration with your existing business systems, including ERP, CRM, and accounting software.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Pre-Built Connectors</h4>
                    <p className="text-gray-700">
                      We offer ready-to-use integrations with popular platforms like Salesforce, SAP, Oracle, and Microsoft Dynamics to accelerate implementation.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Custom Integration Support</h4>
                    <p className="text-gray-700">
                      Our professional services team can build custom integrations for your unique requirements and legacy systems.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Webhooks and Events</h4>
                    <p className="text-gray-700">
                      Real-time event notifications allow your systems to react immediately to changes in inventory, sales, and machine status.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7" 
                  alt="System integrations" 
                  className="w-full h-auto rounded-lg shadow-md"
                />
                
                <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-lg mb-4">Integration Partners</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center justify-center p-4 bg-gray-50 rounded">
                      <span className="font-medium text-gray-600">Salesforce</span>
                    </div>
                    <div className="flex items-center justify-center p-4 bg-gray-50 rounded">
                      <span className="font-medium text-gray-600">SAP</span>
                    </div>
                    <div className="flex items-center justify-center p-4 bg-gray-50 rounded">
                      <span className="font-medium text-gray-600">Oracle</span>
                    </div>
                    <div className="flex items-center justify-center p-4 bg-gray-50 rounded">
                      <span className="font-medium text-gray-600">Microsoft</span>
                    </div>
                    <div className="flex items-center justify-center p-4 bg-gray-50 rounded">
                      <span className="font-medium text-gray-600">Slack</span>
                    </div>
                    <div className="flex items-center justify-center p-4 bg-gray-50 rounded">
                      <span className="font-medium text-gray-600">Zapier</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payments Section */}
          <div className="bg-vending-gray p-8 rounded-lg shadow-md mb-16">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <div className="flex items-center mb-6">
                  <div className="bg-vending-blue p-2 rounded-full mr-3">
                    <HardDrive className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-vending-blue-dark">Payments</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Multiple Payment Options</h4>
                    <p className="text-gray-700">
                      Support for credit/debit cards, mobile payments (Apple Pay, Google Pay), cash, loyalty programs, and custom payment methods.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Cashless First</h4>
                    <p className="text-gray-700">
                      Our platform prioritizes digital payment methods for convenience, security, and operational efficiency, while still supporting cash where needed.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Secure Processing</h4>
                    <p className="text-gray-700">
                      PCI-compliant payment processing with tokenization and encryption to protect sensitive financial information.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Settlement and Reporting</h4>
                    <p className="text-gray-700">
                      Comprehensive financial reporting with flexible settlement options and integration with major accounting systems.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1601597111158-2fceff292cdc" 
                  alt="Payment systems" 
                  className="w-full h-auto rounded-lg shadow-md"
                />
                
                <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-lg mb-4">Payment Features</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Contactless payment support (NFC)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Mobile wallet integration (Apple Pay, Google Pay)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>QR code payment options</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Subscription and account-based payments</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Real-time payment validation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Live Inventory Section */}
          <div className="bg-vending-gray p-8 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <div className="flex items-center mb-6">
                  <div className="bg-vending-blue p-2 rounded-full mr-3">
                    <Plug className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-vending-blue-dark">Live Inventory</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Real-Time Tracking</h4>
                    <p className="text-gray-700">
                      Monitor inventory levels across all machines in real-time, with alerts for low stock, expiring products, and sales trends.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Predictive Analytics</h4>
                    <p className="text-gray-700">
                      AI-powered demand forecasting helps optimize restocking schedules and product mix based on historical sales data and external factors.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Automated Replenishment</h4>
                    <p className="text-gray-700">
                      Set inventory thresholds for automatic reordering, with integration to your supply chain management system.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Smart Planogramming</h4>
                    <p className="text-gray-700">
                      Optimize product placement and pricing based on sales data and machine capacity to maximize revenue and minimize restocking frequency.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c" 
                  alt="Inventory management" 
                  className="w-full h-auto rounded-lg shadow-md"
                />
                
                <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-lg mb-4">Inventory Features</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Product expiration tracking and alerts</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Temperature monitoring for refrigerated units</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Visual planogram designer and optimizer</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Mobile inventory management app</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Waste reduction through smart rotation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </Layout>
  );
};

export default TechnologyLanding;
