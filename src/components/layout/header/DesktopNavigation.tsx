
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import NavigationDropdownContent from './NavigationDropdownContent';
import TechnologyDropdown from './TechnologyDropdown';
import { useAuth } from '@/context/AuthContext';
import { UserCog } from 'lucide-react';

const DesktopNavigation = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();
  
  const isActive = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const productItems = [
    {
      title: "Grocery",
      path: "/products/grocery",
      description: "Automated retail solutions for grocery items"
    },
    {
      title: "Fresh Food",
      path: "/products/fresh-food",
      description: "Temperature-controlled solutions for fresh food"
    },
    {
      title: "Cannabis",
      path: "/products/cannabis",
      description: "Compliant dispensing solutions for cannabis products"
    }
  ];

  const machineItems = [
    {
      title: "Option 4 Refrigerated",
      path: "/machines/vending/option-4-refrigerated",
      description: "Temperature-controlled vending with large capacity"
    },
    {
      title: "Option 2 Wall Mount",
      path: "/machines/vending/option-2-wall-mount",
      description: "Space-saving wall-mounted vending solution"
    },
    {
      title: "10-Cell Locker",
      path: "/machines/locker/10-cell-temperature-controlled",
      description: "Secure, temperature-controlled pickup lockers"
    }
  ];

  const businessGoalItems = [
    {
      title: "All Business Goals",
      path: "/goals",
      description: "Explore how our solutions help achieve your business objectives"
    },
    {
      title: "Expand Footprint",
      path: "/goals/expand-footprint",
      description: "Grow your business with scalable solutions"
    },
    {
      title: "Buy Online, Pickup In Store",
      path: "/goals/bopis",
      description: "Enable convenient pickup options for customers"
    }
  ];

  const moreItems = [
    // About Us and Contact Us have been moved to the main navigation
  ];

  return (
    <nav className="hidden md:flex items-center space-x-1">
      <NavigationMenu>
        <NavigationMenuList>
          {/* Products Navigation Item */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className={cn(isActive('/products') && 'bg-accent text-accent-foreground')}>
              Products
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationDropdownContent 
                items={productItems}
                featured={{
                  title: "Product Types",
                  path: "/products",
                  description: "Explore all product categories that work with our vending platform"
                }}
              />
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Machines Navigation Item */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className={cn(isActive('/machines') && 'bg-accent text-accent-foreground')}>
              Machines
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationDropdownContent 
                items={machineItems}
                featured={{
                  title: "Machine Types",
                  path: "/machines",
                  description: "Explore our range of vending machines and automated retail solutions"
                }}
                title="Machine Types"
              />
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Business Goals Navigation Item */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className={cn(isActive('/goals') && 'bg-accent text-accent-foreground')}>
              Business Goals
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationDropdownContent 
                items={businessGoalItems}
              />
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* Technology dropdown */}
          <TechnologyDropdown isActive={isActive('/technology')} />

          {/* About Us link - moved from More */}
          <NavigationMenuItem>
            <Link to="/about" className={cn(
              "inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none",
              isActive('/about') && 'bg-accent text-accent-foreground'
            )}>
              About Us
            </Link>
          </NavigationMenuItem>
          
          {/* Contact Us link - moved from More */}
          <NavigationMenuItem>
            <Link to="/contact" className={cn(
              "inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none",
              isActive('/contact') && 'bg-accent text-accent-foreground'
            )}>
              Contact Us
            </Link>
          </NavigationMenuItem>

          {/* More items - if we still need this dropdown */}
          {moreItems.length > 0 && (
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                More
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationDropdownContent 
                  items={moreItems}
                />
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex items-center gap-2 ml-4">
        {isAdmin ? (
          <Button asChild variant="outline" size="sm">
            <Link to="/admin">
              <UserCog className="h-4 w-4 mr-1" />
              Admin Dashboard
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/sign-in">
              <UserCog className="h-4 w-4 mr-1" />
              Admin Sign In
            </Link>
          </Button>
        )}
        
        <Button asChild variant="default" size="sm">
          <Link to="/partner">Become a Partner</Link>
        </Button>
      </div>
    </nav>
  );
};

export default DesktopNavigation;
