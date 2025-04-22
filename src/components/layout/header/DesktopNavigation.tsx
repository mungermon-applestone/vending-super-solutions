
import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import TechnologyDropdown from './TechnologyDropdown';
import ProductsDropdown from './ProductsDropdown';
import AdditionalNavLinks from './AdditionalNavLinks';

const DesktopNavigation = () => {
  const location = useLocation();
  
  // Determine which nav item is active
  const isTechnologyActive = location.pathname.startsWith('/technology');
  const isProductsActive = location.pathname.startsWith('/products');
  const isAboutActive = location.pathname === '/about';
  
  return (
    <div className="hidden md:flex items-center space-x-2">
      <NavigationMenu>
        <NavigationMenuList>
          <ProductsDropdown isActive={isProductsActive} />
          <TechnologyDropdown isActive={isTechnologyActive} />
        </NavigationMenuList>
      </NavigationMenu>
      
      {/* Additional navigation links */}
      <AdditionalNavLinks isAboutActive={isAboutActive} />
    </div>
  );
};

export default DesktopNavigation;
