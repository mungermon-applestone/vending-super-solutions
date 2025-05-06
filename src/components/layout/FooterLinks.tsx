
import React from 'react';
import { Link } from 'react-router-dom';

const FooterLinks = () => {
  return (
    <div className="border-t border-gray-200 pt-6 mt-6">
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-gray-600">
        <Link to="/privacy" className="hover:text-apple-blue transition-colors">
          Privacy Policy
        </Link>
        <Link to="/terms" className="hover:text-apple-blue transition-colors">
          Terms of Service
        </Link>
        <Link to="/contact" className="hover:text-apple-blue transition-colors">
          Contact Us
        </Link>
      </div>
      
      <p className="text-center mt-4 text-xs text-gray-500">
        © {new Date().getFullYear()} Applestone Solutions. All rights reserved.
      </p>
    </div>
  );
};

export default FooterLinks;
