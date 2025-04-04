
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import CTASection from '@/components/common/CTASection';
import { Button } from '@/components/ui/button';
import { ChevronRight, Server, HardDrive, Wifi } from 'lucide-react';

const MachinesLanding = () => {
  const [filter, setFilter] = useState<string | null>(null);

  // Machine types data
  const machines = [
    {
      title: "Smart Vending Machine",
      description: "Interactive touchscreen vending for ambient products",
      image: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2",
      path: "/machines/vending/smart-vending",
      type: "vending",
      temperature: "ambient",
      features: ["Touchscreen", "Cashless Payment", "Cloud Connectivity"]
    },
    {
      title: "Refrigerated Beverage Machine",
      description: "Temperature-controlled vending for cold drinks and perishables",
      image: "https://images.unsplash.com/photo-1597393353415-b3730f3719fe",
      path: "/machines/vending/refrigerated-beverage",
      type: "vending",
      temperature: "refrigerated",
      features: ["Temperature Control", "Energy Efficient", "Digital Display"]
    },
    {
      title: "Frozen Food Dispenser",
      description: "Deep freeze vending for ice cream and frozen meals",
      image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8",
      path: "/machines/vending/frozen-food",
      type: "vending",
      temperature: "frozen",
      features: ["Deep Freeze", "Multi-Zone Temperature", "Backup Power"]
    },
    {
      title: "Wall Mounted Dispenser",
      description: "Space-saving wall-mounted vending solution",
      image: "https://images.unsplash.com/photo-1611174743517-4d463abd9040",
      path: "/machines/vending/wall-mounted",
      type: "vending",
      temperature: "ambient",
      features: ["Space-Saving", "ADA Compliant", "Low Power Consumption"]
    },
    {
      title: "High Capacity Vending",
      description: "Large capacity machine for high traffic locations",
      image: "https://images.unsplash.com/photo-1589803162840-9863428c1cf6",
      path: "/machines/vending/high-capacity",
      type: "vending",
      temperature: "ambient",
      features: ["High Capacity", "Multiple Product Categories", "Modular Design"]
    },
    {
      title: "Smart Locker Small",
      description: "Compact smart lockers for secure item pickup",
      image: "https://images.unsplash.com/photo-1621964275191-ccc01ef2134c",
      path: "/machines/lockers/smart-locker-small",
      type: "locker",
      temperature: "ambient",
      features: ["Secure Access", "Compact Design", "LED Indicators"]
    },
    {
      title: "Refrigerated Locker System",
      description: "Temperature-controlled lockers for food delivery and grocery pickup",
      image: "https://images.unsplash.com/photo-1600494603989-9650cf6ddd3d",
      path: "/machines/lockers/refrigerated-lockers",
      type: "locker",
      temperature: "refrigerated",
      features: ["Temperature Monitoring", "Individual Compartments", "Mobile Notifications"]
    },
    {
      title: "Frozen Storage Lockers",
      description: "Deep-freeze lockers for ice cream and frozen food pickup",
      image: "https://images.unsplash.com/photo-1579619087996-47ee11a113fd",
      path: "/machines/lockers/frozen-storage",
      type: "locker",
      temperature: "frozen",
      features: ["Ultra-Low Temperature", "Insulated Compartments", "Power Backup"]
    }
  ];

  const filteredMachines = filter 
    ? machines.filter(machine => {
        if (filter.includes('vending') || filter.includes('locker')) {
          return machine.type === filter;
        }
        if (['ambient', 'refrigerated', 'frozen'].includes(filter)) {
          return machine.temperature === filter;
        }
        return true;
      })
    : machines;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-vending-blue-light via-white to-vending-teal-light py-16">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-vending-blue-dark mb-6">
                Compatible Machine Types
              </h1>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl">
                Our software integrates with a wide variety of vending machines and smart lockers to meet your specific business requirements and location constraints.
              </p>
              <Button asChild className="btn-primary">
                <Link to="/contact">Request a Demo</Link>
              </Button>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1493723843671-1d655e66ac1c" 
                alt="Various vending machines" 
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-vending-teal text-white p-4 rounded-lg shadow-lg hidden md:block">
                <p className="font-bold">Hardware agnostic platform</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Navigation */}
      <section className="bg-white py-8 border-b border-gray-200 sticky top-[72px] z-10 shadow-sm">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h2 className="text-2xl font-bold text-vending-blue-dark mb-4 md:mb-0">Machine Catalogue</h2>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={filter === null ? "default" : "outline"}
                onClick={() => setFilter(null)}
                className="whitespace-nowrap"
              >
                All Machines
              </Button>
              <Button 
                variant={filter === "vending" ? "default" : "outline"} 
                onClick={() => setFilter("vending")}
                className="whitespace-nowrap"
              >
                Vending Machines
              </Button>
              <Button 
                variant={filter === "locker" ? "default" : "outline"} 
                onClick={() => setFilter("locker")}
                className="whitespace-nowrap"
              >
                Smart Lockers
              </Button>
              <Button 
                variant={filter === "ambient" ? "default" : "outline"} 
                onClick={() => setFilter("ambient")}
                className="whitespace-nowrap"
              >
                Ambient
              </Button>
              <Button 
                variant={filter === "refrigerated" ? "default" : "outline"} 
                onClick={() => setFilter("refrigerated")}
                className="whitespace-nowrap"
              >
                Refrigerated
              </Button>
              <Button 
                variant={filter === "frozen" ? "default" : "outline"} 
                onClick={() => setFilter("frozen")}
                className="whitespace-nowrap"
              >
                Frozen
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Machine Types Grid */}
      <section className="py-16 bg-vending-gray">
        <div className="container-wide">
          {filter && (
            <div className="mb-8 flex justify-between items-center">
              <div className="bg-white rounded-lg px-4 py-2 inline-flex items-center">
                <span className="font-medium mr-2">Filtering by:</span>
                <span className="bg-vending-blue-light text-vending-blue px-3 py-1 rounded-full flex items-center">
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  <button 
                    onClick={() => setFilter(null)} 
                    className="ml-2 text-vending-blue hover:text-vending-blue-dark"
                  >
                    &times;
                  </button>
                </span>
              </div>
              
              <p className="text-sm text-gray-600">
                Showing {filteredMachines.length} of {machines.length} machines
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMachines.map((machine, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <img 
                    src={machine.image} 
                    alt={machine.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-vending-teal/90 text-white px-3 py-1 rounded-bl-lg text-sm font-medium">
                    {machine.temperature.charAt(0).toUpperCase() + machine.temperature.slice(1)}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start mb-2">
                    <div className="bg-vending-blue-light p-2 rounded-full mr-3">
                      {machine.type === 'vending' ? (
                        <Server className="h-4 w-4 text-vending-blue" />
                      ) : (
                        <HardDrive className="h-4 w-4 text-vending-blue" />
                      )}
                    </div>
                    <h3 className="text-xl font-semibold">{machine.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{machine.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {machine.features.map((feature, i) => (
                        <span 
                          key={i}
                          className="text-xs bg-vending-gray text-gray-700 px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Button asChild variant="outline" className="w-full">
                    <Link to={machine.path} className="flex items-center justify-center">
                      View Specifications <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Features */}
      <section className="py-16 bg-white">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-vending-blue-dark mb-4">Hardware Agnostic Integration</h2>
            <p className="subtitle mx-auto">
              Our software platform integrates with virtually any vending hardware through our open standards and flexible connectivity options.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-vending-gray p-8 rounded-lg">
              <div className="bg-white p-3 rounded-full w-14 h-14 flex items-center justify-center text-vending-blue mb-4">
                <Wifi className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Wireless Connectivity</h3>
              <p className="text-gray-700">
                Connect machines via WiFi, cellular, or Bluetooth for real-time inventory tracking and payment processing in any location.
              </p>
              <img 
                src="https://images.unsplash.com/photo-1558478551-1a378f63328e" 
                alt="Wireless connectivity" 
                className="w-full h-48 object-cover rounded-lg mt-6" 
              />
            </div>
            
            <div className="bg-vending-gray p-8 rounded-lg">
              <div className="bg-white p-3 rounded-full w-14 h-14 flex items-center justify-center text-vending-blue mb-4">
                <Server className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Protocol Adaptability</h3>
              <p className="text-gray-700">
                Our system supports MDB, DEX, and custom protocols to ensure compatibility with both legacy and next-generation vending equipment.
              </p>
              <img 
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31" 
                alt="Protocol adaptability" 
                className="w-full h-48 object-cover rounded-lg mt-6" 
              />
            </div>
            
            <div className="bg-vending-gray p-8 rounded-lg">
              <div className="bg-white p-3 rounded-full w-14 h-14 flex items-center justify-center text-vending-blue mb-4">
                <HardDrive className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Hardware Management</h3>
              <p className="text-gray-700">
                Remote diagnostics, troubleshooting, and machine-learning based maintenance predictions help maximize uptime and revenue.
              </p>
              <img 
                src="https://images.unsplash.com/photo-1531297484001-80022131f5a1" 
                alt="Hardware management" 
                className="w-full h-48 object-cover rounded-lg mt-6" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cost Section Preview */}
      <section className="py-16 bg-vending-blue-dark text-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Flexible Cost Models</h2>
              <p className="text-lg opacity-90 mb-6">
                Our platform offers various acquisition models including purchase, lease, revenue share, and custom hybrid arrangements to fit your business needs.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-vending-teal flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>No upfront capital expenditure options available</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-vending-teal flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Revenue share models that align our success with yours</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-vending-teal flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Custom arrangements for enterprises and multi-location deployments</span>
                </li>
              </ul>
              <Button asChild variant="secondary">
                <Link to="/machines/costs">Explore Cost Options</Link>
              </Button>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf" 
                alt="Cost models" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </Layout>
  );
};

export default MachinesLanding;
