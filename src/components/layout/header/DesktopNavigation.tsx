
import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import TechnologyDropdown from './TechnologyDropdown';
import ProductsDropdown from './ProductsDropdown';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const DesktopNavigation = () => {
  const location = useLocation();
  
  // Determine which nav item is active
  const isTechnologyActive = location.pathname.startsWith('/technology');
  const isProductsActive = location.pathname.startsWith('/products');
  const isMachinesActive = location.pathname.startsWith('/machines');
  const isBusinessGoalsActive = location.pathname.startsWith('/goals');
  
  return (
    <div className="hidden md:flex items-center space-x-2">
      <NavigationMenu>
        <NavigationMenuList>
          <ProductsDropdown isActive={isProductsActive} />
          <TechnologyDropdown isActive={isTechnologyActive} />
        </NavigationMenuList>
      </NavigationMenu>
      
      {/* Additional navigation links */}
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
    </div>
  );
};

export default DesktopNavigation;
