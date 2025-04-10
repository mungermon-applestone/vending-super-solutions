
import React from 'react';
import { Link } from 'react-router-dom';
import { NavigationMenuLink } from '@/components/ui/navigation-menu';

interface NavigationItem {
  title: string;
  path: string;
  description: string;
}

interface NavigationFeaturedItem {
  title: string;
  path: string;
  description: string;
}

interface NavigationDropdownContentProps {
  items: NavigationItem[];
  featured?: NavigationFeaturedItem;
  title?: string;
}

const NavigationDropdownContent = ({ 
  items, 
  featured, 
  title = "All Items"
}: NavigationDropdownContentProps) => {
  return (
    <ul className={`grid ${featured ? "w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]" : "w-[400px] gap-3 p-4"}`}>
      {featured && (
        <li className="row-span-3">
          <NavigationMenuLink asChild>
            <Link
              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
              to={featured.path}
            >
              <div className="mb-2 mt-4 text-lg font-medium">
                {title}
              </div>
              <p className="text-sm leading-tight text-muted-foreground">
                {featured.description}
              </p>
            </Link>
          </NavigationMenuLink>
        </li>
      )}
      
      {items.map((item) => (
        <li key={item.path}>
          <Link 
            to={item.path} 
            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          >
            <div className="text-sm font-medium leading-none">{item.title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {item.description}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavigationDropdownContent;
