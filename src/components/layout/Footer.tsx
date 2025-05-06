
import React from 'react';
import { Link } from 'react-router-dom';
import FooterLinks from './FooterLinks';

interface FooterProps {
  // Add any props here if needed
}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto p-6 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-semibold">Applestone Solutions</span>
            </Link>
            <p className="mt-3 text-gray-600 max-w-md">
              Advanced vending solutions for modern businesses. Automate your retail operations with smart vending machines and IoT technology.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Solutions</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-600 hover:text-apple-blue">Products</Link></li>
              <li><Link to="/machines" className="text-gray-600 hover:text-apple-blue">Machines</Link></li>
              <li><Link to="/technology" className="text-gray-600 hover:text-apple-blue">Technology</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-apple-blue">About Us</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-apple-blue">Blog</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-apple-blue">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <FooterLinks />
      </div>
    </footer>
  );
};

export default Footer;
