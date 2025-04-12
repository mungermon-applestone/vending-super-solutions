
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

interface TechnologyDropdownProps {
  isActive: boolean;
}

const TechnologyDropdown: React.FC<TechnologyDropdownProps> = ({ isActive }) => {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink 
        asChild
        className={cn(
          "inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
          isActive && "bg-accent text-accent-foreground"
        )}
      >
        <Link to="/technology">Technology</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

export default TechnologyDropdown;
