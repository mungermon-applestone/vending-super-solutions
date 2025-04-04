
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, ChevronRight, CircleUser } from 'lucide-react';

// Dropdown menu types
interface MenuItem {
  title: string;
  path: string;
}

interface DropdownProps {
  title: string;
  items: MenuItem[];
}

const Dropdown: React.FC<DropdownProps> = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative group" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button 
        className="flex items-center gap-1 nav-link"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title} <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute left-0 mt-1 w-64 bg-white shadow-lg rounded-md py-1 z-50 animate-fade-in">
          {items.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="block px-4 py-2 text-sm text-vending-gray-dark hover:bg-vending-blue-light hover:text-vending-blue"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-2">
                <ChevronRight className="h-3 w-3" />
                {item.title}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Define navigation items with dropdowns
  const productTypes = [
    { title: "Grocery", path: "/products/grocery" },
    { title: "Vape", path: "/products/vape" },
    { title: "Cannabis", path: "/products/cannabis" },
    { title: "Fresh Food", path: "/products/fresh-food" },
    { title: "Cosmetics", path: "/products/cosmetics" },
    { title: "Toys/Cards/Collectibles", path: "/products/collectibles" },
    { title: "OTC", path: "/products/otc" },
    { title: "Swag and Samples", path: "/products/swag" },
  ];

  const businessGoals = [
    { title: "Expand Footprint", path: "/goals/expand-footprint" },
    { title: "BOPIS", path: "/goals/bopis" },
    { title: "Loss Prevention", path: "/goals/loss-prevention" },
    { title: "DOOH Advertising", path: "/goals/dooh-advertising" },
    { title: "Line Busting", path: "/goals/line-busting" },
    { title: "Amusement", path: "/goals/amusement" },
    { title: "Food Desert / Corp. Res.", path: "/goals/food-desert" },
    { title: "Marketing and Promotions", path: "/goals/marketing" },
    { title: "Third Party Integrations", path: "/goals/integrations" },
    { title: "Data", path: "/goals/data" },
    { title: "Fleet Management", path: "/goals/fleet-management" },
    { title: "Inventory Management", path: "/goals/inventory-management" },
    { title: "Customer Satisfaction", path: "/goals/customer-satisfaction" },
  ];

  const machineTypes = [
    { title: "Vending Machines", path: "/machines#vending-machines" },
    { title: "Lockers", path: "/machines#smart-lockers" },
    { title: "Mixed Machine Solutions", path: "/machines#mixed-solutions" },
    { title: "Costs", path: "/machines#cost-models" },
  ];

  const technologyItems = [
    { title: "Architecture", path: "/technology#architecture" },
    { title: "Security", path: "/technology#security" },
    { title: "Third-party integrations", path: "/technology#integrations" },
    { title: "Payments", path: "/technology#payments" },
    { title: "Live Inventory", path: "/technology#inventory" },
  ];

  const aboutItems = [
    { title: "About Us", path: "/about" },
    { title: "Contact Us", path: "/contact" },
    { title: "Privacy Policy", path: "/privacy" },
  ];

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="container-wide">
        {/* Top Secondary Navigation */}
        <div className="flex justify-end py-1 text-sm border-b border-gray-100">
          <div className="flex gap-4">
            <Link to="/partner-signin" className="text-vending-gray-dark hover:text-vending-blue flex items-center gap-1">
              <CircleUser className="h-3 w-3" /> Partner Sign-In
            </Link>
            <Link to="/customer-signin" className="text-vending-gray-dark hover:text-vending-blue flex items-center gap-1">
              <CircleUser className="h-3 w-3" /> Customer Sign-In
            </Link>
          </div>
        </div>
        
        {/* Main Navigation */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-vending-blue mr-8">
              VendingSoft
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-1">
              <Dropdown title="Products" items={productTypes} />
              <Dropdown title="Business Goals" items={businessGoals} />
              <Dropdown title="Machines" items={machineTypes} />
              <Dropdown title="Technology" items={technologyItems} />
              <Dropdown title="About" items={aboutItems} />
              <Link to="/blog" className="nav-link">
                Blog
              </Link>
              <Link to="/case-studies" className="nav-link">
                Case Studies
              </Link>
              <Link to="/partner" className="nav-link">
                Partner With Us
              </Link>
            </nav>
          </div>
          
          {/* CTA Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <Button asChild className="hidden sm:inline-flex btn-primary">
              <Link to="/contact">Request Demo</Link>
            </Button>
            
            <button 
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 px-4 bg-white border-t border-gray-100">
            <div className="flex flex-col space-y-2">
              <div className="border-b border-gray-200 pb-2">
                <p className="font-medium mb-2">Types of Products</p>
                {productTypes.map((item, i) => (
                  <Link 
                    key={i} 
                    to={item.path} 
                    className="block py-1.5 pl-3 text-sm text-vending-gray-dark hover:text-vending-blue"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
              
              <div className="border-b border-gray-200 pb-2">
                <p className="font-medium mb-2">Business Goals</p>
                {businessGoals.map((item, i) => (
                  <Link 
                    key={i} 
                    to={item.path} 
                    className="block py-1.5 pl-3 text-sm text-vending-gray-dark hover:text-vending-blue"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
              
              <div className="border-b border-gray-200 pb-2">
                <p className="font-medium mb-2">Machine Types</p>
                {machineTypes.map((item, i) => (
                  <Link 
                    key={i} 
                    to={item.path} 
                    className="block py-1.5 pl-3 text-sm text-vending-gray-dark hover:text-vending-blue"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
              
              <div className="border-b border-gray-200 pb-2">
                <p className="font-medium mb-2">Technology</p>
                {technologyItems.map((item, i) => (
                  <Link 
                    key={i} 
                    to={item.path} 
                    className="block py-1.5 pl-3 text-sm text-vending-gray-dark hover:text-vending-blue"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
              
              <div className="border-b border-gray-200 pb-2">
                <p className="font-medium mb-2">About</p>
                {aboutItems.map((item, i) => (
                  <Link 
                    key={i} 
                    to={item.path} 
                    className="block py-1.5 pl-3 text-sm text-vending-gray-dark hover:text-vending-blue"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
              
              <Link to="/blog" className="block py-2 font-medium hover:text-vending-blue" onClick={() => setMobileMenuOpen(false)}>
                Blog
              </Link>
              
              <Link to="/case-studies" className="block py-2 font-medium hover:text-vending-blue" onClick={() => setMobileMenuOpen(false)}>
                Case Studies
              </Link>
              
              <Link to="/partner" className="block py-2 font-medium hover:text-vending-blue" onClick={() => setMobileMenuOpen(false)}>
                Partner With Us
              </Link>
              
              <Button asChild className="w-full mt-4">
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Request Demo</Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
