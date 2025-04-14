
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';

const AdditionalNavLinks = () => {
  const location = useLocation();
  
  // Determine which nav item is active
  const isMachinesActive = location.pathname.startsWith('/machines');
  const isBusinessGoalsActive = location.pathname.startsWith('/goals');

  return (
    <div className="flex items-center space-x-2">
      <Button 
        asChild 
        variant={isMachinesActive ? "default" : "ghost"}
      >
        <Link to="/machines">Machines</Link>
      </Button>
      <Button 
        asChild 
        variant={isBusinessGoalsActive ? "default" : "ghost"}
      >
        <Link to="/goals">Business Goals</Link>
      </Button>
    </div>
  );
};

export default AdditionalNavLinks;
