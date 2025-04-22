
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface AdditionalNavLinksProps {
  isAboutActive?: boolean;
}

const AdditionalNavLinks = ({ isAboutActive }: AdditionalNavLinksProps) => {
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
        variant="ghost"
      >
        <Link to="/business-goals">Business Goals</Link>
      </Button>
      <Button 
        asChild 
        variant={isAboutActive ? "default" : "ghost"}
      >
        <Link to="/about">About</Link>
      </Button>
    </div>
  );
};

export default AdditionalNavLinks;
