
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import TranslatableText from '@/components/translation/TranslatableText';

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container-wide flex items-center justify-between h-16">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-vending-blue">
            Applestone Solutions
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-1">
          <NavLink to="/" active={isActive('/')}>
            <TranslatableText context="navigation">Home</TranslatableText>
          </NavLink>
          <NavLink to="/products" active={isActive('/products')}>
            <TranslatableText context="navigation">Products</TranslatableText>
          </NavLink>
          <NavLink to="/machines" active={isActive('/machines')}>
            <TranslatableText context="navigation">Machines</TranslatableText>
          </NavLink>
          <NavLink to="/business-goals" active={isActive('/business-goals')}>
            <TranslatableText context="navigation">Business Goals</TranslatableText>
          </NavLink>
          <Button asChild>
            <Link to="/contact" className="ml-2">
              <TranslatableText context="navigation">Contact</TranslatableText>
            </Link>
          </Button>
        </div>
        
        <div className="md:hidden">
          {/* Mobile menu button */}
          <button className="p-2">
            <span className="block w-6 h-0.5 bg-gray-600 mb-1"></span>
            <span className="block w-6 h-0.5 bg-gray-600 mb-1"></span>
            <span className="block w-6 h-0.5 bg-gray-600"></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) => {
  return (
    <Link
      to={to}
      className={cn(
        "px-3 py-2 rounded-md text-sm font-medium",
        active
          ? "bg-blue-50 text-vending-blue"
          : "text-gray-700 hover:bg-gray-100"
      )}
    >
      {children}
    </Link>
  );
};

export default Navigation;
