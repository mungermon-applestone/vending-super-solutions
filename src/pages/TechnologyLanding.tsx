
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import CTASection from '@/components/common/CTASection';
import { Wifi } from '@/components/ui/Wifi';
import { 
  ShieldCheck, 
  Network, 
  CreditCard, 
  BarChart4, 
  CheckCircle, 
  ArrowDownToLine, 
  UploadCloud, 
  Settings 
} from 'lucide-react';

const TechnologyLanding = () => {
  const location = useLocation();

  // Handle scrolling to anchor when hash changes
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light py-16">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-vending-blue-dark mb-6">
                Enterprise-Grade Technology
              </h1>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl">
                Our platform is built with security, scalability, and flexibility in mind. 
                Connect any machine to our cloud infrastructure and unlock powerful retail automation capabilities.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#architecture" className="btn-secondary">Architecture</a>
                <a href="#security" className="btn-secondary">Security</a>
                <a href="#integrations" className="btn-secondary">Integrations</a>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31" 
                alt="Technology platform" 
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-vending-teal text-white p-4 rounded-lg shadow-lg hidden md:block">
                <p className="font-bold">Cloud-native architecture</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="py-16 bg-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Cloud-Native Architecture</h2>
            <p className="subtitle mx-auto">
              Our platform connects your machines to the cloud, enabling real-time monitoring, 
              data analysis, and seamless integration with your business systems.
            </p>
          </div>

          <div className="relative py-12 px-4">
            <div className="absolute inset-0 flex justify-center items-center opacity-5">
              <Wifi className="w-full max-w-3xl h-auto" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                <div className="bg-vending-blue-light p-3 rounded-full w-14 h-14 flex items-center justify-center text-vending-blue mb-4">
                  <Network className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Edge Computing</h3>
                <p className="text-gray-700">
                  Local processing at the machine level ensures continued operation even during connectivity interruptions.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                    <span>Offline transaction capability</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                    <span>Local data caching</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                    <span>Secure boot process</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                <div className="bg-vending-blue-light p-3 rounded-full w-14 h-14 flex items-center justify-center text-vending-blue mb-4">
                  <UploadCloud className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Cloud Backend</h3>
                <p className="text-gray-700">
                  Serverless architecture ensures automatic scaling and high availability for your retail automation platform.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                    <span>99.99% uptime SLA</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                    <span>Automatic scaling</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                    <span>Multi-region redundancy</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                <div className="bg-vending-blue-light p-3 rounded-full w-14 h-14 flex items-center justify-center text-vending-blue mb-4">
                  <ArrowDownToLine className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">APIs & Webhooks</h3>
                <p className="text-gray-700">
                  Comprehensive API suite allows seamless integration with your existing systems and third-party services.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                    <span>RESTful and GraphQL APIs</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                    <span>Real-time event notifications</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                    <span>Standard OAuth2 authentication</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-16 bg-vending-gray">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Enterprise Security</h2>
            <p className="subtitle mx-auto">
              Our platform meets the highest industry standards for data protection, 
              network security, and compliance requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-vending-blue-light p-3 rounded-full w-14 h-14 flex items-center justify-center text-vending-blue mb-4">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Data Protection</h3>
              <p className="text-gray-700 mb-4">
                End-to-end encryption for all data in transit and at rest, with regular security audits and penetration testing.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                  <span>AES-256 encryption</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                  <span>Role-based access control</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                  <span>Secure key management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                  <span>Regular security audits</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-vending-blue-light p-3 rounded-full w-14 h-14 flex items-center justify-center text-vending-blue mb-4">
                <CreditCard className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Compliance</h3>
              <p className="text-gray-700 mb-4">
                Our platform meets industry standards and regulatory requirements for secure payment processing and data handling.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                  <span>PCI DSS Level 1 certified</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                  <span>GDPR compliant</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                  <span>SOC 2 Type II audited</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                  <span>HIPAA compliance available</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section id="integrations" className="py-16 bg-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Third-Party Integrations</h2>
            <p className="subtitle mx-auto">
              Connect your vending operations with your existing business systems and third-party services 
              for seamless data flow and process automation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-vending-gray p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">ERP Systems</h3>
              <p className="text-gray-700 mb-4">
                Bidirectional integration with major ERP systems including SAP, Oracle, and Microsoft Dynamics.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                  <span>Inventory synchronization</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                  <span>Financial data integration</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                  <span>Master data management</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-vending-gray p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">CRM Platforms</h3>
              <p className="text-gray-700 mb-4">
                Connect customer data with Salesforce, HubSpot, and other major CRM platforms.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                  <span>Customer profile integration</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                  <span>Purchase history tracking</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                  <span>Loyalty program integration</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-vending-gray p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Marketing Tools</h3>
              <p className="text-gray-700 mb-4">
                Connect with email marketing, SMS, and digital advertising platforms.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                  <span>Campaign automation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                  <span>Promotion management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                  <span>Customer segment targeting</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Payments Section */}
      <section id="payments" className="py-16 bg-vending-gray">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Flexible Payment Processing</h2>
            <p className="subtitle mx-auto">
              Accept all major payment methods and integrate with your preferred payment processor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-vending-blue-light p-3 rounded-full w-14 h-14 flex items-center justify-center text-vending-blue mb-4">
                <CreditCard className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Payment Methods</h3>
              <p className="text-gray-700 mb-4">
                Support for all major payment types to maximize convenience and sales.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                  <span>Credit & debit cards</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                  <span>Mobile wallets</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                  <span>QR code payments</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                  <span>NFC tap-to-pay</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                  <span>Loyalty programs</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                  <span>Gift cards</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-vending-blue-light p-3 rounded-full w-14 h-14 flex items-center justify-center text-vending-blue mb-4">
                <Settings className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Payment Processors</h3>
              <p className="text-gray-700 mb-4">
                Integration with major payment processors or use our built-in processing solution.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                  <span>Stripe, Square, PayPal integration</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                  <span>Built-in processing available</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                  <span>Competitive transaction rates</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-vending-teal flex-shrink-0 mr-2" />
                  <span>Chargeback protection</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Inventory Section */}
      <section id="inventory" className="py-16 bg-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Live Inventory Management</h2>
            <p className="subtitle mx-auto">
              Real-time tracking and management of your inventory across all machines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-vending-gray p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Real-time Monitoring</h3>
              <p className="text-gray-700">
                Track inventory levels across your entire fleet in real-time, with alerts for low stock and other conditions.
              </p>
            </div>
            
            <div className="bg-vending-gray p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Predictive Analytics</h3>
              <p className="text-gray-700">
                AI-powered demand forecasting helps optimize stock levels and reduce waste.
              </p>
            </div>
            
            <div className="bg-vending-gray p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Route Optimization</h3>
              <p className="text-gray-700">
                Intelligent routing for restocking and maintenance based on real inventory needs.
              </p>
            </div>
          </div>

          <div className="mt-12 bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Data-Driven Decision Making</h3>
              <div className="bg-vending-blue-light p-3 rounded-full flex items-center justify-center text-vending-blue">
                <BarChart4 className="h-6 w-6" />
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Turn your vending data into actionable insights with comprehensive reporting and analytics.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-vending-gray p-4 rounded-lg">
                <h4 className="font-medium mb-2">Sales Analytics</h4>
                <p className="text-sm text-gray-600">Track performance across products, locations, and time periods.</p>
              </div>
              <div className="bg-vending-gray p-4 rounded-lg">
                <h4 className="font-medium mb-2">Inventory Optimization</h4>
                <p className="text-sm text-gray-600">Identify optimal stock levels for each product and location.</p>
              </div>
              <div className="bg-vending-gray p-4 rounded-lg">
                <h4 className="font-medium mb-2">Consumer Behavior</h4>
                <p className="text-sm text-gray-600">Understand purchasing patterns and preferences.</p>
              </div>
              <div className="bg-vending-gray p-4 rounded-lg">
                <h4 className="font-medium mb-2">Machine Performance</h4>
                <p className="text-sm text-gray-600">Monitor uptime, technical issues, and service needs.</p>
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
