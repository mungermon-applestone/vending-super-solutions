
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

interface ProductsDropdownProps {
  isActive: boolean;
}

const ProductsDropdown: React.FC<ProductsDropdownProps> = ({ isActive }) => {
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
        <Link to="/products">Sell Any Product</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

export default ProductsDropdown;
