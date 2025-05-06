
import React from 'react';
import { MainNav } from './MainNav';
import { Link } from 'react-router-dom';
import NotificationManager from '@/components/common/NotificationManager';

// Define navigation items for MainNav
const navItems = [
  {
    title: "Products",
    href: "/products",
  },
  {
    title: "Technology",
    href: "/technology",
  },
  {
    title: "About",
    href: "/about",
  }
];

const Header = () => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-blue-600">Vending Solutions</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <NotificationManager small />
          <MainNav items={navItems} />
        </div>
      </div>
    </header>
  );
};

export default Header;
