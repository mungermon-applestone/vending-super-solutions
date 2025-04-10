
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTechnologies } from '@/services/cms';
import { CMSTechnology } from '@/types/cms';
import { 
  NavigationMenuItem, 
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';

interface TechnologyDropdownProps {
  isActive: boolean;
}

const TechnologyDropdown = ({ isActive }: TechnologyDropdownProps) => {
  // Fetch technologies for the dropdown
  const { data: technologies } = useQuery<CMSTechnology[]>({
    queryKey: ['technologies'],
    queryFn: getTechnologies,
  });

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className={cn(isActive && 'bg-accent text-accent-foreground')}>
        Technology
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
          <li className="row-span-3">
            <NavigationMenuLink asChild>
              <Link
                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                to="/technology"
              >
                <div className="mb-2 mt-4 text-lg font-medium">
                  Our Technology
                </div>
                <p className="text-sm leading-tight text-muted-foreground">
                  Explore the technology that powers our vending solutions
                </p>
              </Link>
            </NavigationMenuLink>
          </li>
                    
          {technologies?.map((tech) => (
            <li key={tech.id}>
              <Link 
                to={`/technology/${tech.slug}`} 
                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                <div className="text-sm font-medium leading-none">{tech.title}</div>
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  {tech.description}
                </p>
              </Link>
            </li>
          ))}
                    
          {(!technologies || technologies.length === 0) && (
            <li>
              <div className="block select-none space-y-1 rounded-md p-3 leading-none">
                <div className="text-sm font-medium leading-none">No technologies available</div>
              </div>
            </li>
          )}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default TechnologyDropdown;
