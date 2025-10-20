
import React from 'react';
import { Link } from 'react-router-dom';
import TranslatableText from '@/components/translation/TranslatableText';

const FooterLinks = () => {
  return (
    <div className="border-t border-gray-200 pt-6 mt-6">
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-gray-600">
        <Link to="/about" className="hover:text-vending-blue transition-colors">
          <TranslatableText context="footer-links">About Us</TranslatableText>
        </Link>
        <Link to="/privacy" className="hover:text-vending-blue transition-colors">
          <TranslatableText context="footer-links">Privacy Policy</TranslatableText>
        </Link>
        <Link to="/terms" className="hover:text-vending-blue transition-colors">
          <TranslatableText context="footer-links">Terms of Service</TranslatableText>
        </Link>
        <Link to="/contact" className="hover:text-vending-blue transition-colors">
          <TranslatableText context="footer-links">Contact Us</TranslatableText>
        </Link>
      </div>
      
      <p className="text-center mt-4 text-xs text-gray-500">
        <TranslatableText context="footer-links">{`© ${new Date().getFullYear()} Applestone Solutions. All rights reserved.`}</TranslatableText>
      </p>
    </div>
  );
};

export default FooterLinks;
