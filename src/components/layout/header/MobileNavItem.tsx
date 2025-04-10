
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MobileNavItemProps {
  title: string;
  path: string;
}

const MobileNavItem = ({ title, path }: MobileNavItemProps) => {
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

export default MobileNavItem;
