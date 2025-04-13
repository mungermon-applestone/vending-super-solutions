
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  MenuIcon, 
  XIcon, 
  PhoneIcon, 
  Settings
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl text-gray-900">VendingAPP</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-primary"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-primary"
              >
                Products
              </Link>
              <Link
                to="/machines"
                className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-primary"
              >
                Machines
              </Link>
              <Link
                to="/business"
                className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-primary"
              >
                Business
              </Link>
              <Link
                to="/technology"
                className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-primary"
              >
                Technology
              </Link>
              <Link
                to="/cases"
                className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-primary"
              >
                Case Studies
              </Link>
            </div>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/admin/settings" className="text-gray-500 hover:text-primary">
              <Settings className="h-5 w-5" />
            </Link>
            <Link to="/admin/strapi" className="text-gray-500 hover:text-primary">
              <Button size="sm" variant="outline">
                Strapi Config
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="default" size="sm">
                <PhoneIcon className="h-4 w-4 mr-2" />
                Contact Us
              </Button>
            </Link>
          </div>
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/products"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            onClick={() => setIsOpen(false)}
          >
            Products
          </Link>
          <Link
            to="/machines"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            onClick={() => setIsOpen(false)}
          >
            Machines
          </Link>
          <Link
            to="/business"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            onClick={() => setIsOpen(false)}
          >
            Business
          </Link>
          <Link
            to="/technology"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            onClick={() => setIsOpen(false)}
          >
            Technology
          </Link>
          <Link
            to="/cases"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            onClick={() => setIsOpen(false)}
          >
            Case Studies
          </Link>
          <Link
            to="/admin/settings"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            onClick={() => setIsOpen(false)}
          >
            Settings
          </Link>
          <Link
            to="/admin/strapi"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            onClick={() => setIsOpen(false)}
          >
            Strapi Config
          </Link>
          <Link
            to="/contact"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            onClick={() => setIsOpen(false)}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
