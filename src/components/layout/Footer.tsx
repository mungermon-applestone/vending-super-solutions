
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FooterLinks from './FooterLinks';

interface FooterProps {
  // Add any props here if needed
}

const Footer: React.FC<FooterProps> = () => {
  const [logoUrl, setLogoUrl] = useState<string>("");
  
  // Fetch the logo from Contentful
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        // Using the asset ID provided
        const assetId = "5BbotmmDZslyyhDHUtTYN3";
        const response = await fetch(`https://cdn.contentful.com/spaces/${import.meta.env.VITE_CONTENTFUL_SPACE_ID}/environments/${import.meta.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master'}/assets/${assetId}?access_token=${import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch logo');
        }
        
        const data = await response.json();
        if (data && data.fields && data.fields.file) {
          setLogoUrl(`https:${data.fields.file.url}`);
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
        // Fallback to the uploaded image if Contentful fetch fails
        setLogoUrl('/lovable-uploads/4896dccb-5a9a-4a9f-96c3-f5874eb272fd.png');
      }
    };
    
    fetchLogo();
  }, []);

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto p-6 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
          <div className="flex items-center justify-center">
            <Link to="/" className="block">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="Applestone Solutions" 
                  className="h-auto w-auto max-h-32" 
                />
              ) : (
                <div className="h-16 w-48 bg-gray-100 animate-pulse rounded"></div>
              )}
            </Link>
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-3">Solutions</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-600 hover:text-apple-blue">Products</Link></li>
              <li><Link to="/machines" className="text-gray-600 hover:text-apple-blue">Machines</Link></li>
              <li><Link to="/technology" className="text-gray-600 hover:text-apple-blue">Technology</Link></li>
            </ul>
          </div>
          
          <div className="text-center">
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
