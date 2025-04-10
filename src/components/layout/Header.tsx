
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { getTechnologies } from '@/services/cms';
import { CMSTechnology } from '@/types/cms';

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch technologies for the dropdown
  const { data: technologies } = useQuery<CMSTechnology[]>({
    queryKey: ['technologies'],
    queryFn: getTechnologies,
  });

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const isActive = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-semibold">Vending Platform</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(isActive('/products') && 'bg-accent text-accent-foreground')}>
                  Products
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          to="/products"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Product Types
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Explore all product categories that work with our vending platform
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <Link to="/products/grocery" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Grocery</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Automated retail solutions for grocery items
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link to="/products/fresh-food" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Fresh Food</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Temperature-controlled solutions for fresh food
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link to="/products/cannabis" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Cannabis</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Compliant dispensing solutions for cannabis products
                        </p>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(isActive('/machines') && 'bg-accent text-accent-foreground')}>
                  Machines
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          to="/machines"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Machine Types
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Explore our range of vending machines and automated retail solutions
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <Link to="/machines/vending/option-4-refrigerated" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Option 4 Refrigerated</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Temperature-controlled vending with large capacity
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link to="/machines/vending/option-2-wall-mount" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Option 2 Wall Mount</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Space-saving wall-mounted vending solution
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link to="/machines/locker/10-cell-temperature-controlled" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">10-Cell Locker</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Secure, temperature-controlled pickup lockers
                        </p>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Technology dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(isActive('/technology') && 'bg-accent text-accent-foreground')}>
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

              {/* More items */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn((isActive('/about') || isActive('/goals') || isActive('/contact')) && 'bg-accent text-accent-foreground')}>
                  More
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    <li>
                      <Link to="/about" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">About Us</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Learn about our company and mission
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link to="/goals" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Business Goals</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          How our solutions help achieve your business objectives
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link to="/contact" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Contact Us</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Get in touch with our team
                        </p>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Button asChild variant="default" size="sm" className="ml-4">
            <Link to="/partner">Become a Partner</Link>
          </Button>
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
          <span className="sr-only">Toggle menu</span>
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden py-2 px-2 space-y-1">
          <MobileNavItem title="Products" path="/products" />
          <MobileNavItem title="Machines" path="/machines" />
          <MobileNavItem title="Technology" path="/technology" />
          <MobileNavItem title="About Us" path="/about" />
          <MobileNavItem title="Business Goals" path="/goals" />
          <MobileNavItem title="Contact" path="/contact" />
          <div className="pt-2">
            <Button asChild variant="default" size="sm" className="w-full">
              <Link to="/partner">Become a Partner</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

// Mobile Navigation Item Component
const MobileNavItem = ({ title, path }: { title: string; path: string }) => {
  const location = useLocation();
  const isActive = location.pathname === path || location.pathname.startsWith(`${path}/`);
  
  return (
    <Link
      to={path}
      className={cn(
        "block px-3 py-2 rounded-md text-base font-medium",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {title}
    </Link>
  );
};

export default Header;
