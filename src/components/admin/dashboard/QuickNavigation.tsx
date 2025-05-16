
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  description: string;
  href: string;
  deprecated?: boolean;
}

interface QuickNavigationProps {
  items: NavItem[];
}

const QuickNavigation: React.FC<QuickNavigationProps> = ({ items }) => {
  return (
    <div className="flex space-x-1 overflow-x-auto pb-1 mb-4">
      {items.map((item) => (
        <Link
          key={item.title}
          to={item.href}
          className={cn(
            "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap",
            "bg-white border hover:bg-gray-50 transition-colors",
            item.deprecated 
              ? "text-amber-700 border-amber-300" 
              : "text-gray-700 border-gray-200"
          )}
        >
          {item.title}
          {item.deprecated && (
            <span className="ml-2 text-xs bg-amber-100 text-amber-800 rounded-full px-2 py-0.5">
              Deprecated
            </span>
          )}
        </Link>
      ))}
    </div>
  );
};

export default QuickNavigation;
