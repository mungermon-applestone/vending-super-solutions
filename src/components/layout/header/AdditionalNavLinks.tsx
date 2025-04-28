
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface AdditionalNavLinksProps {
  isAboutActive?: boolean;
}

const AdditionalNavLinks = ({ isAboutActive }: AdditionalNavLinksProps) => {
  const location = useLocation();
  const isBlogActive = location.pathname.startsWith('/blog');
  const isBusinessActive = location.pathname.startsWith('/business') || location.pathname.startsWith('/business-goals');
  
  return (
    <div className="flex items-center space-x-2">
      <Button 
        asChild 
        variant="ghost"
      >
        <Link to="/machines">Machines</Link>
      </Button>
      <Button 
        asChild 
        variant={isBusinessActive ? "default" : "ghost"}
      >
        <Link to="/business-goals">Business Goals</Link>
      </Button>
      <Button 
        asChild 
        variant={isAboutActive ? "default" : "ghost"}
      >
        <Link to="/about">About</Link>
      </Button>
      <Button 
        asChild
        variant={isBlogActive ? "default" : "ghost"}
      >
        <Link to="/blog">Blog</Link>
      </Button>
      <Button 
        asChild
        variant="ghost"
      >
        <Link to="/contact">Contact</Link>
      </Button>
    </div>
  );
};

export default AdditionalNavLinks;
