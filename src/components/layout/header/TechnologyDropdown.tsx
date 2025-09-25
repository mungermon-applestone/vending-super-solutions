
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { useNavigationContent } from '@/hooks/cms/useNavigationContent';
import TranslatableText from '@/components/translation/TranslatableText';

interface TechnologyDropdownProps {
  isActive: boolean;
}

const TechnologyDropdown: React.FC<TechnologyDropdownProps> = ({ isActive }) => {
  const navigationContent = useNavigationContent();
  
  return (
    <NavigationMenuItem>
      <NavigationMenuLink 
        asChild
        className={cn(
          "inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
          isActive 
            ? "bg-vending-blue text-white border border-vending-blue" 
            : "bg-gray-50 text-gray-900 hover:bg-gray-100 border border-transparent"
        )}
      >
        <Link to="/technology">
          {navigationContent.isLoading ? (
            <TranslatableText context="navigation">Technology</TranslatableText>
          ) : (
            <TranslatableText context="navigation">
              {navigationContent.technology}
            </TranslatableText>
          )}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

export default TechnologyDropdown;
