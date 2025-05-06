
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-gray-900">Applestone Solutions</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink href="/products">Products</NavLink>
            <NavLink href="/technology">Technology</NavLink>
            <NavLink href="/machines">Machines</NavLink>
            <Button asChild variant="default" className="bg-blue-600 hover:bg-blue-700">
              <Link to="/business-goals">Business Goals</Link>
            </Button>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/blog">Updates</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

// Simple NavLink component with TypeScript props
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => {
  return (
    <Link 
      to={href} 
      className="px-3 py-2 text-gray-700 hover:text-gray-900 font-medium text-sm"
    >
      {children}
    </Link>
  );
};

export default Header;
