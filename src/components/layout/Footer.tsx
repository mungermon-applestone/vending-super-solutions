
import { Link } from 'react-router-dom';
import { ChevronRight, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="text-2xl font-bold mb-4 block">Applestone Solutions</Link>
            <p className="text-gray-300 mb-6 max-w-md">
              Sell Anyting, Anywhere. It's the future of retail. 
            </p>
            <div className="flex flex-col space-y-2">
              <a href="mailto:info@vendingsoft.com" className="text-gray-300 hover:text-white flex items-center gap-2 transition-colors">
                <Mail size={16} /> info@vendingsoft.com
              </a>
              <a href="tel:+18005551234" className="text-gray-300 hover:text-white flex items-center gap-2 transition-colors">
                <Phone size={16} /> (909) 314-1011
              </a>
              <address className="text-gray-300 not-italic flex items-center gap-2">
                <MapPin size={16} /> 3607 Main St., <br />Stone Ridge, NY 12484
              </address>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h5 className="font-semibold text-lg mb-4">Product</h5>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white flex items-center gap-1 transition-colors">
                  <ChevronRight size={14} /> Product Types
                </Link>
              </li>
              <li>
                <Link to="/goals" className="text-gray-300 hover:text-white flex items-center gap-1 transition-colors">
                  <ChevronRight size={14} /> Business Goals
                </Link>
              </li>
              <li>
                <Link to="/machines" className="text-gray-300 hover:text-white flex items-center gap-1 transition-colors">
                  <ChevronRight size={14} /> Machine Types
                </Link>
              </li>
              <li>
                <Link to="/technology" className="text-gray-300 hover:text-white flex items-center gap-1 transition-colors">
                  <ChevronRight size={14} /> Our Technology
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h5 className="font-semibold text-lg mb-4">Company</h5>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white flex items-center gap-1 transition-colors">
                  <ChevronRight size={14} /> About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white flex items-center gap-1 transition-colors">
                  <ChevronRight size={14} /> Contact Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white flex items-center gap-1 transition-colors">
                  <ChevronRight size={14} /> Updates
                </Link>
              </li>
              <li>
                <Link to="/case-studies" className="text-gray-300 hover:text-white flex items-center gap-1 transition-colors">
                  <ChevronRight size={14} /> Case Studies
                </Link>
              </li>
              <li>
                <Link to="/partner" className="text-gray-300 hover:text-white flex items-center gap-1 transition-colors">
                  <ChevronRight size={14} /> Partner With Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h5 className="font-semibold text-lg mb-4">Support</h5>
            <ul className="space-y-2">
              <li>
                <Link to="/customer-signin" className="text-gray-300 hover:text-white flex items-center gap-1 transition-colors">
                  <ChevronRight size={14} /> Customer Support
                </Link>
              </li>
              <li>
                <Link to="/partner-signin" className="text-gray-300 hover:text-white flex items-center gap-1 transition-colors">
                  <ChevronRight size={14} /> Partner Portal
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white flex items-center gap-1 transition-colors">
                  <ChevronRight size={14} /> Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="pt-8 border-t border-gray-800 text-gray-400 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} VendingSoft. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-white transition-colors">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
