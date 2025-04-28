
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CONTENTFUL_CONFIG, isContentfulConfigured } from '@/config/cms';
import { AlertCircle } from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
}

interface MainNavProps {
  items: NavItem[];
  className?: string;
}

export function MainNav({ items, className, ...props }: MainNavProps) {
  const isConfigured = isContentfulConfigured();
  
  return (
    <div className={cn('flex gap-6 md:gap-8', className)} {...props}>
      {items?.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            'flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm',
            item.disabled && 'cursor-not-allowed opacity-70'
          )}
        >
          {item.title}
        </Link>
      ))}
      
      {!isConfigured && (
        <Link 
          to="/admin/contentful-config"
          className={cn(
            'flex items-center text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors gap-1'
          )}
        >
          <AlertCircle className="h-4 w-4" />
          Configure Contentful
        </Link>
      )}
    </div>
  );
}
